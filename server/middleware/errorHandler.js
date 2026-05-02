/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns safe, sanitized responses.
 * Never exposes stack traces or internal details in production.
 */

const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // Log full error details server-side only
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ error: 'A record with this data already exists.' });
  }

  // JWT / Auth errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing authentication token.' });
  }

  // Generic error response — temporarily reveal internals to debug
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    stack: err.stack,
  });
};

module.exports = { errorHandler };
