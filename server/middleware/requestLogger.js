/**
 * Request Logger Middleware
 * Logs method, path, status, and response time for each request.
 * Avoids logging sensitive data (body, headers with auth tokens).
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log after response is sent to capture status code
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`;
    console.log(log);
  });

  next();
};

module.exports = { requestLogger };
