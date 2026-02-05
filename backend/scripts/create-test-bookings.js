const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Charger = require('./models/Charger');
require('dotenv').config();

// Create multiple PENDING bookings for testing
async function createTestPendingBookings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chargeflow');
    console.log('Connected to MongoDB');

    // Get a charger for reference
    const charger = await Charger.findOne();
    if (!charger) {
      console.log('No chargers found. Please seed chargers first.');
      return;
    }

    // Clear existing test bookings
    await Booking.deleteMany({});

    // Create multiple PENDING bookings
    const pendingBookings = [
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439016'),
        bookingId: 'BK17067344000006',
        customerName: 'Alice Johnson',
        customerEmail: 'alice@email.com',
        customerPhone: '+91-9876543277',
        chargerId: charger._id,
        chargerName: 'City Center Mall',
        vehicleModel: 'Tata Nexon EV',
        vehicleNumber: 'DLALICE123',
        connectorType: 'Type2',
        scheduledDateTime: new Date(),
        duration: 2,
        amount: 360,
        unitPrice: '₹18/KWh',
        status: 'PENDING'
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439017'),
        bookingId: 'BK17067344000007',
        customerName: 'Bob Smith',
        customerEmail: 'bob@email.com',
        customerPhone: '+91-9876543266',
        chargerId: charger._id,
        chargerName: 'Highway Plaza',
        vehicleModel: 'MG ZS EV',
        vehicleNumber: 'DLBOB456',
        connectorType: 'Type2',
        scheduledDateTime: new Date(),
        duration: 1.5,
        amount: 270,
        unitPrice: '₹18/KWh',
        status: 'PENDING'
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439018'),
        bookingId: 'BK17067344000008',
        customerName: 'Carol Davis',
        customerEmail: 'carol@email.com',
        customerPhone: '+91-9876543255',
        chargerId: charger._id,
        chargerName: 'Residential Complex',
        vehicleModel: 'Hyundai Kona EV',
        vehicleNumber: 'DLCAROL789',
        connectorType: 'Type2',
        scheduledDateTime: new Date(),
        duration: 1,
        amount: 180,
        unitPrice: '₹18/KWh',
        status: 'PENDING'
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439019'),
        bookingId: 'BK17067344000009',
        customerName: 'David Wilson',
        customerEmail: 'david@email.com',
        customerPhone: '+91-9876543244',
        chargerId: charger._id,
        chargerName: 'Office Building',
        vehicleModel: 'Tata Tigor EV',
        vehicleNumber: 'DLDAVID012',
        connectorType: 'Type2',
        scheduledDateTime: new Date(),
        duration: 2.5,
        amount: 450,
        unitPrice: '₹18/KWh',
        status: 'PENDING'
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439020'),
        bookingId: 'BK17067344000010',
        customerName: 'Emma Thompson',
        customerEmail: 'emma@email.com',
        customerPhone: '+91-9876543233',
        chargerId: charger._id,
        chargerName: 'Shopping Center',
        vehicleModel: 'Mahindra e2o',
        vehicleNumber: 'DLEMM345',
        connectorType: 'Type2',
        scheduledDateTime: new Date(),
        duration: 1.2,
        amount: 216,
        unitPrice: '₹18/KWh',
        status: 'PENDING'
      }
    ];

    // Insert all bookings
    const insertedBookings = await Booking.insertMany(pendingBookings);
    
    console.log('✅ Created PENDING bookings for testing:');
    insertedBookings.forEach(booking => {
      console.log(`📱 ID: ${booking._id}`);
      console.log(`🔖 BookingID: ${booking.bookingId}`);
      console.log(`📊 Status: ${booking.status}`);
      console.log(`👤 Customer: ${booking.customerName}`);
      console.log(`🚗 Vehicle: ${booking.vehicleModel} (${booking.vehicleNumber})`);
      console.log(`⚡ Station: ${booking.chargerName}`);
      console.log(`💰 Amount: ₹${booking.amount}`);
      console.log('------------------');
    });
    
    console.log(`\n🎯 Total Test Bookings Created: ${insertedBookings.length}`);
    console.log('🔄 All bookings are in PENDING status for testing acceptance flow');
    
  } catch (error) {
    console.error('Error creating test bookings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestPendingBookings();
