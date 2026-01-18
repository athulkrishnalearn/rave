const mongoose = require('mongoose');

const freelanceOrderSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageSelected: {
    name: String,
    price: Number,
    deliveryTime: Number
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  escrowStatus: {
    type: String,
    enum: ['locked', 'released', 'refunded'],
    default: 'locked'
  },
  workSubmission: {
    fileUrl: String,
    description: String,
    submittedAt: Date
  },
  startedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('FreelanceOrder', freelanceOrderSchema);
