const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings - Create a new booking
router.post('/', bookingController.createBooking);

// PUT /api/bookings/:id/accept - Host accepts the booking
router.put('/:id/accept', bookingController.acceptBooking);

// Development-only: Auto-generate OTP when track page is opened
router.post('/:id/auto-generate-otp', bookingController.autoGenerateOTP);

// POST /api/bookings/:id/generate-otp - Generate OTP when user reaches station
router.post('/:id/generate-otp', bookingController.generateOTP);

// POST /api/bookings/:id/verify-otp - Verify OTP and trigger all updates
router.post('/:id/verify-otp', bookingController.verifyOTP);

// GET /api/bookings - Get all bookings with filters
router.get('/', bookingController.getAllBookings);

// GET /api/bookings/:id - Get single booking
router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:id/cancel - Cancel a booking
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
