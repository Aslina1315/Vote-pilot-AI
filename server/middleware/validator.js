/**
 * Input Validation Middleware
 * Uses express-validator to define validation chains for each route.
 * Sanitizes inputs to prevent XSS and injection attacks.
 */

const { body, validationResult } = require('express-validator');

/**
 * Checks validation results and returns 422 if any error exists.
 * This should be placed AFTER validation chain rules in routes.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Invalid input data',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Validation Chains ──────────────────────────────────────────────────────

/** Validates AI chat message payload */
const validateAiMessage = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message cannot be empty.')
    .isLength({ max: 1000 }).withMessage('Message too long (max 1000 chars).')
    .escape(), // Sanitize HTML to prevent XSS
  body('sessionId')
    .optional()
    .trim()
    .isAlphanumeric().withMessage('Invalid session ID.')
    .isLength({ max: 64 }),
  body('stage')
    .optional()
    .trim()
    .isIn(['eligibility', 'documents', 'registration', 'voting', 'simulation'])
    .withMessage('Invalid stage value.'),
  handleValidationErrors,
];

/** Validates user profile creation/update */
const validateUserProfile = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 100 }).withMessage('Name too long.')
    .matches(/^[^<>]+$/).withMessage('Name contains invalid characters.') // Strict no-HTML
    .escape(),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required.')
    .isLength({ max: 100 })
    .escape(),
  body('age')
    .isInt({ min: 0, max: 120 }).withMessage('Age must be a number between 0 and 120.'),
  handleValidationErrors,
];

/** Validates journey step progress update */
const validateJourneyUpdate = [
  body('step')
    .trim()
    .isIn(['eligibility', 'documents', 'registration', 'voting'])
    .withMessage('Invalid journey step.')
    .escape(),
  body('completed')
    .isBoolean().withMessage('Completed must be a boolean.'),
  handleValidationErrors,
];


module.exports = {
  validateAiMessage,
  validateUserProfile,
  validateJourneyUpdate,
  handleValidationErrors,
};
