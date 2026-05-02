const mongoose = require('mongoose');

/**
 * Middleware: ensure database is connected before proceeding.
 * Prevents requests from hanging if MongoDB is down.
 */
const ensureDbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database connection is currently unavailable. Please check your MongoDB configuration (MONGODB_URI).',
    });
  }
  next();
};

module.exports = { ensureDbConnected };
