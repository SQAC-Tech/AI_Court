const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/auth');

// Verify Firebase token
router.post('/verify', verifyFirebaseToken, (req, res) => {
  res.json({ 
    user: req.user,
    message: 'Token verified successfully' 
  });
});

// Get user profile
router.get('/user/profile', verifyFirebaseToken, (req, res) => {
  // Mock user profile data
  const userProfile = {
    uid: req.user.uid,
    email: req.user.email,
    role: 'user',
    name: 'John Doe',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra',
    totalCases: 3,
    pendingCases: 1,
    completedCases: 2
  };
  
  res.json(userProfile);
});

// Get court profile
router.get('/court/profile', verifyFirebaseToken, (req, res) => {
  // Mock court profile data
  const courtProfile = {
    uid: req.user.uid,
    email: req.user.email,
    role: 'court',
    name: 'Hon. Judge Smith',
    court: 'Mumbai High Court',
    designation: 'Senior Judge',
    totalCases: 45,
    underReview: 12,
    scheduled: 8,
    completed: 25
  };
  
  res.json(courtProfile);
});

module.exports = router; 