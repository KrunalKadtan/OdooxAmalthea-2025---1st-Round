const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access token required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = verifyToken(token);
      
      // Get user from database
      const user = await User.findById(decoded.id)
        .populate('company')
        .populate('manager', 'username firstName lastName');
      
      if (!user || !user.isActive) {
        return sendError(res, 'User not found or inactive', 401);
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return sendError(res, 'Invalid or expired token', 401);
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return sendError(res, 'Authentication failed', 500);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).populate('company');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (jwtError) {
        // Token invalid, but continue without user
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};