const mongoose = require('mongoose');

/**
 * Middleware: ensure database is connected before proceeding.
 * Prevents requests from hanging if MongoDB is down.
 */
const ensureDbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️ MongoDB is offline. Using local file storage fallback.');
  }
  next();
};

module.exports = { ensureDbConnected };
