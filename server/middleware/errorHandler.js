/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns safe, sanitized responses.
 */

const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // Structured Logging for Google Cloud Logs
  console.error(JSON.stringify({
    severity: 'ERROR',
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  }));

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ error: 'A record with this data already exists.' });
  }

  // Auth errors
  if (err.name === 'UnauthorizedError' || err.message === 'Authentication required.') {
    return res.status(401).json({ error: 'Invalid or missing authentication token.' });
  }

  // Production Safety: Mask internal errors
  const statusCode = err.statusCode || 500;
  const message = (isDev || statusCode < 500) 
    ? err.message 
    : 'An internal server error occurred. Please try again later.';

  res.status(statusCode).json({
    error: message,
    // Only send stack in development
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = { errorHandler };

