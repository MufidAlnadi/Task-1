const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../config/logger');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    logger.warn('No token provided');
    return res.status(403).json({message: 'No token provided'});
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      logger.error('Token verification failed', err.message);
      return res
        .status(401)
        .json({message: 'Unauthorized: Invalid or expired token'});
    }

    req.user = decoded;
    logger.info('Token successfully verified');
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    logger.warn('User not authorized: Admins only');
    return res.status(403).json({message: 'Forbidden: Admins only'});
  }

  next();
};

module.exports = {authMiddleware, isAdmin};
