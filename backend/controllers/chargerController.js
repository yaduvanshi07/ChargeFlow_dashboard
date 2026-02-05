const Charger = require('../models/Charger');

// Get comprehensive charger statistics
exports.getChargerStatistics = async (req, res) => {
    try {
        const stats = await Charger.getStatistics();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting charger statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get count of active chargers
exports.getActiveChargersCount = async (req, res) => {
    try {
        const activeCount = await Charger.getActiveChargersCount();

        res.status(200).json({
            success: true,
            data: {
                activeChargers: activeCount
            }
        });
    } catch (error) {
        console.error('Error getting active chargers count:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get total sessions across all chargers
exports.getTotalSessions = async (req, res) => {
    try {
        const totalSessions = await Charger.getTotalSessions();

        res.status(200).json({
            success: true,
            data: {
                totalSessions: totalSessions
            }
        });
    } catch (error) {
        console.error('Error getting total sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all chargers with pagination
exports.getAllChargers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        const query = {};
        if (status && ['ONLINE', 'OFFLINE', 'MAINTENANCE'].includes(status)) {
            query.status = status;
        }

        const chargers = await Charger.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Charger.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                chargers,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error getting chargers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add a new charger
exports.createCharger = async (req, res) => {
    try {
        const { name, location, type, power, status } = req.body;

        // Validation
        if (!name || !location || !type || !power) {
            return res.status(400).json({
                success: false,
                message: 'Name, location, type, and power are required'
            });
        }

        if (!['AC', 'DC', 'AC_FAST', 'DC_FAST'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid charger type. Must be AC, DC, AC_FAST, or DC_FAST'
            });
        }

        if (status && !['ONLINE', 'OFFLINE', 'MAINTENANCE'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be ONLINE, OFFLINE, or MAINTENANCE'
            });
        }

        // Create charger
        const charger = new Charger({
            name,
            location,
            type,
            power,
            status: status || 'OFFLINE'
        });

        await charger.save();

        res.status(201).json({
            success: true,
            message: 'Charger added successfully',
            data: charger
        });
    } catch (error) {
        console.error('Error adding charger:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update an existing charger
exports.updateCharger = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, type, power, status } = req.body;

        // Find the charger
        const charger = await Charger.findById(id);
        if (!charger) {
            return res.status(404).json({
                success: false,
                message: 'Charger not found'
            });
        }

        // Validation
        if (!name || !location || !type || !power) {
            return res.status(400).json({
                success: false,
                message: 'Name, location, type, and power are required'
            });
        }

        if (!['AC', 'DC', 'AC_FAST', 'DC_FAST'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid charger type. Must be AC, DC, AC_FAST, or DC_FAST'
            });
        }

        if (status && !['ONLINE', 'OFFLINE', 'MAINTENANCE'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be ONLINE, OFFLINE, or MAINTENANCE'
            });
        }

        // Update charger fields (preserve non-editable fields)
        charger.name = name;
        charger.location = location;
        charger.type = type;
        charger.power = power;
        if (status) {
            charger.status = status;
        }

        // Update timestamp
        charger.updatedAt = new Date();

        await charger.save();

        res.status(200).json({
            success: true,
            message: 'Charger updated successfully',
            data: charger
        });
    } catch (error) {
        console.error('Error updating charger:', error);
        
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid charger ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
