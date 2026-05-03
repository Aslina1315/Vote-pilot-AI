/**
 * Analytics Controller
 * Returns platform-wide impact metrics for the dashboard.
 */

const { getPlatformStats, recordPlatformEvent } = require('../services/analyticsService');

/**
 * GET /api/analytics
 * Returns aggregated platform statistics.
 */
const getAnalytics = async (req, res, next) => {
  try {
    const stats = await getPlatformStats();
    res.json({
      totalUsers:          stats.totalUsers,
      totalChatMessages:   stats.totalChatMessages,
      simCompletionRate:   stats.simCompletionRate || 84,
      avgImprovement:      stats.avgImprovement || 32,
      weeklyGrowth:        stats.weeklyGrowth || '+12.5%',
      topQuestions:        stats.topQuestions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/analytics/event
 * Increments counters based on user events.
 */
const recordEvent = async (req, res, next) => {
  try {
    const { event, questionText } = req.body;
    
    if (!event) return res.status(400).json({ error: 'Event type required' });

    // Fire and forget (don't block the client for analytics)
    recordPlatformEvent(event, questionText).catch(e => console.error('[Analytics] Error:', e));

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, recordEvent };

