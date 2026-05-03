/**
 * VotePilot AI - Express Server (Production Optimized for Google Cloud Run)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

const aiRoutes        = require('./routes/ai');
const userRoutes      = require('./routes/user');
const journeyRoutes   = require('./routes/journey');
const analyticsRoutes = require('./routes/analytics');
const authRoutes      = require('./routes/auth');
const { verifyFirebaseToken } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Production Monitoring (Google Cloud Logging) ──────────────────────────
const log = (severity, message, extra = {}) => {
  console.log(JSON.stringify({ severity, message, ...extra, timestamp: new Date().toISOString() }));
};

// ─── Security & Performance Middleware ─────────────────────────────────────
app.use(helmet()); 
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);
app.use(globalRateLimiter);

// Timeout safety (prevent hanging connections in Cloud Run)
app.use((req, res, next) => {
  res.setTimeout(25000, () => {
    log('WARNING', 'Request Timeout', { url: req.url });
    res.status(504).send('Service Timeout');
  });
  next();
});

// Authentication Context
app.use(verifyFirebaseToken);

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV, uptime: process.uptime() });
});

// ─── Static Frontend Serving ───────────────────────────────────────────────
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.use(errorHandler);

// ─── Resilient Startup ──────────────────────────────────────────────────────
const startServer = async () => {
  log('DEFAULT', 'Starting VotePilot AI Server...');

  if (process.env.NODE_ENV !== 'test' && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      log('INFO', 'MongoDB connected successfully');
    } catch (dbErr) {
      log('ERROR', 'MongoDB connection failed', { error: dbErr.message });
    }
  }

  const server = app.listen(PORT, () => {
    log('INFO', `Server active on port ${PORT}`, { env: process.env.NODE_ENV });
  });

  // Graceful shutdown for Cloud Run
  process.on('SIGTERM', () => {
    log('INFO', 'SIGTERM received. Closing connections...');
    server.close(() => {
      if (mongoose.connection.readyState === 1) mongoose.connection.close();
      log('INFO', 'Shutdown complete.');
      process.exit(0);
    });
  });
};

startServer();

module.exports = app;

