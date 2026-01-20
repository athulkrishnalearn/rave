const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password with queries by default
  },
  userType: {
    type: String,
    enum: ['creator', 'sales_agent', 'company', 'management', 'admin', 'support', 'freelancer', 'client'],
    required: true
  },
  nationalIdNumber: {
    type: String,
    required: false, // Made optional to allow registration without ID initially
    // Removing unique constraint temporarily to fix registration issues
    // unique: true, // Only make unique when we have a proper solution for null values
    default: '', // Use empty string instead of null to avoid unique constraint issues
    trim: true
  },
  nationalIdImage: {
    type: String, // Path to uploaded ID image
    required: false // Made optional to allow registration without file initially
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  socialAccounts: [{
    platform: {
      type: String,
      enum: ['instagram', 'twitter', 'youtube', 'tiktok', 'facebook', 'linkedin'],
      required: true
    },
    username: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    followers: {
      type: Number,
      default: 0
    }
  }],
  affiliateLinks: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    link: {
      type: String,
      required: true
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    earnings: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  leads: [{
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead'
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'lost'],
      default: 'new'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  weeklyTestScore: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  companiesAssigned: [{
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);