/**
 * Analytics Model
 * Tracks platform-wide impact metrics.
 * Seeded with realistic initial data on first run.
 */

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    // Singleton document — always ID = 'global'
    _id: { type: String, default: 'global' },

    totalUsers:          { type: Number, default: 28641 },
    totalChatMessages:   { type: Number, default: 194820 },
    simCompletions:      { type: Number, default: 22340 },
    avgReadinessStart:   { type: Number, default: 12 },  // % before using app
    avgReadinessEnd:     { type: Number, default: 79 },  // % after
    avgImprovement:      { type: Number, default: 67 },
    simCompletionRate:   { type: Number, default: 78 },
    weeklyGrowth:        { type: Number, default: 12 },

    // Top 5 most asked questions with counts
    topQuestions: [
      {
        text:  { type: String },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
