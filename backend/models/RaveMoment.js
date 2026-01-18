const mongoose = require('mongoose');

const raveMomentSchema = new mongoose.Schema({
  // Author of the Rave Moment
  raveHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Type of Rave Moment
  momentType: {
    type: String,
    enum: ['rave_win', 'rave_progress', 'rave_session', 'rave_collab', 'rave_milestone'],
    required: true
  },
  
  // Content
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  
  // Media attachments
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'link']
    },
    url: String
  }],
  
  // Tags for discoverability
  raveTags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Engagement metrics
  raveVibes: [{
    raveHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vibeType: {
      type: String,
      enum: ['fire', 'rocket', 'star', 'clap', 'heart'],
      default: 'fire'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Comments (Rave Responses)
  raveResponses: [{
    raveHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    response: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Collaboration tracking
  isCollabPost: {
    type: Boolean,
    default: false
  },
  
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Visibility
  visibility: {
    type: String,
    enum: ['public', 'rave_heads_only', 'crew_only'],
    default: 'public'
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  shareCount: {
    type: Number,
    default: 0
  },
  
  // Pinned status
  isPinned: {
    type: Boolean,
    default: false
  },
  
  // Report/moderation
  isReported: {
    type: Boolean,
    default: false
  },
  
  reportCount: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});

// Indexes for performance
raveMomentSchema.index({ raveHead: 1, createdAt: -1 });
raveMomentSchema.index({ momentType: 1, createdAt: -1 });
raveMomentSchema.index({ raveTags: 1 });
raveMomentSchema.index({ createdAt: -1 });

// Virtual for total vibes count
raveMomentSchema.virtual('totalVibes').get(function() {
  return this.raveVibes.length;
});

// Virtual for total responses count
raveMomentSchema.virtual('totalResponses').get(function() {
  return this.raveResponses.length;
});

// Method to add a vibe
raveMomentSchema.methods.addVibe = function(userId, vibeType = 'fire') {
  const existingVibe = this.raveVibes.find(
    vibe => vibe.raveHead.toString() === userId.toString()
  );
  
  if (!existingVibe) {
    this.raveVibes.push({ raveHead: userId, vibeType });
  }
  return this.save();
};

// Method to remove a vibe
raveMomentSchema.methods.removeVibe = function(userId) {
  this.raveVibes = this.raveVibes.filter(
    vibe => vibe.raveHead.toString() !== userId.toString()
  );
  return this.save();
};

// Method to add a response
raveMomentSchema.methods.addResponse = function(userId, responseText) {
  this.raveResponses.push({
    raveHead: userId,
    response: responseText
  });
  return this.save();
};

module.exports = mongoose.model('RaveMoment', raveMomentSchema);
