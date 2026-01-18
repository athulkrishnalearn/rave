const mongoose = require('mongoose');

const affiliateLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
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
  socialPlatform: {
    type: String,
    enum: ['instagram', 'twitter', 'youtube', 'tiktok', 'facebook', 'linkedin', 'website', 'blog'],
    required: true
  },
  socialUsername: {
    type: String,
    required: true
  },
  customParams: {
    type: Map,
    of: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastClicked: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AffiliateLink', affiliateLinkSchema);