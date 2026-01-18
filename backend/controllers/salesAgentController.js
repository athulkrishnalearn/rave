const User = require('../models/User');
const Company = require('../models/Company');
const Lead = require('../models/Lead');
const Product = require('../models/Product');

// Get all available companies for sales agents
exports.getAvailableCompanies = async (req, res) => {
  try {
    // Get companies that have products and are active
    const companies = await Company.find({ 
      isActive: true 
    })
    .populate({
      path: 'products',
      match: { isActive: true },
      select: 'name description price commissionRate'
    })
    .select('name description logoUrl industry totalRevenue');

    // Filter out companies that don't have any active products
    const companiesWithProducts = companies.filter(company => 
      company.products && company.products.length > 0
    );

    res.status(200).json({
      success: true,
      count: companiesWithProducts.length,
      data: companiesWithProducts
    });
  } catch (error) {
    console.error('Get available companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting available companies',
      error: error.message
    });
  }
};

// Get assigned companies for the sales agent
exports.getAssignedCompanies = async (req, res) => {
  try {
    const salesAgent = await User.findById(req.user.id)
      .populate({
        path: 'companiesAssigned.companyId',
        select: 'name description logoUrl industry'
      });

    const assignedCompanies = salesAgent.companiesAssigned
      .filter(assignment => assignment.status === 'active')
      .map(assignment => ({
        ...assignment.companyId._doc,
        assignedAt: assignment.assignedAt
      }));

    res.status(200).json({
      success: true,
      count: assignedCompanies.length,
      data: assignedCompanies
    });
  } catch (error) {
    console.error('Get assigned companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting assigned companies',
      error: error.message
    });
  }
};

// Request to join a company
exports.requestCompanyAccess = async (req, res) => {
  try {
    const { companyId } = req.body;

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if already requested or assigned
    const salesAgent = await User.findById(req.user.id);
    const existingRequest = salesAgent.companiesAssigned.find(
      assignment => assignment.companyId.toString() === companyId
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Already requested/assigned to this company'
      });
    }

    // Add to companies assigned with pending status
    salesAgent.companiesAssigned.push({
      companyId: company._id,
      status: 'pending'
    });

    await salesAgent.save();

    res.status(200).json({
      success: true,
      message: 'Request to join company submitted successfully',
      data: {
        companyId: company._id,
        companyName: company.name,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Request company access error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error requesting company access',
      error: error.message
    });
  }
};

// Get leads assigned to the sales agent
exports.getLeads = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = { assignedTo: req.user.id };
    if (status) {
      filter.status = status;
    }

    // Get leads with pagination
    const leads = await Lead.find(filter)
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting leads',
      error: error.message
    });
  }
};

// Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost', 'follow_up'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find and update lead
    const lead = await Lead.findOneAndUpdate(
      { 
        _id: leadId, 
        assignedTo: req.user.id // Ensure the lead is assigned to this agent
      },
      { 
        status,
        ...(notes && { notes }),
        lastContacted: new Date()
      },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('company', 'name');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating lead status',
      error: error.message
    });
  }
};

// Get lead details
exports.getLeadDetails = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.leadId,
      assignedTo: req.user.id
    }).populate('company', 'name description');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting lead details',
      error: error.message
    });
  }
};

// Submit weekly test score
exports.submitWeeklyTest = async (req, res) => {
  try {
    const { score } = req.body;

    // Validate score
    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 0 and 100'
      });
    }

    // Update user's weekly test score
    const salesAgent = await User.findByIdAndUpdate(
      req.user.id,
      {
        weeklyTestScore: {
          score,
          date: new Date()
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Weekly test score submitted successfully',
      data: {
        score: salesAgent.weeklyTestScore.score,
        date: salesAgent.weeklyTestScore.date
      }
    });
  } catch (error) {
    console.error('Submit weekly test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting weekly test',
      error: error.message
    });
  }
};

// Get sales agent performance summary
exports.getPerformanceSummary = async (req, res) => {
  try {
    const salesAgent = await User.findById(req.user.id);

    // Get leads assigned to this agent
    const leads = await Lead.find({ assignedTo: req.user.id });

    // Calculate performance metrics
    const totalLeads = leads.length;
    const contactedLeads = leads.filter(lead => lead.status !== 'new').length;
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Calculate earnings from converted leads (this is a simplified calculation)
    // In a real app, you would track actual earnings from conversions
    let totalEarnings = 0;
    for (const lead of leads) {
      if (lead.status === 'converted' && lead.value && lead.value.actualValue) {
        totalEarnings += lead.value.actualValue;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        contactedLeads,
        convertedLeads,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        totalEarnings
      }
    });
  } catch (error) {
    console.error('Get performance summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting performance summary',
      error: error.message
    });
  }
};

// Get weekly test history
exports.getWeeklyTestHistory = async (req, res) => {
  try {
    const salesAgent = await User.findById(req.user.id).select('weeklyTestScore');

    res.status(200).json({
      success: true,
      data: salesAgent.weeklyTestScore
    });
  } catch (error) {
    console.error('Get weekly test history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting weekly test history',
      error: error.message
    });
  }
};