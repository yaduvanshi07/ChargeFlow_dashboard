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

        // Update booking status to ACCEPTED (for OTP flow)
        booking.status = 'ACCEPTED';
        booking.acceptedAt = new Date();
        await booking.save();

        await booking.populate('chargerId', 'name location type power status');

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

// Development-only: Auto-generate OTP when track page is opened
exports.autoGenerateOTP = async (req, res) => {
    try {
        // Skip this endpoint in production
        if (process.env.NODE_ENV === 'production') {
            return res.status(404).json({
                success: false,
                message: 'Endpoint not available in production'
            });
        }

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

        // Only auto-generate for ACCEPTED bookings
        if (booking.status !== 'ACCEPTED') {
            return res.status(400).json({
                success: false,
                message: `Auto OTP generation only available for ACCEPTED bookings. Current status: ${booking.status}`
            });
        }

        // Check if OTP already exists and is valid
        if (booking.otp && !booking.otp.isUsed && booking.otp.expiresAt > new Date()) {
            console.log(`\n🔄 OTP ALREADY EXISTS for booking ${booking.bookingId}: ${booking.otp.code}\n`);
            return res.status(200).json({
                success: true,
                message: 'OTP already exists and is valid',
                data: {
                    bookingId: booking.bookingId,
                    otp: booking.otp.code,
                    expiresAt: booking.otp.expiresAt,
                    alreadyExisted: true
                }
            });
        }

        // Check if charger is still available
        const charger = await Charger.findById(booking.chargerId);
        if (!charger) {
            return res.status(404).json({
                success: false,
                message: 'Charger not found'
            });
        }

        if (charger.status === 'OFFLINE' || charger.status === 'MAINTENANCE') {
            return res.status(400).json({
                success: false,
                message: `Charger is ${charger.status}. Cannot generate OTP.`
            });
        }

        // Generate new OTP
        const otpCode = generateOTP();
        const expiresAt = getOtpExpiry();

        // Save OTP to booking
        booking.otp = {
            code: otpCode,
            expiresAt: expiresAt,
            isUsed: false
        };

        await booking.save();

        // Development-only simple log
        console.log(`\n🧪 TEST OTP for booking ${booking.bookingId}: ${otpCode}\n`);

        res.status(200).json({
            success: true,
            message: 'OTP auto-generated successfully',
            data: {
                bookingId: booking.bookingId,
                otp: otpCode,
                expiresAt: expiresAt,
                alreadyExisted: false
            }
        });
    } catch (error) {
        console.error('Error auto-generating OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Generate OTP when user reaches station
exports.generateOTP = async (req, res) => {
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

        // Check if booking is in ACCEPTED status
        if (booking.status !== 'ACCEPTED') {
            return res.status(400).json({
                success: false,
                message: `OTP can only be generated for ACCEPTED bookings. Current status: ${booking.status}`
            });
        }

        // Check if charger is still available
        const charger = await Charger.findById(booking.chargerId);
        if (!charger) {
            return res.status(404).json({
                success: false,
                message: 'Charger not found'
            });
        }

        if (charger.status === 'OFFLINE' || charger.status === 'MAINTENANCE') {
            return res.status(400).json({
                success: false,
                message: `Charger is ${charger.status}. Cannot generate OTP.`
            });
        }

        // Generate new OTP
        const otpCode = generateOTP();
        const expiresAt = getOtpExpiry();

        // Save OTP to booking
        booking.otp = {
            code: otpCode,
            expiresAt: expiresAt,
            isUsed: false
        };

        await booking.save();

        // Print OTP to terminal for testing
        console.log('\n' + '='.repeat(60));
        console.log('🔔 OTP GENERATED FOR TESTING');
        console.log('='.repeat(60));
        console.log(`📱 Booking ID: ${booking.bookingId}`);
        console.log(`🔢 OTP Code: ${otpCode}`);
        console.log(`⏰ Expires At: ${expiresAt.toLocaleString()}`);
        console.log(`⏳ Valid For: 15 minutes`);
        console.log('='.repeat(60));
        console.log('👤 Customer: ' + booking.customerName);
        console.log('📧 Email: ' + booking.customerEmail);
        console.log('🚗 Vehicle: ' + booking.vehicleModel + ' (' + booking.vehicleNumber + ')');
        console.log('='.repeat(60) + '\n');

        // In production, send OTP via SMS/Email
        // For now, we'll return it in response (mock)

        res.status(200).json({
            success: true,
            message: 'OTP generated successfully',
            data: {
                bookingId: booking.bookingId,
                otp: otpCode, // In production, don't return OTP in response
                expiresAt: expiresAt,
                expiresInMinutes: 15
            }
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify OTP and trigger all updates
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

        const { otp } = req.body;

        if (!otp) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'OTP is required'
            });
        }

        // Find booking with lock to prevent race conditions
        const booking = await Booking.findById(req.params.id).session(session);

        if (!booking) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking is already verified/completed
        if (booking.status === 'VERIFIED' || booking.status === 'COMPLETED') {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Booking is already verified/completed'
            });
        }

        // Check if booking is cancelled
        if (booking.status === 'CANCELLED') {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Cannot verify OTP for cancelled booking'
            });
        }

        // Verify OTP
        const otpVerification = booking.verifyOtp(otp);
        if (!otpVerification.valid) {
            // Print OTP failure to terminal
            console.log('\n' + '='.repeat(60));
            console.log('❌ OTP VERIFICATION FAILED');
            console.log('='.repeat(60));
            console.log(`📱 Booking ID: ${booking.bookingId}`);
            console.log(`🔢 Wrong OTP: ${otp}`); // Fixed variable reference from otpCode to otp
            console.log(`👤 Customer: ${booking.customerName}`);
            console.log(`🚗 Vehicle: ${booking.vehicleModel} (${booking.vehicleNumber})`);
            console.log(`💬 Reason: ${otpVerification.message}`);
            console.log('='.repeat(60) + '\n');

            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: otpVerification.message
            });
        }

        // Check if charger is still available
        const charger = await Charger.findById(booking.chargerId).session(session);
        if (!charger) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Charger not found'
            });
        }

        if (charger.status === 'OFFLINE' || charger.status === 'MAINTENANCE') {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: `Charger is ${charger.status}. Cannot start session.`
            });
        }

        // ✅ ALL UPDATES HAPPEN HERE (ONLY AFTER OTP VERIFICATION)

        // 1. Update booking status to VERIFIED
        booking.status = 'VERIFIED';
        booking.sessionStartedAt = new Date();
        booking.isSessionActive = true;
        await booking.save({ session });

        // 2. Create transaction (revenue)
        const transaction = new Transaction({
            amount: booking.amount,
            source: 'CHARGING',
            description: `Charging session - ${booking.chargerName} - ${booking.vehicleModel || 'N/A'}`
        });
        await transaction.save({ session });

        // Link transaction to booking
        booking.transactionId = transaction._id;
        await booking.save({ session });

        // 3. Update charger: increment sessions, mark as ONLINE/ACTIVE
        charger.totalSessions += 1;
        if (charger.status !== 'ONLINE') {
            charger.status = 'ONLINE';
        }
        // Update utilization (simple calculation: sessions / some base)
        charger.utilization = Math.min(100, charger.utilization + 5); // Increase by 5% per session
        await charger.save({ session });

        // Commit transaction
        await session.commitTransaction();

        // Print verification success to terminal
        console.log('\n' + '='.repeat(60));
        console.log('✅ OTP VERIFICATION SUCCESSFUL');
        console.log('='.repeat(60));
        console.log(`📱 Booking ID: ${booking.bookingId}`);
        console.log(`🔢 OTP Verified: ${otp}`);
        console.log(`💰 Amount: ₹${booking.amount}`);
        console.log(`🚗 Vehicle: ${booking.vehicleModel} (${booking.vehicleNumber})`);
        console.log(`⚡ Charger: ${booking.chargerName}`);
        console.log(`💳 Transaction ID: ${transaction._id}`);
        console.log(`📊 Revenue Added: ₹${transaction.amount}`);
        console.log(`🔌 Charger Sessions Updated: ${charger.totalSessions}`);
        console.log('='.repeat(60) + '\n');

        // Populate for response (outside transaction)
        await booking.populate('chargerId', 'name location type power status');
        await booking.populate('transactionId');

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully. Session started and revenue recorded.',
            data: {
                booking: booking,
                transaction: transaction,
                charger: charger
            }
        });
    } catch (error) {
        // Only abort if transaction is still active
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        session.endSession();
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

        res.status(200).json({
            success: true,
            data: booking
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
