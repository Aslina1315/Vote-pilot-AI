const User = require('../models/User');
const mongoose = require('mongoose');
const localStorage = require('../utils/storage');

/**
 * GET /api/user/:sessionId
 * Fetches a user's profile. Returns 404 if not found.
 */
const getUser = async (req, res, next) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  try {
    let user;
    if (isDbConnected) {
      user = await User.findOne({ sessionId: req.params.sessionId })
        .select('-conversationHistory')
        .lean();
    } else {
      user = await localStorage.findUserBySessionId(req.params.sessionId);
    }

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
  const isDbConnected = mongoose.connection.readyState === 1;
  try {
    const { sessionId, name, state, age, persona, settings } = req.body;

    let user;
    if (isDbConnected) {
      user = await User.findOneAndUpdate(
        { sessionId },
        { $set: { name, state, age, persona, settings } },
        { new: true, upsert: true, runValidators: true }
      ).select('-conversationHistory');
    } else {
      user = await localStorage.saveUser({ sessionId, name, state, age, persona, settings });
    }

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
  const isDbConnected = mongoose.connection.readyState === 1;
  try {
    const { voiceEnabled, language, highContrast } = req.body;
    
    let user;
    if (isDbConnected) {
      user = await User.findOneAndUpdate(
        { sessionId: req.params.sessionId },
        { $set: { 'settings.voiceEnabled': voiceEnabled, 'settings.language': language, 'settings.highContrast': highContrast } },
        { new: true, runValidators: true }
      ).select('settings sessionId');
    } else {
      const existing = await localStorage.findUserBySessionId(req.params.sessionId);
      if (!existing) return res.status(404).json({ error: 'User not found.' });
      existing.settings = { voiceEnabled, language, highContrast };
      user = await localStorage.saveUser(existing);
    }

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUser, upsertUser, updateSettings };
