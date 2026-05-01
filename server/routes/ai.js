/**
 * AI Routes
 * Maps HTTP endpoints to AI controller methods.
 * Applies AI-specific rate limiting and input validation.
 */

const express = require('express');
const router = express.Router();
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { validateAiMessage } = require('../middleware/validator');
const { chat, getGuidance, clearHistory } = require('../controllers/aiController');

// POST /api/ai/chat — Main conversational AI endpoint
router.post('/chat', aiRateLimiter, validateAiMessage, chat);

// GET /api/ai/guidance — Get a stage-specific voting tip
router.get('/guidance', getGuidance);

// DELETE /api/ai/history/:sessionId — Clear conversation history
router.delete('/history/:sessionId', clearHistory);

module.exports = router;
