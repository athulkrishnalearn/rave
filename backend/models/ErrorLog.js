const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['error', 'warning', 'info'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  stack: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  endpoint: {
    type: String
  },
  method: {
    type: String
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  statusCode: {
    type: Number
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin who resolved the error
  },
  resolvedAt: {
    type: Date
  },
  metadata: {
    type: Object
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);