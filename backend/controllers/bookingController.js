const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Charger = require('../models/Charger');
const Transaction = require('../models/Transaction');
const { generateOTP, getOtpExpiry } = require('../utils/otpUtils');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            chargerId,
            vehicleModel,
            vehicleNumber,
            connectorType,
            scheduledDateTime,
            duration,
            amount,
            unitPrice
        } = req.body;

        // Validation
        if (!customerName || !customerEmail || !chargerId || !scheduledDateTime || !duration || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: customerName, customerEmail, chargerId, scheduledDateTime, duration, amount'
            });
        }

        // Check if charger exists
        const charger = await Charger.findById(chargerId);
        if (!charger) {
            return res.status(404).json({
                success: false,
                message: 'Charger not found'
            });
        }

        // Generate unique booking ID
        const bookingId = await Booking.generateBookingId();

        // Create booking with PENDING status
        const booking = new Booking({
            bookingId,
            customerName,
            customerEmail,
            customerPhone: customerPhone || '',
            chargerId,
            chargerName: charger.name,
            vehicleModel: vehicleModel || '',
            vehicleNumber: vehicleNumber || '',
            connectorType: connectorType || '',
            scheduledDateTime: new Date(scheduledDateTime),
            duration,
            amount,
            unitPrice: unitPrice || '',
            status: 'PENDING'
        });

        await booking.save();

        // Populate charger info for response
        await booking.populate('chargerId', 'name location type power status');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Host accepts the booking
