const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings - Create a new booking
router.post('/', bookingController.createBooking);

// PUT /api/bookings/:id/accept - Host accepts the booking
router.put('/:id/accept', bookingController.acceptBooking);

// POST /api/bookings/:id/pay - Simulate Payment & Generate/Assign User Password
router.post('/:id/pay', bookingController.simulatePayment);

// Development-only: Auto-generate OTP -> Now Deprecated
router.post('/:id/auto-generate-otp', bookingController.autoGenerateOTP);

// POST /api/bookings/:id/generate-otp - Generate OTP when user reaches station
router.post('/:id/generate-otp', bookingController.generateOTP);

// POST /api/bookings/:id/verify-otp - Verify User Password to Access Station
router.post('/:id/verify-otp', bookingController.verifyOTP);

// POST /api/bookings/verify-station - Station Verification (Admin Only)
router.post('/verify-station', bookingController.verifyStation);

// POST /api/bookings/:id/complete - Complete a session
router.post('/:id/complete', bookingController.completeSession);

// GET /api/bookings/management - Get all booking management data
// Placing BEFORE '/:id' or '/' is safer to avoid confusion, though '/' is fine.
// But definitely before /:id which would capture 'management'.
router.get('/management', bookingController.getBookingManagement);

// GET /api/bookings - Get all bookings with filters
router.get('/', bookingController.getAllBookings);

// GET /api/bookings/:id - Get single booking
router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:id/cancel - Cancel a booking
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
