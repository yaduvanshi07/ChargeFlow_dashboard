const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const connectDB = require('../config/database');
require('dotenv').config();

// Reset all bookings to PENDING status for testing
async function resetAllBookingsToPending() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Reset all bookings to PENDING status
    const result = await Booking.updateMany(
      {}, 
      { 
        $set: { 
          status: 'PENDING',
          acceptedAt: null,
          sessionStartedAt: null,
          isSessionActive: false,
          otp: null,
          transactionId: null
        }
      }
    );

    console.log(`✅ Reset ${result.modifiedCount} bookings to PENDING status`);
    
    // Show current booking status
    const bookings = await Booking.find({}, { bookingId: 1, status: 1, customerName: 1, vehicleModel: 1 });
    console.log('\n📋 Current Bookings:');
    bookings.forEach(booking => {
      console.log(`ID: ${booking._id}`);
      console.log(`BookingID: ${booking.bookingId}`);
      console.log(`Status: ${booking.status}`);
      console.log(`Customer: ${booking.customerName}`);
      console.log(`Vehicle: ${booking.vehicleModel}`);
      console.log('------------------');
    });
    
  } catch (error) {
    console.error('Error resetting bookings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetAllBookingsToPending();
