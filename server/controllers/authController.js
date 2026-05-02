const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const localStorage = require('../utils/storage');

/**
 * Register a new user
 */
exports.register = async (req, res, next) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide email, password, and name.' });
    }

    // Check if user already exists
    let existingUser;
    if (isDbConnected) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = await localStorage.findUserByEmail(email);
    }

    if (existingUser) {
      return res.status(400).json({ error: 'auth/email-already-in-use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      email,
      password: hashedPassword,
      name,
      sessionId: new mongoose.Types.ObjectId().toString(),
    };

    let savedUser;
    if (isDbConnected) {
      savedUser = new User(userData);
      await savedUser.save();
    } else {
      savedUser = await localStorage.saveUser(userData);
    }

    res.status(201).json({
      uid: savedUser.sessionId,
      email: savedUser.email,
      displayName: savedUser.name,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login a user
 */
exports.login = async (req, res, next) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    // Find user
    let user;
    if (isDbConnected) {
      user = await User.findOne({ email });
    } else {
      user = await localStorage.findUserByEmail(email);
    }

    if (!user) {
      return res.status(400).json({ error: 'auth/user-not-found' });
    }

    if (!user.password) {
      return res.status(400).json({ error: 'auth/wrong-password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'auth/wrong-password' });
    }

    res.status(200).json({
      uid: user.sessionId,
      email: user.email,
      displayName: user.name,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user data by sessionId (used for re-authenticating on refresh)
 */
exports.getMe = async (req, res, next) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ error: 'No session ID provided' });

    let user;
    if (isDbConnected) {
      user = await User.findOne({ sessionId });
    } else {
      user = await localStorage.findUserBySessionId(sessionId);
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      uid: user.sessionId,
      email: user.email,
      displayName: user.name,
    });
  } catch (err) {
    next(err);
  }
};
