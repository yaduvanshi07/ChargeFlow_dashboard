const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users/by-email/:email - Get user by email
router.get('/by-email/:email', userController.getUserByEmail);

module.exports = router;
