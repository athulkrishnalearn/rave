const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Promotion title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['contest', 'promotion', 'discount', 'bonus'],
    required: true
  },
  reward: {
    type: String,
    required: [true, 'Reward is required'],
    maxlength: [200, 'Reward description cannot be more than 200 characters']
  },
  criteria: {
    type: String,
    required: [true, 'Criteria is required'],
    maxlength: [500, 'Criteria cannot be more than 500 characters']
  },
  targetAmount: {
    type: Number,
    min: [0, 'Target amount cannot be negative']
  },
  targetAction: {
    type: String,
    enum: ['sales', 'signups', 'referrals', 'engagement', 'other'],
    default: 'sales'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      current: {
        type: Number,
        default: 0
      },
      target: {
        type: Number
      }
    },
    status: {
      type: String,
      enum: ['participating', 'completed', 'won', 'not_qualified'],
      default: 'participating'
    }
  }],
  maxParticipants: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Promotion', promotionSchema);