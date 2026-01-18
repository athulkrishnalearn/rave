const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success', 'system'],
    default: 'info',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'critical'],
    default: 'normal'
  },
  recipient: {
    type: String,
    enum: ['all_admins', 'specific_admins'],
    default: 'all_admins'
  },
  recipientIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    relatedModel: String, // Related model name (e.g., 'User', 'Lead', 'Ticket')
    relatedId: mongoose.Schema.Types.ObjectId // Related document ID
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);