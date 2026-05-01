/**
 * Journey Routes
 * Maps HTTP endpoints to journey controller methods.
 */

const express = require('express');
const router = express.Router();
const { validateJourneyUpdate } = require('../middleware/validator');
const {
  getJourney,
  updateStep,
  addJourneyWarning,
  resetJourney,
} = require('../controllers/journeyController');

// GET /api/journey/:sessionId — Get full journey status
router.get('/:sessionId', getJourney);

// POST /api/journey/:sessionId/step — Mark a step complete/incomplete
router.post('/:sessionId/step', validateJourneyUpdate, updateStep);

// POST /api/journey/:sessionId/warning — Add a mistake prevention warning
router.post('/:sessionId/warning', addJourneyWarning);

// DELETE /api/journey/:sessionId — Reset journey to start over
router.delete('/:sessionId', resetJourney);

module.exports = router;
