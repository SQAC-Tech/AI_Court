const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { verifyJWT, requireRole } = require('../middleware/auth');
const Document = require('../models/Document');
const User = require('../models/User');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
    }
  }
});

// Upload document
router.post('/upload', verifyJWT, upload.single('document'), [
  body('description').optional().trim(),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    const { description, tags } = req.body;
    const file = req.file;

    // Determine file type
    let fileType = 'txt';
    if (file.mimetype === 'application/pdf') fileType = 'pdf';
    else if (file.mimetype === 'application/msword') fileType = 'doc';
    else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') fileType = 'docx';

    // Convert file to base64
    const fileContent = file.buffer.toString('base64');

    // Generate unique filename
    const filename = `${Date.now()}-${file.originalname}`;

    // Create document
    const document = new Document({
      filename,
      originalName: file.originalname,
      fileType,
      fileSize: file.size,
      fileContent,
      uploadedBy: {
        userId: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName
      },
      description,
      tags: tags ? JSON.parse(tags) : []
    });

    await document.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        filename: document.filename,
        originalName: document.originalName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        uploadedBy: document.uploadedBy,
        description: document.description,
        tags: document.tags,
        createdAt: document.createdAt
      }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to upload document'
    });
  }
});

// Get user's documents
router.get('/my-documents', verifyJWT, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, isSigned } = req.query;
    const skip = (page - 1) * limit;

    const filter = { 'uploadedBy.userId': req.user._id };
    if (status) filter.status = status;
    if (isSigned !== undefined) filter.isSigned = isSigned === 'true';

    const documents = await Document.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-fileContent');

    const total = await Document.countDocuments(filter);

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get documents'
    });
  }
});

// Get all documents (court only)
router.get('/all', verifyJWT, requireRole(['court']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, isSigned, uploadedBy } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (isSigned !== undefined) filter.isSigned = isSigned === 'true';
    if (uploadedBy) filter['uploadedBy.userId'] = uploadedBy;

    const documents = await Document.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-fileContent')
      .populate('uploadedBy.userId', 'displayName email');

    const total = await Document.countDocuments(filter);

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all documents error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get documents'
    });
  }
});

// Get single document
router.get('/:id', verifyJWT, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy.userId', 'displayName email')
      .populate('signedBy.courtId', 'displayName email court designation');

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    // Check if user has access to this document
    if (req.user.role === 'user' && document.uploadedBy.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only access your own documents'
      });
    }

    res.json({
      document: {
        ...document.toJSON(),
        fileContent: undefined // Don't send file content in list view
      }
    });

  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get document'
    });
  }
});

// Download document
router.get('/:id/download', verifyJWT, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    // Check if user has access to this document
    if (req.user.role === 'user' && document.uploadedBy.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only download your own documents'
      });
    }

    // Convert base64 back to buffer
    const fileBuffer = Buffer.from(document.fileContent, 'base64');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.send(fileBuffer);

  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to download document'
    });
  }
});

// Sign document (court only)
router.patch('/:id/sign', verifyJWT, requireRole(['court']), async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    if (document.isSigned) {
      return res.status(400).json({
        error: 'Document already signed',
        message: 'This document has already been signed'
      });
    }

    // Update document with signature
    document.isSigned = true;
    document.signedBy = {
      courtId: req.user._id,
      courtEmail: req.user.email,
      courtName: req.user.displayName,
      signedAt: new Date()
    };
    document.status = 'approved';

    await document.save();

    res.json({
      message: 'Document signed successfully',
      document: {
        id: document._id,
        filename: document.filename,
        isSigned: document.isSigned,
        signedBy: document.signedBy,
        status: document.status
      }
    });

  } catch (error) {
    console.error('Sign document error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to sign document'
    });
  }
});

// Update document status (court only)
router.patch('/:id/status', verifyJWT, requireRole(['court']), [
  body('status').isIn(['pending', 'reviewed', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { status } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    document.status = status;
    await document.save();

    res.json({
      message: 'Document status updated successfully',
      document: {
        id: document._id,
        filename: document.filename,
        status: document.status
      }
    });

  } catch (error) {
    console.error('Update document status error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to update document status'
    });
  }
});

// Delete document (owner only)
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    // Check if user owns this document
    if (document.uploadedBy.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own documents'
      });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to delete document'
    });
  }
});

module.exports = router; 