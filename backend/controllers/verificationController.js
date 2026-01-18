const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for national ID uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/national-ids/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with user ID and timestamp
    cb(null, `national-id-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only image files (jpg, jpeg, png).'), false);
  }
};

exports.upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Submit national ID for verification
exports.submitVerification = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a national ID image'
      });
    }

    // Update user with national ID image path and set verification status to pending
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        nationalIdImage: req.file.path,
        verificationStatus: 'pending',
        isVerified: false
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'National ID submitted for verification successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        verificationStatus: user.verificationStatus,
        nationalIdImage: user.nationalIdImage
      }
    });
  } catch (error) {
    console.error('Verification submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification submission',
      error: error.message
    });
  }
};

// Get verification status
exports.getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('verificationStatus isVerified nationalIdImage');

    res.status(200).json({
      success: true,
      data: {
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified,
        nationalIdImage: user.nationalIdImage
      }
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting verification status',
      error: error.message
    });
  }
};

// Admin: Get all pending verifications
exports.getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({ 
      verificationStatus: 'pending' 
    }).select('name email phone nationalIdNumber nationalIdImage createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting pending verifications',
      error: error.message
    });
  }
};

// Admin: Verify user
exports.verifyUser = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: 'User ID and status are required'
      });
    }

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "verified" or "rejected"'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        verificationStatus: status,
        isVerified: status === 'verified'
      },
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
      message: `User ${status} successfully`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user verification',
      error: error.message
    });
  }
};

// Admin: Get user verification details
exports.getUserVerificationDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email phone nationalIdNumber nationalIdImage verificationStatus isVerified createdAt');

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
    console.error('Get user verification details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user verification details',
      error: error.message
    });
  }
};