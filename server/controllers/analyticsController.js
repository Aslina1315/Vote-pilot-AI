/**
 * Analytics Controller
 * Returns platform-wide impact metrics for the dashboard.
 * Seeds the analytics document on first read if it doesn't exist.
 */

const Analytics = require('../models/Analytics');

const SEED_QUESTIONS = [
  { text: 'How do I register to vote?',        count: 4820 },
  { text: 'What ID documents are required?',   count: 3910 },
  { text: 'How does the EVM work?',             count: 3204 },
  { text: 'Where is my polling station?',      count: 2987 },
  { text: 'Can I vote without EPIC card?',     count: 2341 },
];

/**
 * GET /api/analytics
 * Returns aggregated platform statistics.
 */
const getAnalytics = async (req, res, next) => {
  try {
    let doc = await Analytics.findById('global');

    // Seed on first access
    if (!doc) {
      doc = await Analytics.create({
        _id: 'global',
        topQuestions: SEED_QUESTIONS,
      });
    }

    res.json({
      totalUsers:          doc.totalUsers,
      totalChatMessages:   doc.totalChatMessages,
      simCompletionRate:   doc.simCompletionRate,
      avgImprovement:      doc.avgImprovement,
      weeklyGrowth:        doc.weeklyGrowth,
      topQuestions:        doc.topQuestions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/analytics/event
 * Increments counters based on user events.
 * Body: { event: 'chat' | 'sim_complete' | 'user_new' | 'question', questionText? }
 */
const recordEvent = async (req, res, next) => {
  try {
    const { event, questionText } = req.body;

    const update = {};

    if (event === 'user_new')      update.$inc = { totalUsers: 1 };
    if (event === 'chat')          update.$inc = { totalChatMessages: 1 };
    if (event === 'sim_complete')  update.$inc = { simCompletions: 1 };

    if (event === 'question' && questionText) {
      // Increment existing or push new
      const doc = await Analytics.findById('global');
      if (doc) {
        const existing = doc.topQuestions.find((q) =>
          q.text.toLowerCase() === questionText.toLowerCase()
        );
        if (existing) {
          existing.count += 1;
        } else if (doc.topQuestions.length < 10) {
          doc.topQuestions.push({ text: questionText, count: 1 });
        }
        // Sort descending
        doc.topQuestions.sort((a, b) => b.count - a.count);
        await doc.save();
        return res.json({ ok: true });
      }
    }

    if (Object.keys(update).length) {
      await Analytics.findByIdAndUpdate('global', update, { upsert: true });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, recordEvent };
