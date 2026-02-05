const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Charger = require('./models/Charger');
require('dotenv').config();

// Create a fresh PENDING booking for testing
async function createFreshBooking() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chargeflow');
    console.log('Connected to MongoDB');

    // Get a charger for reference
    const charger = await Charger.findOne();
    if (!charger) {
      console.log('No chargers found. Please seed chargers first.');
      return;
    }

    // Create a fresh booking with new ID
    const freshBooking = {
      _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'),
      bookingId: 'BK17067344000004',
      customerName: 'Test User',
      customerEmail: 'test.user@email.com',
      customerPhone: '+91-9876543299',
      chargerId: charger._id,
      chargerName: 'Test Charging Station',
      vehicleModel: 'Hyundai Kona EV',
      vehicleNumber: 'DLTEST9999',
      connectorType: 'Type2',
      scheduledDateTime: new Date(),
      duration: 1.5,
      amount: 250,
      unitPrice: '₹18/KWh',
      status: 'PENDING'
    };

    // Insert the fresh booking
    const insertedBooking = await Booking.create(freshBooking);
    console.log('✅ Fresh PENDING booking created:');
    console.log(`ID: ${insertedBooking._id}`);
    console.log(`BookingID: ${insertedBooking.bookingId}`);
    console.log(`Status: ${insertedBooking.status}`);
    console.log(`Customer: ${insertedBooking.customerName}`);
    console.log(`Vehicle: ${insertedBooking.vehicleModel}`);
    
  } catch (error) {
    console.error('Error creating fresh booking:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createFreshBooking();
