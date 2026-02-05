const express = require('express');
const router = express.Router();
const chargerController = require('../controllers/chargerController');

// GET /api/chargers/statistics - Get comprehensive charger statistics
router.get('/statistics', chargerController.getChargerStatistics);

// GET /api/chargers/active - Get count of active chargers
router.get('/active', chargerController.getActiveChargersCount);

// GET /api/chargers/sessions - Get total sessions across all chargers
router.get('/sessions', chargerController.getTotalSessions);

// GET /api/chargers - Get all chargers with pagination
router.get('/', chargerController.getAllChargers);

// POST /api/chargers - Add a new charger
router.post('/', chargerController.createCharger);

// PUT /api/chargers/:id - Update an existing charger
router.put('/:id', chargerController.updateCharger);

module.exports = router;
