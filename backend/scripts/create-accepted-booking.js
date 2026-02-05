const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Charger = require('./models/Charger');
require('dotenv').config();

// Create a fresh ACCEPTED booking for testing auto OTP
async function createFreshAcceptedBooking() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chargeflow');
    console.log('Connected to MongoDB');

    // Get a charger for reference
    const charger = await Charger.findOne();
    if (!charger) {
      console.log('No chargers found. Please seed chargers first.');
      return;
    }

    // Create a fresh booking with new ID and ACCEPTED status
    const freshBooking = {
      _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439015'),
      bookingId: 'BK17067344000005',
      customerName: 'Auto Test User',
      customerEmail: 'auto.test@email.com',
      customerPhone: '+91-9876543288',
      chargerId: charger._id,
      chargerName: 'Auto Test Station',
      vehicleModel: 'Tata Tigor EV',
      vehicleNumber: 'DLAUTO8888',
      connectorType: 'Type2',
      scheduledDateTime: new Date(),
      duration: 1,
      amount: 180,
      unitPrice: '₹18/KWh',
      status: 'ACCEPTED', // Already accepted
      acceptedAt: new Date()
    };

    // Insert the fresh booking
    const insertedBooking = await Booking.create(freshBooking);
    console.log('✅ Fresh ACCEPTED booking created:');
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

createFreshAcceptedBooking();
