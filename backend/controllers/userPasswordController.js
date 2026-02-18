const mongoose = require('mongoose');
const User = require('../models/User');
const UserPassword = require('../models/UserPassword');

// Get or create user password (for internal use, not exposed to frontend)
exports.getOrCreateUserPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get or create user password
        const passwordResult = await UserPassword.getOrCreateUserPassword(userId);

        res.status(200).json({
            success: true,
            message: passwordResult.isNew ? 'New password generated' : 'Existing password retrieved',
            data: {
                userId: userId,
                isNew: passwordResult.isNew
                // Note: plainPassword is NOT returned in API response as per requirements
            }
        });

    } catch (error) {
        console.error('Error getting user password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify user password (for station access)
exports.verifyUserPassword = async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({
                success: false,
                message: 'userId and password are required'
            });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        // Verify password
        const verificationResult = await UserPassword.verifyUserPassword(userId, password);

        if (verificationResult.valid) {
            res.status(200).json({
                success: true,
                message: 'Password verified successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: verificationResult.message
            });
        }

    } catch (error) {
        console.error('Error verifying user password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get user password by email (helper function for booking flow)
exports.getUserPasswordByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const passwordResult = await UserPassword.getOrCreateUserPassword(user._id);
        return { 
            success: true, 
            userId: user._id,
            userPassword: passwordResult.userPassword,
            plainPassword: passwordResult.plainPassword,
            isNew: passwordResult.isNew 
        };
    } catch (error) {
        console.error('Error getting user password by email:', error);
        return { success: false, message: 'Internal server error' };
    }
};

// Verify user password by email (helper function for booking flow)
exports.verifyUserPasswordByEmail = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { valid: false, message: 'User not found' };
        }

        const verificationResult = await UserPassword.verifyUserPassword(user._id, password);
        return verificationResult;
    } catch (error) {
        console.error('Error verifying user password by email:', error);
        return { valid: false, message: 'Internal server error' };
    }
};
