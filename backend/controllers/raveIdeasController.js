const RaveIdea = require('../models/RaveIdea');

// @desc    Get all Rave Ideas
// @route   GET /api/v1/rave-ideas
// @access  Private
exports.getRaveIdeas = async (req, res) => {
  try {
    const { page = 1, limit = 20, industry, status, stage } = req.query;
    
    const query = {};
    
    if (industry) query.industry = industry;
    if (status) query.status = status;
    if (stage) query.stage = stage;
    
    const ideas = await RaveIdea.find(query)
      .populate('founder', 'name profilePicture userType')
      .populate('buildSquad.contributor', 'name profilePicture')
      .sort('-trendingScore -createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await RaveIdea.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: ideas.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: ideas
    });
  } catch (error) {
    console.error('Get Rave Ideas error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Rave Ideas',
      error: error.message
    });
  }
};

// @desc    Create a Rave Idea
// @route   POST /api/v1/rave-ideas
// @access  Private
exports.createRaveIdea = async (req, res) => {
  try {
    const ideaData = {
      ...req.body,
      founder: req.user.id
    };
    
    const idea = await RaveIdea.create(ideaData);
    
    const populatedIdea = await RaveIdea.findById(idea._id)
      .populate('founder', 'name profilePicture userType');
    
    res.status(201).json({
      success: true,
      data: populatedIdea
    });
  } catch (error) {
    console.error('Create Rave Idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Rave Idea',
      error: error.message
    });
  }
};

// @desc    Get single Rave Idea
// @route   GET /api/v1/rave-ideas/:id
// @access  Private
exports.getRaveIdea = async (req, res) => {
  try {
    const idea = await RaveIdea.findById(req.params.id)
      .populate('founder', 'name profilePicture userType email')
      .populate('buildSquad.contributor', 'name profilePicture userType')
      .populate('applications.applicant', 'name profilePicture userType')
      .populate('raveVibes.raveHead', 'name')
      .populate('comments.raveHead', 'name profilePicture');
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Rave Idea not found'
      });
    }
    
    // Increment view count
    idea.viewCount += 1;
    await idea.save();
    
    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (error) {
    console.error('Get Rave Idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Rave Idea',
      error: error.message
    });
  }
};

// @desc    Apply to join Build Squad
// @route   POST /api/v1/rave-ideas/:id/apply
// @access  Private
exports.applyToIdea = async (req, res) => {
  try {
    const { role, skills, message, portfolio } = req.body;
    
    if (!role || !skills || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Role and skills are required'
      });
    }
    
    const idea = await RaveIdea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Rave Idea not found'
      });
    }
    
    // Check if user is the founder
    if (idea.founder.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Founders cannot apply to their own ideas'
      });
    }
    
    await idea.addApplication(req.user.id, { role, skills, message, portfolio });
    
    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: idea
    });
  } catch (error) {
    console.error('Apply to Idea error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error submitting application'
    });
  }
};

// @desc    Accept/Reject application
// @route   PUT /api/v1/rave-ideas/:id/applications/:applicationId
// @access  Private (Founder only)
exports.handleApplication = async (req, res) => {
  try {
    const { status, equityShare } = req.body;
    
    const idea = await RaveIdea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Rave Idea not found'
      });
    }
    
    // Check if user is the founder
    if (idea.founder.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the founder can manage applications'
      });
    }
    
    if (status === 'accepted') {
      await idea.acceptApplication(req.params.applicationId, equityShare);
    } else if (status === 'rejected') {
      const application = idea.applications.id(req.params.applicationId);
      if (application) {
        application.status = 'rejected';
        await idea.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (error) {
    console.error('Handle Application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error handling application'
    });
  }
};

// @desc    Add Rave Vibe
// @route   POST /api/v1/rave-ideas/:id/vibe
// @access  Private
exports.addVibe = async (req, res) => {
  try {
    const { vibeType = 'fire' } = req.body;
    
    const idea = await RaveIdea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Rave Idea not found'
      });
    }
    
    await idea.addVibe(req.user.id, vibeType);
    
    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (error) {
    console.error('Add Vibe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding vibe',
      error: error.message
    });
  }
};

// @desc    Add comment
// @route   POST /api/v1/rave-ideas/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }
    
    const idea = await RaveIdea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Rave Idea not found'
      });
    }
    
    idea.comments.push({
      raveHead: req.user.id,
      comment
    });
    
    await idea.save();
    
    const updatedIdea = await RaveIdea.findById(req.params.id)
      .populate('comments.raveHead', 'name profilePicture');
    
    res.status(200).json({
      success: true,
      data: updatedIdea
    });
  } catch (error) {
    console.error('Add Comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// @desc    Update Rave Idea
// @route   PUT /api/v1/rave-ideas/:id
// @access  Private (Founder only)
exports.updateRaveIdea = async (req, res) => {
  try {
    const idea = await RaveIdea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Rave Idea not found'
      });
    }
    
    // Check if user is the founder
    if (idea.founder.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the founder can update this idea'
      });
    }
    
    const updatedIdea = await RaveIdea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('founder', 'name profilePicture userType');
    
    res.status(200).json({
      success: true,
      data: updatedIdea
    });
  } catch (error) {
    console.error('Update Rave Idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating Rave Idea',
      error: error.message
    });
  }
};

// @desc    Delete Rave Idea
// @route   DELETE /api/v1/rave-ideas/:id
// @access  Private (Founder only)
exports.deleteRaveIdea = async (req, res) => {
  try {
    const idea = await RaveIdea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Rave Idea not found'
      });
    }
    
    // Check if user is the founder
    if (idea.founder.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the founder can delete this idea'
      });
    }
    
    await idea.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Rave Idea deleted'
    });
  } catch (error) {
    console.error('Delete Rave Idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting Rave Idea',
      error: error.message
    });
  }
};
