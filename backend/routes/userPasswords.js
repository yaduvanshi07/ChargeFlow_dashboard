const express = require('express');
const router = express.Router();
const userPasswordController = require('../controllers/userPasswordController');

// GET /api/user-passwords/:userId - Get or create user password (internal use)
router.get('/:userId', userPasswordController.getOrCreateUserPassword);

// POST /api/user-passwords/verify - Verify user password (for station access)
router.post('/verify', userPasswordController.verifyUserPassword);

module.exports = router;
