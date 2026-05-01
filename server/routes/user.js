/**
 * User Routes
 * Maps HTTP endpoints to user controller methods.
 */

const express = require('express');
const router = express.Router();
const { validateUserProfile } = require('../middleware/validator');
const { getUser, upsertUser, updateSettings } = require('../controllers/userController');

// GET /api/user/:sessionId — Get user profile
router.get('/:sessionId', getUser);

// POST /api/user — Create or update user profile
router.post('/', validateUserProfile, upsertUser);

// PUT /api/user/:sessionId/settings — Update settings only
router.put('/:sessionId/settings', updateSettings);

module.exports = router;
