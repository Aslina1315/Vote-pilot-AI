/**
 * User Model
 * Stores user profile, persona, and voting readiness settings in MongoDB.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Unique session-based identifier (no login required)
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      maxlength: 64,
    },

    // Basic profile info
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'Voter',
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },

    // Persona inferred from responses (e.g., 'first-time', 'returning', 'senior')
    persona: {
      type: String,
      enum: ['first-time', 'returning', 'senior', 'student', 'unknown'],
      default: 'unknown',
    },

    // User preferences
    settings: {
      voiceEnabled: { type: Boolean, default: true },
      language: { type: String, default: 'en-US' },
      highContrast: { type: Boolean, default: false },
    },

    // Conversation history (last 20 messages kept for context)
    conversationHistory: [
      {
        role: { type: String, enum: ['user', 'model'], required: true },
        parts: [{ text: String }],
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    versionKey: false,
  }
);

// Keep only the last 20 messages in conversation history
userSchema.pre('save', function (next) {
  if (this.conversationHistory.length > 20) {
    this.conversationHistory = this.conversationHistory.slice(-20);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
