const mongoose = require('mongoose');
const User = require('../models/User');

// Get user by email
exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Decode URI encoded email
        const decodedEmail = decodeURIComponent(email);

        const user = await User.findOne({ email: decodedEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error getting user by email:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
