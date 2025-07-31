const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authorization header missing or invalid'
      });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Token verification failed'
    });
  }
};

// Verify JWT token
const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authorization header missing or invalid'
      });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'User not found or inactive',
        message: 'Invalid user account'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Token verification failed'
    });
  }
};

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role || req.query.role;
    
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Generate JWT token
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  verifyFirebaseToken,
  verifyJWT,
  requireRole,
  generateToken
}; 