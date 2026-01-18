const User = require('../models/User');
const Company = require('../models/Company');
const Product = require('../models/Product');
const Lead = require('../models/Lead');
const Promotion = require('../models/Promotion');
const RaveMoment = require('../models/RaveMoment');
const RaveIdea = require('../models/RaveIdea');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { userType, page = 1, limit = 10, search } = req.query;

    // Build filter
    let filter = {};
    if (userType) {
      filter.userType = userType;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting users',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'email', 'phone', 'userType', 'isVerified', 'verificationStatus', 'isActive'];
    const updates = {};

    // Only allow specific fields to be updated
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      error: error.message
    });
  }
};

// Create staff user
exports.createStaff = async (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;

    // Validate user type
    if (!['admin', 'support'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Staff user type must be admin or support'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }

    // Create staff user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      userType,
      nationalIdNumber: `STAFF-${Date.now()}`, // Staff don't need real national ID
      nationalIdImage: 'staff_default.jpg', // Staff don't need real ID image
      isVerified: true,
      verificationStatus: 'verified'
    });

    res.status(201).json({
      success: true,
      message: 'Staff user created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating staff',
      error: error.message
    });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Build filter
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } }
      ];
    }

    // Get companies with pagination
    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Company.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting companies',
      error: error.message
    });
  }
};

// Create company
exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating company',
      error: error.message
    });
  }
};

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating company',
      error: error.message
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, companyId } = req.query;

    // Build filter
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (companyId) {
      filter.company = companyId;
    }

    // Get products with pagination and populate company info
    const products = await Product.find(filter)
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting products',
      error: error.message
    });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // Add product to company's product list
    await Company.findByIdAndUpdate(
      req.body.company,
      { $push: { products: product._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product',
      error: error.message
    });
  }
};

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, companyId, assignedTo } = req.query;

    // Build filter
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (companyId) {
      filter.company = companyId;
    }
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Get leads with pagination and populate related data
    const leads = await Lead.find(filter)
      .populate('company', 'name')
      .populate('assignedTo', 'name email')
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
    console.error('Get all leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting leads',
      error: error.message
    });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.leadId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('company', 'name').populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating lead',
      error: error.message
    });
  }
};

// Get system statistics
exports.getSystemStats = async (req, res) => {
  try {
    // Get counts for different entities
    const userCount = await User.countDocuments();
    const companyCount = await Company.countDocuments();
    const productCount = await Product.countDocuments();
    const leadCount = await Lead.countDocuments();

    // Get user counts by type
    const userTypeCounts = await User.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get lead status counts
    const leadStatusCounts = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount,
        totalCompanies: companyCount,
        totalProducts: productCount,
        totalLeads: leadCount,
        userTypeCounts,
        leadStatusCounts
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting system stats',
      error: error.message
    });
  }
};

// Ban/Suspend user
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration } = req.body; // duration in days

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    user.banReason = reason;
    if (duration) {
      user.banUntil = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      data: user
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error banning user',
      error: error.message
    });
  }
};

// Unban user
exports.unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = true;
    user.banReason = undefined;
    user.banUntil = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User unbanned successfully',
      data: user
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error unbanning user',
      error: error.message
    });
  }
};

// Get platform analytics
exports.getPlatformAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalRaveHeads = await User.countDocuments({ userType: { $in: ['creator', 'sales', 'freelancer'] } });
    const totalCreators = await User.countDocuments({ userType: 'creator' });
    const totalSalesAgents = await User.countDocuments({ userType: 'sales' });
    const totalFreelancers = await User.countDocuments({ userType: 'freelancer' });
    const totalCompanies = await Company.countDocuments();

    // Activity counts
    const totalRaveMoments = await RaveMoment.countDocuments();
    const totalRaveIdeas = await RaveIdea.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Recent signups
    const recentUsers = await User.find()
      .select('name email userType isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Daily active users (users who logged in today)
    const dailyActiveUsers = await User.countDocuments({
      lastLogin: { $gte: oneDayAgo }
    });

    // Weekly growth
    const usersLastWeek = await User.countDocuments({
      createdAt: { $lt: oneWeekAgo }
    });
    const usersThisWeek = totalUsers - usersLastWeek;
    const weeklyGrowth = usersLastWeek > 0 ? ((usersThisWeek / usersLastWeek) * 100).toFixed(1) : 0;

    // Flagged content
    const flaggedMoments = await RaveMoment.find({ flagged: true, flagStatus: 'pending' })
      .populate('raveHead', 'name')
      .limit(10);

    const flaggedIdeas = await RaveIdea.find({ flagged: true, flagStatus: 'pending' })
      .populate('founder', 'name')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          raveHeads: totalRaveHeads,
          creators: totalCreators,
          salesAgents: totalSalesAgents,
          freelancers: totalFreelancers,
          companies: totalCompanies,
          activeRaveMoments: totalRaveMoments,
          activeRaveIdeas: totalRaveIdeas,
          activeGigs: totalProducts,
          dailyActiveUsers,
          weeklyGrowth: parseFloat(weeklyGrowth)
        },
        recentUsers,
        flaggedContent: {
          moments: flaggedMoments,
          ideas: flaggedIdeas
        }
      }
    });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting analytics',
      error: error.message
    });
  }
};

// Moderate content (approve/remove)
exports.moderateContent = async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'remove'

    let content;
    if (contentType === 'moment') {
      content = await RaveMoment.findById(contentId);
    } else if (contentType === 'idea') {
      content = await RaveIdea.findById(contentId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    if (action === 'approve') {
      content.flagged = false;
      content.flagStatus = 'approved';
    } else if (action === 'remove') {
      content.flagStatus = 'removed';
      content.moderationReason = reason;
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: `Content ${action}d successfully`,
      data: content
    });
  } catch (error) {
    console.error('Moderate content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error moderating content',
      error: error.message
    });
  }
};

// System configuration
exports.updateSystemConfig = async (req, res) => {
  try {
    const { setting, value } = req.body;

    // This would typically update a SystemConfig model
    // For now, we'll return success
    res.status(200).json({
      success: true,
      message: 'System configuration updated',
      data: { setting, value }
    });
  } catch (error) {
    console.error('Update system config error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating configuration',
      error: error.message
    });
  }
};

// Broadcast message to all users
exports.broadcastMessage = async (req, res) => {
  try {
    const { title, message, userType } = req.body;

    let filter = {};
    if (userType && userType !== 'all') {
      filter.userType = userType;
    }

    const users = await User.find(filter).select('email name');

    // In a real app, this would send emails or notifications
    // For now, we'll just return success with user count
    res.status(200).json({
      success: true,
      message: 'Broadcast message sent',
      data: {
        title,
        message,
        recipientCount: users.length
      }
    });
  } catch (error) {
    console.error('Broadcast message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending broadcast',
      error: error.message
    });
  }
};