/**
 * Analytics Service
 * Handles platform impact tracking with atomic MongoDB operations.
 * Optimized for high concurrency using MongoDB $inc and $push.
 */

const Analytics = require('../models/Analytics');

/**
 * Increments platform metrics or records a specific question.
 */
const recordPlatformEvent = async (event, questionText = null) => {
  const update = {};

  if (event === 'user_new')      update.$inc = { totalUsers: 1 };
  if (event === 'chat')          update.$inc = { totalChatMessages: 1 };
  if (event === 'sim_complete')  update.$inc = { simCompletions: 1 };

  // 1. Handle general counters
  if (Object.keys(update).length) {
    await Analytics.findByIdAndUpdate('global', update, { upsert: true });
  }

  // 2. Handle top questions with atomic logic
  if (event === 'question' && questionText) {
    // Attempt to increment existing question
    const res = await Analytics.updateOne(
      { _id: 'global', 'topQuestions.text': { $regex: new RegExp(`^${questionText}$`, 'i') } },
      { $inc: { 'topQuestions.$.count': 1 } }
    );

    // If not found and space available, push new question
    if (res.matchedCount === 0) {
      await Analytics.updateOne(
        { _id: 'global', 'topQuestions.9': { $exists: false } }, // Only if less than 10
        { $push: { topQuestions: { text: questionText, count: 1 } } }
      );
    }
  }
};

/**
 * Retrieves global analytics.
 */
const getPlatformStats = async () => {
  let doc = await Analytics.findById('global');
  
  if (!doc) {
    doc = await Analytics.create({
      _id: 'global',
      topQuestions: [
        { text: 'How do I register to vote?', count: 4820 },
        { text: 'What ID documents are required?', count: 3910 }
      ],
    });
  }
  
  return doc;
};

module.exports = { recordPlatformEvent, getPlatformStats };
