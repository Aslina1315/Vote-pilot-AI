/**
 * VotePilot AI - Express Server Entry Point
 * Configures middleware, connects to MongoDB, and starts the HTTP server.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

// Import route modules
const aiRoutes        = require('./routes/ai');
const userRoutes      = require('./routes/user');
const journeyRoutes   = require('./routes/journey');
const analyticsRoutes = require('./routes/analytics');
const { verifyFirebaseToken } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet()); // Sets secure HTTP headers

// CORS: only allow configured frontend origin
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── General Middleware ─────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Reject oversized payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(requestLogger); // Log incoming requests
app.use(globalRateLimiter); // Apply global rate limiting
app.use(verifyFirebaseToken); // Attach uid to all requests

const authRoutes      = require('./routes/auth');

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/analytics', analyticsRoutes);

// ─── Health Check Endpoint ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'VotePilot AI Server',
  });
});

const path = require('path');

// ─── Serve Frontend (Production) ───────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // ─── 404 Handler ───────────────────────────────────────────────────────────
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ─── Database Connection & Server Start ────────────────────────────────────
const startServer = async () => {
  // Connect to MongoDB (skip in test environment)
  if (process.env.NODE_ENV !== 'test') {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ MongoDB connected successfully');
    } catch (dbErr) {
      console.warn('⚠️ MongoDB failed to connect. Running in memory mode without persistence.');
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 VotePilot AI server running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown on termination signals
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      if (mongoose.connection.readyState === 1) mongoose.connection.close();
    });
  });
};

startServer();

module.exports = app; // Export for testing