exports.acceptBooking = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking can be accepted
        if (booking.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: `Booking cannot be accepted. Current status: ${booking.status}`
            });
        }

        // Update booking status to ACCEPTED
        booking.status = 'ACCEPTED';
        booking.acceptedAt = new Date();
        await booking.save();

        await booking.populate('chargerId', 'name location type power status');

        // Create or fetch user for this booking (no password generation at this stage)
        const User = require('../models/User');
        let user = await User.findOne({ email: booking.customerEmail });

        if (!user) {
            user = new User({
                email: booking.customerEmail,
                name: booking.customerName
            });
            await user.save();
            console.log(`👤 Created new user: ${booking.customerEmail}`);
        } else {
            console.log(`👤 Found existing user: ${booking.customerEmail}`);
        }

        const BookingManagement = require('../models/BookingManagement');

        // Ensure a single lifecycle record per booking (idempotent on bookingId)
        let bookingManagement = await BookingManagement.findOne({ bookingId: booking._id });

        if (!bookingManagement) {
            bookingManagement = new BookingManagement({
                bookingId: booking._id,
                userId: user._id,
                chargerId: booking.chargerId?._id || booking.chargerId,
                hostId: null, // Reserved for future host ownership model
                stationName: booking.chargerId?.name || 'Unknown Station',
                chargerName: booking.chargerName,
                amount: booking.amount,
                scheduledTime: booking.scheduledDateTime,
                status: 'UPCOMING',
                paymentStatus: 'PENDING'
            });
        } else {
            // If a record already exists (legacy or partial), update linkage/user safely
            bookingManagement.userId = user._id;
            bookingManagement.chargerId = booking.chargerId?._id || booking.chargerId;
            if (!bookingManagement.scheduledTime) {
                bookingManagement.scheduledTime = booking.scheduledDateTime;
            }
        }

        await bookingManagement.save();

        console.log(`🔗 Linked booking ${booking.bookingId} to user ${user._id} in BookingManagement`);

        console.log('\n' + '='.repeat(60));
        console.log('✅ BOOKING ACCEPTED');
        console.log('='.repeat(60));
        console.log(`To Customer: Your booking has been accepted. Please complete payment.`);
        console.log('='.repeat(60) + '\n');

        res.status(200).json({
            success: true,
            message: 'Booking accepted successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error accepting booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Simulate Payment & Password Generation
exports.simulatePayment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
        }

        const booking = await Booking.findById(req.params.id);
        const BookingManagement = require('../models/BookingManagement');
        const bookingMgmt = await BookingManagement.findOne({ bookingId: req.params.id });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (!bookingMgmt) {
            return res.status(404).json({ success: false, message: 'Booking Management record not found. Was booking accepted?' });
        }

        if (bookingMgmt.paymentStatus === 'PAID') {
            return res.status(400).json({ success: false, message: 'Payment already completed' });
        }

        // 1. Handle User & Password using user-bound password system
        const User = require('../models/User');
        const UserPassword = require('../models/UserPassword');
        let user = await User.findOne({ email: booking.customerEmail });
        let plainPassword;
        let isNewUser = false;
        let passwordRecord = null;

        if (user) {
            // Existing user - get or create password record
            const existingPasswordRecord = await UserPassword.findOne({ userId: user._id });
            if (existingPasswordRecord) {
                passwordRecord = existingPasswordRecord;
                console.log('🔑 Using existing user password (created in a previous payment flow)');
            } else {
                const passwordResult = await UserPassword.getOrCreateUserPassword(user._id);
                plainPassword = passwordResult.plainPassword;
                passwordRecord = passwordResult.userPassword;
                console.log('🔑 Generated password for existing user during payment flow');
            }
        } else {
            // New user - create user and password
            isNewUser = true;
            user = new User({
                email: booking.customerEmail,
                name: booking.customerName
            });
            await user.save();

            const passwordResult = await UserPassword.getOrCreateUserPassword(user._id);
            plainPassword = passwordResult.plainPassword;
            passwordRecord = passwordResult.userPassword;
        }

        // 2. Update BookingManagement lifecycle state
        bookingMgmt.paymentStatus = 'PAID';
        bookingMgmt.status = 'CONFIRMED';
        bookingMgmt.userId = user._id; // Ensure user is linked
        if (passwordRecord && !bookingMgmt.passwordId) {
            bookingMgmt.passwordId = passwordRecord._id;
        }
        await bookingMgmt.save();

        // Log to terminal (backend only, never to API)
        console.log('\n' + '='.repeat(60));
        console.log('💰 PAYMENT RECEIVED - SIMULATION');
        console.log('='.repeat(60));
        console.log(`📱 Booking ID: ${booking.bookingId}`);
        console.log(`🆔 Booking _id: ${booking._id}`);
        console.log(`Amount Paid: ₹${booking.amount}`);
        console.log(`User: ${user.name} (${user.email})`);
        console.log(`User ID: ${user._id}`);
        console.log(`Status: ${isNewUser ? 'New User Created' : 'Existing User Found'}`);
        if (plainPassword) {
            console.log('-'.repeat(60));
            console.log(`🔑 USER PASSWORD: ${plainPassword}`);
            console.log(`📝 Password Type: ${isNewUser ? 'NEW' : 'EXISTING (Created Now)'}`);
            console.log(`Summary -> userId: ${user._id}, bookingId: ${booking._id}, amount: ₹${booking.amount}, password: ${plainPassword}`);
            console.log(`(Send this password to the user via SMS/Email)`);
        } else {
            console.log('-'.repeat(60));
            console.log('🔑 USER PASSWORD: (REUSED - NOT LOGGED FOR SECURITY)');
            console.log('📝 Password Type: EXISTING');
        }
        console.log('='.repeat(60) + '\n');

        res.status(200).json({
            success: true,
            message: 'Payment confirmed and user password processed',
            data: {
                paymentStatus: 'PAID',
                userId: user._id,
                isNewUser: isNewUser
                // Note: plainPassword is NOT returned in API response as per requirements
            }
        });

    } catch (error) {
        console.error('Error simulating payment:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Development-only: Auto-generate OTP -> DEPRECATED/UNUSED in new flow, but kept stubbed
exports.autoGenerateOTP = async (req, res) => {
    res.status(200).json({ message: 'Use /pay endpoint to generate User Password instead.' });
};

// Generate OTP when user reaches station -> REDUNDANT now as password is per user
exports.generateOTP = async (req, res) => {
    res.status(200).json({ message: 'User already has a password. Use that.' });
};

// Verify User Password at Station (replaces OTP verification)
exports.verifyOTP = async (req, res) => {
    const session = await Booking.db.startSession();
    session.startTransaction();

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
        }

        // The frontend sends { otp: "xxxxxx" } - keeping field name for compatibility
        const { otp } = req.body;

        if (!otp) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        // Find booking
        const booking = await Booking.findById(req.params.id).session(session);

        if (!booking) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Find User associated with this booking (by email)
        const User = require('../models/User');
        const UserPassword = require('../models/UserPassword');
        const user = await User.findOne({ email: booking.customerEmail }).session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'User identity not found. Has payment been completed?'
            });
        }

        // Verify user password using the user-bound password system
        const verificationResult = await UserPassword.verifyUserPassword(user._id, otp);

        if (!verificationResult.valid) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: verificationResult.message
            });
        }

        // SUCCESS FLOW

        // Check if charger is available
        const charger = await Charger.findById(booking.chargerId).session(session);
        if (!charger) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Charger not found' });
        }

        // 1. Update booking status to VERIFIED
        booking.status = 'VERIFIED';
        booking.sessionStartedAt = new Date();
        booking.isSessionActive = true;
        // Clear old OTP fields if any to avoid confusion
        booking.otp = undefined;

        await booking.save({ session });

        // Update BookingManagement status
        // User requested to keep status as CONFIRMED until session is over.
        // const BookingManagement = require('../models/BookingManagement');
        // await BookingManagement.findOneAndUpdate(
        //     { bookingId: booking._id },
        //     { status: 'COMPLETED' }
        // ).session(session);

        // 2. Create transaction (revenue)
        const transaction = new Transaction({
            amount: booking.amount,
            source: 'CHARGING',
            description: `Charging session - ${booking.chargerName} - ${booking.vehicleModel || 'N/A'}`
        });
        await transaction.save({ session });

        // Link transaction to booking
        booking.transactionId = transaction._id;
        // booking.paid = true; // (Field doesn't exist in Booking schema, so skipping, transaction implies paid)
        await booking.save({ session });

        // 3. Update charger
        charger.totalSessions += 1;
        if (charger.status !== 'ONLINE') {
            charger.status = 'ONLINE';
        }
        charger.utilization = Math.min(100, charger.utilization + 5);
        await charger.save({ session });

        await session.commitTransaction();

        // Print verification success to terminal
        console.log('\n' + '='.repeat(60));
        console.log('✅ STATION ACCESS GRANTED');
        console.log('='.repeat(60));
        console.log(`📱 Booking ID: ${booking.bookingId}`);
        console.log(`👤 User: ${user.name}`);
        console.log(`🔑 Password Verified`);
        console.log(`⚡ Charger: ${booking.chargerName} ACTIVATED`);
        console.log(`💰 Revenue Recorded: ₹${transaction.amount}`);
        console.log('='.repeat(60) + '\n');

        // Populate for response
        await booking.populate('chargerId', 'name location type power status');
        await booking.populate('transactionId');

        res.status(200).json({
            success: true,
            message: 'Password verified. Charging session started.',
            data: {
                booking: booking,
                transaction: transaction,
                charger: charger
            }
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.error('Error verifying Station Password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        session.endSession();
    }
};

// Verify User Password at Station (Admin Only, Existing UI)
exports.verifyStation = async (req, res) => {
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

        // Find user password record
        const UserPassword = require('../models/UserPassword');
        const userPasswordRecord = await UserPassword.findOne({ userId });

        if (!userPasswordRecord) {
            console.log('\n' + '='.repeat(60));
            console.log('❌ STATION VERIFICATION FAILED');
            console.log('='.repeat(60));
            console.log(`User ID: ${userId}`);
            console.log('Reason: User password record not found');
            console.log('='.repeat(60) + '\n');

            return res.status(404).json({
                success: false,
                message: 'User password not found'
            });
        }

        // Verify password against hash
        const isPasswordValid = await userPasswordRecord.verifyPassword(password);

        if (!isPasswordValid) {
            console.log('\n' + '='.repeat(60));
            console.log('❌ STATION VERIFICATION FAILED');
            console.log('='.repeat(60));
            console.log(`User ID: ${userId}`);
            console.log('Reason: Invalid password');
            console.log('='.repeat(60) + '\n');

            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Success - Log verification success
        console.log('\n' + '='.repeat(60));
        console.log('✅ STATION VERIFICATION SUCCESS');
        console.log('='.repeat(60));
        console.log(`User ID: ${userId}`);
        console.log('Password verified successfully');
        console.log('='.repeat(60) + '\n');

        res.status(200).json({
            success: true,
            message: 'Station verification successful'
        });

    } catch (error) {
        console.error('Error verifying station:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all bookings with filters
exports.getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const chargerId = req.query.chargerId;

        const query = {};
        if (status && ['PENDING', 'ACCEPTED', 'VERIFIED', 'CANCELLED', 'MISSED', 'COMPLETED'].includes(status)) {
            query.status = status;
        }
        if (chargerId) {
            query.chargerId = chargerId;
        }

        const bookings = await Booking.find(query)
            .populate('chargerId', 'name location type power status')
            .populate('transactionId')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                bookings,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error getting bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single booking
exports.getBookingById = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate('chargerId', 'name location type power status')
            .populate('transactionId');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Try to get userId from BookingManagement
        const BookingManagement = require('../models/BookingManagement');
        const bookingManagement = await BookingManagement.findOne({ bookingId: booking._id });

        // Add userId to booking response if available
        const bookingResponse = booking.toObject();
        if (bookingManagement && bookingManagement.userId) {
            bookingResponse.userId = bookingManagement.userId;
        }

        res.status(200).json({
            success: true,
            data: bookingResponse
        });
    } catch (error) {
        console.error('Error getting booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking can be cancelled
        if (booking.status === 'VERIFIED' || booking.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel verified or completed booking'
            });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        booking.status = 'CANCELLED';
        booking.cancelledAt = new Date();
        await booking.save();

        await booking.populate('chargerId', 'name location type power status');

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get Booking Management Data
exports.getBookingManagement = async (req, res) => {
    try {
        const BookingManagement = require('../models/BookingManagement');
        // Fetch all management records
        const records = await BookingManagement.find()
            .sort({ updatedAt: -1 });

        // Format for frontend
        const formattedData = await Promise.all(records.map(async (record) => {
            const booking = await Booking.findById(record.bookingId);

            return {
                id: record._id,
                bookingId: booking ? booking.bookingId : 'N/A',
                customerName: booking ? booking.customerName : 'Unknown',
                charger: record.chargerName,
                dateTime: new Date(record.createdAt).toLocaleString(),
                duration: booking ? `${booking.duration} mins` : 'N/A',
                amount: record.amount,
                status: record.status
            };
        }));

        res.status(200).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error('Error getting booking management data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Complete a session (manually or automatically called)
exports.completeSession = async (req, res) => {
    const session = await Booking.db.startSession();
    session.startTransaction();

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
        }

        const booking = await Booking.findById(req.params.id).session(session);
        if (!booking) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.status !== 'VERIFIED') {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'Session must be verified/active to complete. Current status: ' + booking.status });
        }

        // 1. Update booking status
        booking.status = 'COMPLETED';
        booking.sessionEndedAt = new Date();
        booking.isSessionActive = false;
        await booking.save({ session });

        // 2. Update BookingManagement status
        const BookingManagement = require('../models/BookingManagement');
        await BookingManagement.findOneAndUpdate(
            { bookingId: booking._id },
            { status: 'COMPLETED' }
        ).session(session);

        await session.commitTransaction();

        console.log('\n' + '='.repeat(60));
        console.log('✅ SESSION COMPLETED');
        console.log('='.repeat(60));
        console.log(`📱 Booking ID: ${booking.bookingId}`);
        console.log(`Duration: ${booking.duration} hours`);
        console.log('='.repeat(60) + '\n');

        res.status(200).json({
            success: true,
            message: 'Session completed successfully',
            data: booking
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.error('Error completing session:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        session.endSession();
    }
};
