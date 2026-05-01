/**
 * AI Controller
 * Handles AI chat requests. Keeps Gemini API interaction on the backend.
 * Manages conversation history stored in MongoDB User document.
 */

const { sendMessage, getStageGuidance } = require('../services/geminiService');
const User = require('../models/User');
const { getOrCreateJourney } = require('../services/journeyService');

/**
 * POST /api/ai/chat
 * Accepts a user message, fetches conversation history, and returns AI response.
 */
const chat = async (req, res, next) => {
  try {
    const { message, sessionId, stage } = req.body;

    // Retrieve or create user document (session-based, no login required)
    let user = await User.findOne({ sessionId });
    if (!user) {
      user = new User({ sessionId });
    }

    // Prepare history in Gemini-compatible format
    const history = user.conversationHistory.map((turn) => ({
      role: turn.role,
      parts: turn.parts,
    }));

    // Send to Gemini and receive response
    const aiResponse = await sendMessage(message, history, stage);

    // Append new turns to conversation history
    user.conversationHistory.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: aiResponse }] }
    );
    await user.save();

    res.json({
      response: aiResponse,
      sessionId,
      stage: stage || null,
    });
  } catch (err) {
    // Avoid leaking Gemini error details to the client
    console.error('[AI Controller] Error:', err.message);
    next(new Error('AI service temporarily unavailable. Please try again.'));
  }
};

/**
 * GET /api/ai/guidance?stage=&persona=
 * Returns a short, stage-specific voting tip.
 */
const getGuidance = async (req, res, next) => {
  try {
    const { stage = 'eligibility', persona = 'unknown' } = req.query;
    const tip = await getStageGuidance(stage, persona);
    res.json({ tip, stage, persona });
  } catch (err) {
    console.error('[AI Controller] Guidance error:', err.message);
    next(new Error('Unable to fetch guidance at this time.'));
  }
};

/**
 * DELETE /api/ai/history/:sessionId
 * Clears conversation history for a session (privacy / reset).
 */
const clearHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await User.findOneAndUpdate({ sessionId }, { conversationHistory: [] });
    res.json({ message: 'Conversation history cleared.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { chat, getGuidance, clearHistory };
