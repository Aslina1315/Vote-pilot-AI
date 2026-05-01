/**
 * Rate Limiter Middleware
 * Protects the API from brute-force and DoS attacks.
 * Uses environment variables to configure window and max request count.
 */

const rateLimit = require('express-rate-limit');

// Global rate limiter applied to all API routes
const globalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: 'Check the Retry-After header for wait time.',
  },
  // Do not expose IP addresses in error messages
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// Stricter limiter for the AI endpoint (expensive API calls)
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: {
    error: 'AI request limit reached. Please wait a moment before asking again.',
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = { globalRateLimiter, aiRateLimiter };
