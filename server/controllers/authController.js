const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Register a new user
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide email, password, and name.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'auth/email-already-in-use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    // We use MongoDB _id as the sessionId to maintain compatibility with existing logic
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    
    // Assign a temporary sessionId until we have the _id
    newUser.sessionId = newUser._id.toString();

    await newUser.save();

    res.status(201).json({
      uid: newUser.sessionId,
      email: newUser.email,
      displayName: newUser.name,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login a user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    // Find user
    const user = await User.findOne({ email });
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
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ error: 'No session ID provided' });

    const user = await User.findOne({ sessionId });
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
