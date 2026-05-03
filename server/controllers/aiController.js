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
    
    // Prioritize authenticated UID, fallback to sessionId
    const identifier = req.uid || sessionId;

    if (!identifier) {
      return res.status(400).json({ error: 'Valid session or authentication required.' });
    }

    // Retrieve or create user document
    let user = await User.findOne({ 
      $or: [{ uid: req.uid }, { sessionId }] 
    });

    if (!user) {
      user = new User({ 
        sessionId, 
        uid: req.uid || null 
      });
    }

    // Prepare history for Gemini
    const history = user.conversationHistory.map((turn) => ({
      role: turn.role,
      parts: turn.parts,
    }));

    // Send to Gemini (Service handles search grounding and its own truncation)
    const aiResponse = await sendMessage(message, history, stage);

    // Append new turns
    user.conversationHistory.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: aiResponse }] }
    );

    // Efficiency Fix: Truncate DB history to prevent document bloat (Max 20 messages)
    const MAX_DB_HISTORY = 20;
    if (user.conversationHistory.length > MAX_DB_HISTORY) {
      user.conversationHistory = user.conversationHistory.slice(-MAX_DB_HISTORY);
    }

    await user.save();

    res.json({
      response: aiResponse,
      sessionId,
      stage: stage || null,
    });
  } catch (err) {
    // mask production errors
    next(err);
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
