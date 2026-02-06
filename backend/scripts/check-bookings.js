const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const connectDB = require('../config/database');
require('dotenv').config();

async function checkBookings() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const bookings = await Booking.find({}, 'bookingId _id status customerName vehicleModel');
    console.log('Available Bookings:');
    console.log('==================');
    
    if (bookings.length === 0) {
      console.log('No bookings found in database!');
    } else {
      bookings.forEach(b => {
        console.log(`ID: ${b._id}`);
        console.log(`BookingID: ${b.bookingId}`);
        console.log(`Status: ${b.status}`);
        console.log(`Customer: ${b.customerName}`);
        console.log(`Vehicle: ${b.vehicleModel}`);
        console.log('------------------');
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkBookings();
