/**
 * Analytics Routes
 */
const express = require('express');
const router  = express.Router();
const { getAnalytics, recordEvent } = require('../controllers/analyticsController');
const { globalRateLimiter } = require('../middleware/rateLimiter');

router.get('/',        getAnalytics);
router.post('/event',  globalRateLimiter, recordEvent);

module.exports = router;
