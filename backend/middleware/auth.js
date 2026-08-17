const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verifies access token from Authorization header
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) { 
      return res.status(401).json({ 
        success: false, 
        message: 'User no longer exists' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token expired', 
        code: 'TOKEN_EXPIRED' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token invalid' 
    });
  }
};

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You don't have permission to perform this action",
      });
    }
    next();
  };
};
