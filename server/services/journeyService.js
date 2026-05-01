/**
 * Journey Service
 * Business logic for tracking and updating a user's voting journey.
 * Handles readiness calculation and next-step recommendations.
 */

const Journey = require('../models/Journey');

// Maps each stage to its next stage in the journey
const STAGE_ORDER = ['eligibility', 'documents', 'registration', 'voting'];

/**
 * Retrieves or creates a journey record for a session.
 * @param {string} sessionId
 * @returns {Promise<Journey>}
 */
const getOrCreateJourney = async (sessionId) => {
  let journey = await Journey.findOne({ sessionId });
  if (!journey) {
    journey = new Journey({ sessionId });
    await journey.save();
  }
  return journey;
};

/**
 * Marks a specific step as complete and advances currentStage.
 * @param {string} sessionId
 * @param {string} step - One of: eligibility | documents | registration | voting
 * @param {string} [notes] - Optional notes from the AI or user
 * @returns {Promise<Journey>}
 */
const completeStep = async (sessionId, step, notes = '') => {
  const journey = await getOrCreateJourney(sessionId);

  if (!journey.steps[step]) {
    const err = new Error(`Invalid step: ${step}`);
    err.statusCode = 400;
    throw err;
  }

  // Mark step complete
  journey.steps[step].completed = true;
  journey.steps[step].completedAt = new Date();
  if (notes) journey.steps[step].notes = notes;

  // Advance to next stage if the current step matches currentStage
  const currentIdx = STAGE_ORDER.indexOf(journey.currentStage);
  const stepIdx = STAGE_ORDER.indexOf(step);
  if (stepIdx >= currentIdx) {
    const nextIdx = stepIdx + 1;
    journey.currentStage = nextIdx < STAGE_ORDER.length
      ? STAGE_ORDER[nextIdx]
      : 'complete';
  }

  // Recalculate readiness percentage
  journey.calculateReadiness();
  await journey.save();

  return journey;
};

/**
 * Adds a warning to the user's journey (Mistake Prevention engine).
 * @param {string} sessionId
 * @param {string} message - Warning message
 * @param {string} stage   - Stage the warning relates to
 * @returns {Promise<Journey>}
 */
const addWarning = async (sessionId, message, stage) => {
  const journey = await getOrCreateJourney(sessionId);
  journey.warnings.push({ message, stage });
  // Keep only the most recent 10 warnings
  if (journey.warnings.length > 10) {
    journey.warnings = journey.warnings.slice(-10);
  }
  await journey.save();
  return journey;
};

/**
 * Returns the next recommended action for the user based on their journey.
 * @param {Journey} journey
 * @returns {string} - Next action label
 */
const getNextAction = (journey) => {
  for (const step of STAGE_ORDER) {
    if (!journey.steps[step].completed) {
      const labels = {
        eligibility: 'Check your voter eligibility',
        documents: 'Gather required ID documents',
        registration: 'Register to vote or verify registration',
        voting: 'Learn your polling place and voting process',
      };
      return labels[step];
    }
  }
  return 'You are fully voting-ready! 🎉';
};

module.exports = { getOrCreateJourney, completeStep, addWarning, getNextAction };
