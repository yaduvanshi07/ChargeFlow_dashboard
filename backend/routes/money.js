const express = require('express');
const router = express.Router();
const moneyController = require('../controllers/moneyController');

// POST /api/money/add - Add a new transaction
router.post('/add', moneyController.createTransaction);

// GET /api/money/total - Get total of all transactions
router.get('/total', moneyController.getTotal);

// GET /api/money/total/:source - Get total filtered by source
router.get('/total/:source', moneyController.getTotalBySource);

// GET /api/money/statistics - Get comprehensive statistics
router.get('/statistics', moneyController.getStatistics);

// GET /api/money/transactions - Get all transactions with pagination
router.get('/transactions', moneyController.getAllTransactions);

module.exports = router;
