const Promotion = require('../models/Promotion');
const User = require('../models/User');

// Get all active promotions
exports.getActivePromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({ 
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: promotions.length,
      data: promotions
    });
  } catch (error) {
    console.error('Get active promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting active promotions',
      error: error.message
    });
  }
};

// Get all promotions (admin only)
exports.getAllPromotions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, isActive } = req.query;

    // Build filter
    let filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Get promotions with pagination
    const promotions = await Promotion.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Promotion.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: promotions.length,
      data: promotions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting promotions',
      error: error.message
    });
  }
};

// Get promotion by ID
exports.getPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.promotionId);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    res.status(200).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error('Get promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting promotion',
      error: error.message
    });
  }
};

// Create a new promotion (admin only)
exports.createPromotion = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      reward,
      criteria,
      targetAmount,
      targetAction,
      startDate,
      endDate,
      maxParticipants,
      imageUrl
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !reward || !criteria || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, type, reward, criteria, start date, and end date are required'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Create promotion
    const promotion = await Promotion.create({
      title,
      description,
      type,
      reward,
      criteria,
      targetAmount: targetAmount || 0,
      targetAction: targetAction || 'sales',
      startDate: start,
      endDate: end,
      maxParticipants: maxParticipants || 0,
      imageUrl: imageUrl || ''
    });

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: promotion
    });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating promotion',
      error: error.message
    });
  }
};

// Update a promotion (admin only)
exports.updatePromotion = async (req, res) => {
  try {
    const allowedUpdates = [
      'title', 'description', 'type', 'reward', 'criteria', 
      'targetAmount', 'targetAction', 'startDate', 'endDate', 
      'isActive', 'maxParticipants', 'imageUrl'
    ];
    
    const updates = {};

    // Only allow specific fields to be updated
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle date validation if dates are being updated
    if (updates.startDate || updates.endDate) {
      const start = updates.startDate ? new Date(updates.startDate) : new Date(req.body.startDate);
      const end = updates.endDate ? new Date(updates.endDate) : new Date(req.body.endDate);
      
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }

      if (updates.startDate) updates.startDate = start;
      if (updates.endDate) updates.endDate = end;
    }

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.promotionId,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promotion updated successfully',
      data: promotion
    });
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating promotion',
      error: error.message
    });
  }
};

// Delete a promotion (admin only)
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.promotionId);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promotion deleted successfully'
    });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting promotion',
      error: error.message
    });
  }
};

// Join a promotion
exports.joinPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.promotionId);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Check if promotion is active
    if (!promotion.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Promotion is not active'
      });
    }

    // Check if promotion has started
    if (new Date(promotion.startDate) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Promotion has not started yet'
      });
    }

    // Check if promotion has ended
    if (new Date(promotion.endDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Promotion has ended'
      });
    }

    // Check if user has already joined
    const existingParticipant = promotion.participants.find(
      participant => participant.userId.toString() === req.user.id.toString()
    );

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this promotion'
      });
    }

    // Check if max participants limit reached
    if (promotion.maxParticipants > 0 && promotion.participants.length >= promotion.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Maximum number of participants reached for this promotion'
      });
    }

    // Add user as participant
    promotion.participants.push({
      userId: req.user.id,
      progress: {
        current: 0,
        target: promotion.targetAmount
      }
    });

    await promotion.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined promotion',
      data: {
        promotionId: promotion._id,
        title: promotion.title,
        targetAmount: promotion.targetAmount,
        targetAction: promotion.targetAction
      }
    });
  } catch (error) {
    console.error('Join promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error joining promotion',
      error: error.message
    });
  }
};

// Get user's promotion participation
exports.getMyPromotions = async (req, res) => {
  try {
    // Find promotions where the user is participating
    const promotions = await Promotion.find({
      'participants.userId': req.user.id
    });

    // Format the response to include user's progress
    const formattedPromotions = promotions.map(promo => {
      const participant = promo.participants.find(
        p => p.userId.toString() === req.user.id.toString()
      );
      
      return {
        _id: promo._id,
        title: promo.title,
        description: promo.description,
        type: promo.type,
        reward: promo.reward,
        startDate: promo.startDate,
        endDate: promo.endDate,
        isActive: promo.isActive,
        progress: participant.progress,
        status: participant.status
      };
    });

    res.status(200).json({
      success: true,
      count: formattedPromotions.length,
      data: formattedPromotions
    });
  } catch (error) {
    console.error('Get my promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting your promotions',
      error: error.message
    });
  }
};

// Update user's progress in a promotion (typically called internally by system events)
exports.updateProgress = async (req, res) => {
  try {
    const { promotionId, increment } = req.body;

    if (!increment || increment <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Increment value must be greater than 0'
      });
    }

    const promotion = await Promotion.findById(promotionId);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Find the participant
    const participantIndex = promotion.participants.findIndex(
      p => p.userId.toString() === req.user.id.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not participating in this promotion'
      });
    }

    // Update progress
    promotion.participants[participantIndex].progress.current += increment;

    // Check if target is achieved
    if (promotion.participants[participantIndex].progress.current >= promotion.targetAmount) {
      promotion.participants[participantIndex].status = 'completed';
      
      // If the user hasn't already won, mark as winner
      if (promotion.participants[participantIndex].status !== 'won') {
        promotion.participants[participantIndex].status = 'won';
      }
    }

    await promotion.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        promotionId: promotion._id,
        currentProgress: promotion.participants[participantIndex].progress.current,
        target: promotion.targetAmount,
        status: promotion.participants[participantIndex].status
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating progress',
      error: error.message
    });
  }
};

// Admin: Get promotion participants
exports.getParticipants = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.promotionId)
      .populate('participants.userId', 'name email userType');

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    res.status(200).json({
      success: true,
      count: promotion.participants.length,
      data: promotion.participants
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting participants',
      error: error.message
    });
  }
};