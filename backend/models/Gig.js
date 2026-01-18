const mongoose = require('mongoose');

const gigPackageSchema = new mongoose.Schema({
  name: {
    type: String, // Basic, Standard, Premium
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deliveryTime: {
    type: Number, // In days
    required: true
  },
  revisions: {
    type: Number,
    default: 1
  }
});

const gigSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  packages: [gigPackageSchema],
  active: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gig', gigSchema);
