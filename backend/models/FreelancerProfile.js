const mongoose = require('mongoose');

const freelancerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  completedOrders: {
    type: Number,
    default: 0
  },
  responseRate: {
    type: Number,
    default: 100
  },
  onTimeDelivery: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FreelancerProfile', freelancerProfileSchema);
