const mongoose = require('mongoose');

const raveIdeaSchema = new mongoose.Schema({
  // Founder who posted the idea
  founder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Idea Details
  title: {
    type: String,
    required: [true, 'Idea title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    trim: true
  },
  
  tagline: {
    type: String,
    required: [true, 'Tagline is required'],
    maxlength: [300, 'Tagline cannot exceed 300 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  problemStatement: {
    type: String,
    required: [true, 'Problem statement is required'],
    maxlength: [2000, 'Problem statement cannot exceed 2000 characters']
  },
  
  solution: {
    type: String,
    required: [true, 'Solution is required'],
    maxlength: [2000, 'Solution cannot exceed 2000 characters']
  },
  
  // Categories
  industry: {
    type: String,
    enum: ['Tech', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Social', 'Gaming', 'Design', 'Marketing', 'Other'],
    required: true
  },
  
  stage: {
    type: String,
    enum: ['idea', 'mvp', 'beta', 'launched', 'growing'],
    default: 'idea'
  },
  
  // Media
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'link', 'document']
    },
    url: String,
    title: String
  }],
  
  // Skills Needed (for contributors)
  skillsNeeded: [{
    skill: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
      default: 'intermediate'
    },
    equityOffered: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  
  // Build Squad (Contributors)
  buildSquad: [{
    contributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true
    },
    skills: [String],
    equityShare: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    vestingPeriod: {
      type: Number, // in months
      default: 12
    },
    status: {
      type: String,
      enum: ['invited', 'accepted', 'active', 'left'],
      default: 'invited'
    },
    joinedAt: {
      type: Date
    },
    contributions: [{
      description: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  
  // Applications to join
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: String,
    skills: [String],
    message: {
      type: String,
      maxlength: 1000
    },
    portfolio: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Equity Distribution
  equityDistribution: {
    founder: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    availableEquity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    reservedForTeam: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // Funding & Resources
  fundingGoal: {
    type: Number,
    default: 0
  },
  
  fundingRaised: {
    type: Number,
    default: 0
  },
  
  // Timeline
  estimatedLaunchDate: Date,
  
  milestones: [{
    title: String,
    description: String,
    targetDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  
  // Engagement
  raveVibes: [{
    raveHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vibeType: {
      type: String,
      enum: ['fire', 'rocket', 'star', 'bulb', 'money'],
      default: 'fire'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  comments: [{
    raveHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Visibility & Status
  visibility: {
    type: String,
    enum: ['public', 'private', 'squad_only'],
    default: 'public'
  },
  
  status: {
    type: String,
    enum: ['open', 'building', 'launched', 'paused', 'closed'],
    default: 'open'
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  applicationCount: {
    type: Number,
    default: 0
  },
  
  shareCount: {
    type: Number,
    default: 0
  },
  
  // Featured/Trending
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  trendingScore: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});

// Indexes
raveIdeaSchema.index({ founder: 1, createdAt: -1 });
raveIdeaSchema.index({ industry: 1, status: 1 });
raveIdeaSchema.index({ status: 1, createdAt: -1 });
raveIdeaSchema.index({ trendingScore: -1 });

// Virtuals
raveIdeaSchema.virtual('totalVibes').get(function() {
  return this.raveVibes.length;
});

raveIdeaSchema.virtual('squadSize').get(function() {
  return this.buildSquad.filter(member => member.status === 'active').length;
});

raveIdeaSchema.virtual('totalEquityDistributed').get(function() {
  return this.buildSquad.reduce((sum, member) => sum + member.equityShare, 0);
});

// Methods
raveIdeaSchema.methods.addVibe = function(userId, vibeType = 'fire') {
  const existingVibe = this.raveVibes.find(
    vibe => vibe.raveHead.toString() === userId.toString()
  );
  
  if (!existingVibe) {
    this.raveVibes.push({ raveHead: userId, vibeType });
    this.trendingScore += 1;
  }
  return this.save();
};

raveIdeaSchema.methods.addApplication = function(userId, applicationData) {
  const existingApp = this.applications.find(
    app => app.applicant.toString() === userId.toString() && app.status === 'pending'
  );
  
  if (existingApp) {
    throw new Error('You already have a pending application');
  }
  
  this.applications.push({
    applicant: userId,
    ...applicationData
  });
  this.applicationCount += 1;
  return this.save();
};

raveIdeaSchema.methods.acceptApplication = function(applicationId, equityShare) {
  const application = this.applications.id(applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  if (application.status !== 'pending') {
    throw new Error('Application already processed');
  }
  
  application.status = 'accepted';
  
  this.buildSquad.push({
    contributor: application.applicant,
    role: application.role,
    skills: application.skills,
    equityShare: equityShare || 0,
    status: 'accepted',
    joinedAt: new Date()
  });
  
  this.equityDistribution.availableEquity -= equityShare;
  
  return this.save();
};

module.exports = mongoose.model('RaveIdea', raveIdeaSchema);
