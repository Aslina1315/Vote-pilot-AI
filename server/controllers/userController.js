/**
 * User Controller
 * Handles user profile creation, retrieval, and settings updates.
 */

const User = require('../models/User');

/**
 * GET /api/user/:sessionId
 * Fetches a user's profile. Returns 404 if not found.
 */
const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId })
      .select('-conversationHistory') // Exclude history for privacy
      .lean();

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/user
 * Creates or updates a user profile by sessionId (upsert).
 */
const upsertUser = async (req, res, next) => {
  try {
    const { sessionId, name, state, age, persona, settings } = req.body;

    const user = await User.findOneAndUpdate(
      { sessionId },
      { $set: { name, state, age, persona, settings } },
      { new: true, upsert: true, runValidators: true }
    ).select('-conversationHistory');

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/user/:sessionId/settings
 * Updates just the settings object for a user.
 */
const updateSettings = async (req, res, next) => {
  try {
    const { voiceEnabled, language, highContrast } = req.body;
    const user = await User.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $set: { 'settings.voiceEnabled': voiceEnabled, 'settings.language': language, 'settings.highContrast': highContrast } },
      { new: true, runValidators: true }
    ).select('settings sessionId');

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUser, upsertUser, updateSettings };
