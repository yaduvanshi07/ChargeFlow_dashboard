const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userPasswordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient user lookup (unique constraint already handles this)
userPasswordSchema.index({ userId: 1 });

// Method to verify password against hash
userPasswordSchema.methods.verifyPassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.hashedPassword);
};

// Static method to generate hashed password
userPasswordSchema.statics.hashPassword = async function (plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

// Static method to generate random 6-digit numeric password
// Static method to generate password from userId (last 6 characters of ID)
userPasswordSchema.statics.generatePassword = function (userId) {
    if (!userId) {
        // Fallback to random if no userId provided (should not happen in normal flow)
        const length = 6;
        const chars = '0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // Use last 6 characters of userId string
    const userIdStr = userId.toString();
    // If ID is shorter than 6 chars (unlikely for ObjectId), pad or verify
    if (userIdStr.length < 6) {
        return userIdStr.padEnd(6, '0');
    }
    return userIdStr.slice(-6);
};

// Static method to get or create user password (idempotent)
// Static method to get or create user password (idempotent, auto-migrates to new policy)
userPasswordSchema.statics.getOrCreateUserPassword = async function (userId) {
    // Expected password based on current policy (last 6 of userId)
    const expectedPlainPassword = this.generatePassword(userId);

    // Fast path: check if password record exists
    let userPassword = await this.findOne({ userId });

    if (userPassword) {
        // Verify if the existing password matches the expected policy
        const isMatch = await userPassword.verifyPassword(expectedPlainPassword);

        if (isMatch) {
            console.log('\n' + '='.repeat(60));
            console.log('🔑 EXISTING USER PASSWORD RETRIEVED (MATCHES POLICY)');
            console.log('='.repeat(60));
            console.log(`👤 User ID: ${userId}`);
            // console.log(`🔑 Password: ${expectedPlainPassword}`); // secure log
            console.log('='.repeat(60) + '\n');

            return { userPassword, plainPassword: expectedPlainPassword, isNew: false };
        } else {
            console.log('\n' + '='.repeat(60));
            console.log('⚠️ EXISTING PASSWORD DOES NOT MATCH POLICY - UPDATING');
            console.log('='.repeat(60));
            console.log(`👤 User ID: ${userId}`);

            // Update password to match policy
            const hashedPassword = await this.hashPassword(expectedPlainPassword);
            userPassword.hashedPassword = hashedPassword;
            await userPassword.save();

            console.log('✅ Password updated to match userId suffix');
            console.log('='.repeat(60) + '\n');

            return { userPassword, plainPassword: expectedPlainPassword, isNew: true, isUpdated: true };
        }
    }

    // Slow path: need to create a new password.
    const hashedPassword = await this.hashPassword(expectedPlainPassword);

    userPassword = new this({
        userId,
        hashedPassword
    });

    try {
        await userPassword.save();
    } catch (error) {
        // Handle rare race condition where another request created the password first.
        if (error && error.code === 11000) {
            const existing = await this.findOne({ userId });

            if (existing) {
                // Check if existing follows policy (rare race case)
                const isMatch = await existing.verifyPassword(expectedPlainPassword);
                // If not match, we technically should update, but let's just return what we found to avoid recursion/complexity
                // For consistency, if it doesn't match, we might want to return expectedPlainPassword but the DB has something else.
                // This is an edge case.

                return { userPassword: existing, plainPassword: null, isNew: false };
            }
        }

        throw error;
    }

    // Log to terminal for testing purposes only
    console.log('\n' + '='.repeat(60));
    console.log('🔑 NEW USER PASSWORD GENERATED');
    console.log('='.repeat(60));
    console.log(`👤 User ID: ${userId}`);
    console.log(`🔑 Plain Password: ${expectedPlainPassword}`);
    console.log('='.repeat(60) + '\n');

    return { userPassword, plainPassword: expectedPlainPassword, isNew: true };
};

// Static method to verify user password
userPasswordSchema.statics.verifyUserPassword = async function (userId, plainPassword) {
    const userPassword = await this.findOne({ userId });

    if (!userPassword) {
        return { valid: false, message: 'User password not found' };
    }

    const isValid = await userPassword.verifyPassword(plainPassword);

    if (isValid) {
        console.log('\n' + '='.repeat(60));
        console.log('✅ PASSWORD VERIFICATION SUCCESS');
        console.log('='.repeat(60));
        console.log(`👤 User ID: ${userId}`);
        console.log('🔑 Password verified successfully');
        console.log('='.repeat(60) + '\n');

        return { valid: true, message: 'Password verified successfully' };
    } else {
        console.log('\n' + '='.repeat(60));
        console.log('❌ PASSWORD VERIFICATION FAILED');
        console.log('='.repeat(60));
        console.log(`👤 User ID: ${userId}`);
        console.log('❌ Invalid password provided');
        console.log('='.repeat(60) + '\n');

        return { valid: false, message: 'Invalid password' };
    }
};

module.exports = mongoose.model('UserPassword', userPasswordSchema);
