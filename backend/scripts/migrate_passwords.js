const mongoose = require('mongoose');
const UserPassword = require('../models/UserPassword');
const connectDB = require('../config/database');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function migratePasswords() {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB for migration');

        const userPasswords = await UserPassword.find({});
        console.log(`Found ${userPasswords.length} user passwords to check/migrate.`);

        let updatedCount = 0;
        let visitedCount = 0;

        for (const up of userPasswords) {
            visitedCount++;
            const userId = up.userId;

            // Calculate expected password based on new policy (last 6 chars of ID)
            const expectedPlainPassword = UserPassword.generatePassword(userId);

            // Verify if existing password matches
            const isMatch = await up.verifyPassword(expectedPlainPassword);

            if (!isMatch) {
                console.log(`Updating password for User ${userId}...`);
                const newHash = await UserPassword.hashPassword(expectedPlainPassword);
                up.hashedPassword = newHash;
                await up.save();
                updatedCount++;
            }
        }

        console.log('='.repeat(60));
        console.log('MIGRATION COMPLETE');
        console.log(`Verified: ${visitedCount}`);
        console.log(`Updated: ${updatedCount}`);
        console.log('='.repeat(60));

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migratePasswords();
