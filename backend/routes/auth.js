const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyJWT, requireRole, generateToken } = require('../middleware/auth');
const User = require('../models/User');

// Validation middleware
const validateSignup = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .custom(async (value) => {
      const existingUser = await User.findByEmail(value);
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('displayName')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  body('role')
    .isIn(['user', 'court'])
    .withMessage('Role must be user or court'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),
  body('court')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Court name cannot exceed 200 characters'),
  body('designation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Firebase authentication routes
const validateFirebaseAuth = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('firebaseUid')
    .notEmpty()
    .withMessage('Firebase UID is required'),
  body('provider')
    .isIn(['google', 'email', 'firebase'])
    .withMessage('Provider must be google, email, or firebase')
];

// Firebase login
router.post('/firebase-login', validateFirebaseAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { email, firebaseUid, provider } = req.body;

    // Find user by Firebase UID or email
    let user = await User.findOne({ 
      $or: [
        { firebaseUid },
        { email: email.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No account found with this Firebase account'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account disabled',
        message: 'Your account has been disabled. Please contact support.'
      });
    }

    // Update Firebase UID if not set
    if (!user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      user.provider = provider;
      await user.save();
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.json({
      message: 'Firebase login successful',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to authenticate with Firebase'
    });
  }
});

// Firebase signup
router.post('/firebase-signup', validateFirebaseAuth, [
  body('displayName')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['user', 'court'])
    .withMessage('Role must be user or court'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),
  body('court')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Court name cannot exceed 200 characters'),
  body('designation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters'),
  body('photoURL')
    .optional()
    .isURL()
    .withMessage('Photo URL must be a valid URL')
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

    const { 
      email, 
      firebaseUid, 
      provider, 
      displayName, 
      role = 'user',
      phone, 
      address, 
      court, 
      designation,
      photoURL 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { firebaseUid },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email or Firebase account already exists'
      });
    }

    // Create new user
    const user = new User({
      email,
      firebaseUid,
      provider,
      displayName,
      role,
      phone,
      address,
      court,
      designation,
      photoURL,
      emailVerified: true, // Firebase users are pre-verified
      isActive: true
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      message: 'Firebase user created successfully',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Firebase signup error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email or Firebase account already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: validationErrors
      });
    }
    
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to create Firebase user account'
    });
  }
});

// Sign up endpoint
router.post('/signup', validateSignup, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { email, password, displayName, role, phone, address, court, designation } = req.body;

    // Create new user
    const user = new User({
      email,
      password,
      displayName,
      role,
      phone,
      address,
      court,
      designation
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: validationErrors
      });
    }
    
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to create user account'
    });
  }
});

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account disabled',
        message: 'Your account has been disabled. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to authenticate user'
    });
  }
});

// Get current user profile
router.get('/profile', verifyJWT, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', verifyJWT, [
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),
  body('court')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Court name cannot exceed 200 characters'),
  body('designation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters')
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

    const { displayName, phone, address, court, designation } = req.body;
    const updateData = {};

    if (displayName) updateData.displayName = displayName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (court) updateData.court = court;
    if (designation) updateData.designation = designation;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: validationErrors
      });
    }
    
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/change-password', verifyJWT, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
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

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to change password'
    });
  }
});

// Verify token endpoint
router.post('/verify', verifyJWT, (req, res) => {
  res.json({ 
    user: req.user,
    message: 'Token verified successfully' 
  });
});

// Logout endpoint (client-side token removal)
router.post('/logout', verifyJWT, (req, res) => {
  res.json({ 
    message: 'Logged out successfully' 
  });
});

module.exports = router; 