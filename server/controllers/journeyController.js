/**
 * Journey Controller
 * Handles voting journey progress tracking and readiness calculation.
 */

const {
  getOrCreateJourney,
  completeStep,
  addWarning,
  getNextAction,
} = require('../services/journeyService');
const { getStageGuidance } = require('../services/geminiService');
const User = require('../models/User');

/**
 * GET /api/journey/:sessionId
 * Returns the full journey record for a session.
 */
const getJourney = async (req, res, next) => {
  try {
    const journey = await getOrCreateJourney(req.params.sessionId);
    const nextAction = getNextAction(journey);

    res.json({
      journey,
      nextAction,
      readinessScore: journey.readinessScore,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/journey/:sessionId/step
 * Marks a step as complete and returns updated journey + AI tip for next stage.
 */
const updateStep = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { step, completed, notes } = req.body;

    let journey;
    if (completed) {
      journey = await completeStep(sessionId, step, notes);
    } else {
      // Allow un-completing a step
      journey = await getOrCreateJourney(sessionId);
      journey.steps[step].completed = false;
      journey.calculateReadiness();
      await journey.save();
    }

    const nextAction = getNextAction(journey);

    // Fetch AI tip for next stage (persona-aware)
    const user = await User.findOne({ sessionId }).select('persona').lean();
    const persona = user?.persona || 'unknown';
    const tip = await getStageGuidance(journey.currentStage, persona);

    res.json({ journey, nextAction, tip, readinessScore: journey.readinessScore });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/journey/:sessionId/warning
 * Adds a warning for the Mistake Prevention engine.
 */
const addJourneyWarning = async (req, res, next) => {
  try {
    const { message, stage } = req.body;
    const journey = await addWarning(req.params.sessionId, message, stage);
    res.json({ warnings: journey.warnings });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/journey/:sessionId
 * Resets the user's entire journey (start over).
 */
const resetJourney = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const Journey = require('../models/Journey');
    await Journey.findOneAndDelete({ sessionId });
    const fresh = await getOrCreateJourney(sessionId);
    res.json({ message: 'Journey reset.', journey: fresh });
  } catch (err) {
    next(err);
  }
};

module.exports = { getJourney, updateStep, addJourneyWarning, resetJourney };
