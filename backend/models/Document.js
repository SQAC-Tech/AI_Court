const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'doc', 'docx', 'txt']
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileContent: {
    type: String, // Base64 encoded content
    required: true
  },
  uploadedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    }
  },
  aiAnalysis: {
    type: String,
    default: 'AI analysis pending...'
  },
  isSigned: {
    type: Boolean,
    default: false
  },
  signedBy: {
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    courtEmail: String,
    courtName: String,
    signedAt: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
documentSchema.index({ uploadedBy: 1, createdAt: -1 });
documentSchema.index({ isSigned: 1 });
documentSchema.index({ status: 1 });

module.exports = mongoose.model('Document', documentSchema); 