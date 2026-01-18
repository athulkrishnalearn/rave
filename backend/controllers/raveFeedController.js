const RaveMoment = require('../models/RaveMoment');

// @desc    Get all Rave Moments (Feed)
// @route   GET /api/v1/rave-feed
// @access  Private
exports.getRaveFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20, momentType, raveTags } = req.query;
    
    const query = {};
    
    // Filter by moment type
    if (momentType) {
      query.momentType = momentType;
    }
    
    // Filter by tags
    if (raveTags) {
      query.raveTags = { $in: raveTags.split(',') };
    }
    
    const moments = await RaveMoment.find(query)
      .populate('raveHead', 'name profilePicture userType')
      .populate('collaborators', 'name profilePicture')
      .populate('raveVibes.raveHead', 'name')
      .populate('raveResponses.raveHead', 'name profilePicture')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await RaveMoment.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: moments.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: moments
    });
  } catch (error) {
    console.error('Get Rave Feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Rave Feed',
      error: error.message
    });
  }
};

// @desc    Create a Rave Moment
// @route   POST /api/v1/rave-feed
// @access  Private
exports.createRaveMoment = async (req, res) => {
  try {
    const { momentType, content, media, raveTags, collaborators, visibility } = req.body;
    
    const moment = await RaveMoment.create({
      raveHead: req.user.id,
      momentType,
      content,
      media,
      raveTags,
      collaborators,
      visibility,
      isCollabPost: collaborators && collaborators.length > 0
    });
    
    const populatedMoment = await RaveMoment.findById(moment._id)
      .populate('raveHead', 'name profilePicture userType')
      .populate('collaborators', 'name profilePicture');
    
    res.status(201).json({
      success: true,
      data: populatedMoment
    });
  } catch (error) {
    console.error('Create Rave Moment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Rave Moment',
      error: error.message
    });
  }
};

// @desc    Get single Rave Moment
// @route   GET /api/v1/rave-feed/:id
// @access  Private
exports.getRaveMoment = async (req, res) => {
  try {
    const moment = await RaveMoment.findById(req.params.id)
      .populate('raveHead', 'name profilePicture userType')
      .populate('collaborators', 'name profilePicture')
      .populate('raveVibes.raveHead', 'name profilePicture')
      .populate('raveResponses.raveHead', 'name profilePicture');
    
    if (!moment) {
      return res.status(404).json({
        success: false,
        message: 'Rave Moment not found'
      });
    }
    
    // Increment view count
    moment.viewCount += 1;
    await moment.save();
    
    res.status(200).json({
      success: true,
      data: moment
    });
  } catch (error) {
    console.error('Get Rave Moment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Rave Moment',
      error: error.message
    });
  }
};

// @desc    Add a Rave Vibe (like)
// @route   POST /api/v1/rave-feed/:id/vibe
// @access  Private
exports.addRaveVibe = async (req, res) => {
  try {
    const { vibeType = 'fire' } = req.body;
    const moment = await RaveMoment.findById(req.params.id);
    
    if (!moment) {
      return res.status(404).json({
        success: false,
        message: 'Rave Moment not found'
      });
    }
    
    await moment.addVibe(req.user.id, vibeType);
    
    res.status(200).json({
      success: true,
      data: moment
    });
  } catch (error) {
    console.error('Add Rave Vibe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding vibe',
      error: error.message
    });
  }
};

// @desc    Remove a Rave Vibe
// @route   DELETE /api/v1/rave-feed/:id/vibe
// @access  Private
exports.removeRaveVibe = async (req, res) => {
  try {
    const moment = await RaveMoment.findById(req.params.id);
    
    if (!moment) {
      return res.status(404).json({
        success: false,
        message: 'Rave Moment not found'
      });
    }
    
    await moment.removeVibe(req.user.id);
    
    res.status(200).json({
      success: true,
      data: moment
    });
  } catch (error) {
    console.error('Remove Rave Vibe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing vibe',
      error: error.message
    });
  }
};

// @desc    Add a Rave Response (comment)
// @route   POST /api/v1/rave-feed/:id/response
// @access  Private
exports.addRaveResponse = async (req, res) => {
  try {
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Response text is required'
      });
    }
    
    const moment = await RaveMoment.findById(req.params.id);
    
    if (!moment) {
      return res.status(404).json({
        success: false,
        message: 'Rave Moment not found'
      });
    }
    
    await moment.addResponse(req.user.id, response);
    
    const updatedMoment = await RaveMoment.findById(req.params.id)
      .populate('raveResponses.raveHead', 'name profilePicture');
    
    res.status(200).json({
      success: true,
      data: updatedMoment
    });
  } catch (error) {
    console.error('Add Rave Response error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding response',
      error: error.message
    });
  }
};

// @desc    Delete a Rave Moment
// @route   DELETE /api/v1/rave-feed/:id
// @access  Private
exports.deleteRaveMoment = async (req, res) => {
  try {
    const moment = await RaveMoment.findById(req.params.id);
    
    if (!moment) {
      return res.status(404).json({
        success: false,
        message: 'Rave Moment not found'
      });
    }
    
    // Check if user is the author
    if (moment.raveHead.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this moment'
      });
    }
    
    await moment.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Rave Moment deleted'
    });
  } catch (error) {
    console.error('Delete Rave Moment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting Rave Moment',
      error: error.message
    });
  }
};
