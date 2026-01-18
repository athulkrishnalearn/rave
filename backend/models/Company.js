const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Company description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  logoUrl: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/i, 'Please enter a valid website URL']
  },
  industry: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  contactPhone: {
    type: String,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  salesAgents: [{
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'terminated'],
      default: 'pending'
    }
  }],
  leads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  }],
  totalRevenue: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);