const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Charger = require('../models/Charger');
const connectDB = require('../config/database');
require('dotenv').config();

// Sample booking data with MongoDB ObjectId format
const sampleBookings = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    bookingId: 'BK17067344000001',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@email.com',
    customerPhone: '+91-9876543210',
    chargerId: null, // Will be set after finding a charger
    chargerName: 'Premium Mall Charging Hub',
    vehicleModel: 'Tata Nexon EV',
    vehicleNumber: 'DLxxxxxx34',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2,
    amount: 320,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    bookingId: 'BK17067344000002',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@email.com',
    customerPhone: '+91-9876543211',
    chargerId: null,
    chargerName: 'Residential Society Charger',
    vehicleModel: 'MG ZS EV',
    vehicleNumber: 'DLxxxxxx54',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2.5,
    amount: 410,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
    bookingId: 'BK17067344000003',
    customerName: 'Amit Kumar',
    customerEmail: 'amit.kumar@email.com',
    customerPhone: '+91-9876543212',
    chargerId: null,
    chargerName: 'Highway Charging Point',
    vehicleModel: 'Tata Nexon EV',
    vehicleNumber: 'DLxxxxxx43',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2,
    amount: 320,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'),
    bookingId: 'BK17067344000004',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha.reddy@email.com',
    customerPhone: '+91-9876543213',
    chargerId: null,
    chargerName: 'Tech Park Charging Station',
    vehicleModel: 'Hyundai Kona Electric',
    vehicleNumber: 'DLxxxxxx65',
    connectorType: 'CCS',
    scheduledDateTime: new Date(),
    duration: 1.5,
    amount: 280,
    unitPrice: '₹20/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439015'),
    bookingId: 'BK17067344000005',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram.singh@email.com',
    customerPhone: '+91-9876543214',
    chargerId: null,
    chargerName: 'Airport Charging Hub',
    vehicleModel: 'Mahindra XUV400',
    vehicleNumber: 'DLxxxxxx76',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 3,
    amount: 450,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439016'),
    bookingId: 'BK17067344000006',
    customerName: 'Anjali Gupta',
    customerEmail: 'anjali.gupta@email.com',
    customerPhone: '+91-9876543215',
    chargerId: null,
    chargerName: 'City Center Mall',
    vehicleModel: 'Tata Tiago EV',
    vehicleNumber: 'DLxxxxxx87',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2,
    amount: 320,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439017'),
    bookingId: 'BK17067344000007',
    customerName: 'Rohit Verma',
    customerEmail: 'rohit.verma@email.com',
    customerPhone: '+91-9876543216',
    chargerId: null,
    chargerName: 'Railway Station Charger',
    vehicleModel: 'Nexon EV Max',
    vehicleNumber: 'DLxxxxxx98',
    connectorType: 'CCS',
    scheduledDateTime: new Date(),
    duration: 2.5,
    amount: 420,
    unitPrice: '₹20/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439018'),
    bookingId: 'BK17067344000008',
    customerName: 'Kavita Nair',
    customerEmail: 'kavita.nair@email.com',
    customerPhone: '+91-9876543217',
    chargerId: null,
    chargerName: 'Hospital Parking Charger',
    vehicleModel: 'MG Comet EV',
    vehicleNumber: 'DLxxxxxx09',
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
    customerName: 'Arjun Mehta',
    customerEmail: 'arjun.mehta@email.com',
    customerPhone: '+91-9876543218',
    chargerId: null,
    chargerName: 'University Campus Charger',
    vehicleModel: 'Tata Punch EV',
    vehicleNumber: 'DLxxxxxx10',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 1.5,
    amount: 270,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439020'),
    bookingId: 'BK17067344000010',
    customerName: 'Divya Sharma',
    customerEmail: 'divya.sharma@email.com',
    customerPhone: '+91-9876543219',
    chargerId: null,
    chargerName: 'Shopping Mall Plaza',
    vehicleModel: 'Hyundai Ioniq 5',
    vehicleNumber: 'DLxxxxxx11',
    connectorType: 'CCS',
    scheduledDateTime: new Date(),
    duration: 3,
    amount: 480,
    unitPrice: '₹20/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439021'),
    bookingId: 'BK17067344000011',
    customerName: 'Manish Kumar',
    customerEmail: 'manish.kumar@email.com',
    customerPhone: '+91-9876543220',
    chargerId: null,
    chargerName: 'Corporate Office Charger',
    vehicleModel: 'Mahindra e2o Plus',
    vehicleNumber: 'DLxxxxxx12',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2,
    amount: 320,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    bookingId: 'BK17067344000012',
    customerName: 'Pooja Singh',
    customerEmail: 'pooja.singh@email.com',
    customerPhone: '+91-9876543221',
    chargerId: null,
    chargerName: 'Residential Complex A',
    vehicleModel: 'Tata Tigor EV',
    vehicleNumber: 'DLxxxxxx13',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2.5,
    amount: 380,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439023'),
    bookingId: 'BK17067344000013',
    customerName: 'Karan Patel',
    customerEmail: 'karan.patel@email.com',
    customerPhone: '+91-9876543222',
    chargerId: null,
    chargerName: 'Highway Rest Stop',
    vehicleModel: 'MG Windsor EV',
    vehicleNumber: 'DLxxxxxx14',
    connectorType: 'CCS',
    scheduledDateTime: new Date(),
    duration: 1.5,
    amount: 280,
    unitPrice: '₹20/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439024'),
    bookingId: 'BK17067344000014',
    customerName: 'Swati Deshmukh',
    customerEmail: 'swati.deshmukh@email.com',
    customerPhone: '+91-9876543223',
    chargerId: null,
    chargerName: 'Metro Station Charger',
    vehicleModel: 'Tata Nexon EV',
    vehicleNumber: 'DLxxxxxx15',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2,
    amount: 320,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439025'),
    bookingId: 'BK17067344000015',
    customerName: 'Rajesh Malhotra',
    customerEmail: 'rajesh.malhotra@email.com',
    customerPhone: '+91-9876543224',
    chargerId: null,
    chargerName: 'IT Park Charging Hub',
    vehicleModel: 'Hyundai Kona Electric',
    vehicleNumber: 'DLxxxxxx16',
    connectorType: 'CCS',
    scheduledDateTime: new Date(),
    duration: 3,
    amount: 450,
    unitPrice: '₹20/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439026'),
    bookingId: 'BK17067344000016',
    customerName: 'Neha Joshi',
    customerEmail: 'neha.joshi@email.com',
    customerPhone: '+91-9876543225',
    chargerId: null,
    chargerName: 'Stadium Parking Charger',
    vehicleModel: 'Mahindra XUV400',
    vehicleNumber: 'DLxxxxxx17',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2.5,
    amount: 380,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439027'),
    bookingId: 'BK17067344000017',
    customerName: 'Alok Tiwari',
    customerEmail: 'alok.tiwari@email.com',
    customerPhone: '+91-9876543226',
    chargerId: null,
    chargerName: 'Beach Side Charging',
    vehicleModel: 'Tata Tiago EV',
    vehicleNumber: 'DLxxxxxx18',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 1,
    amount: 180,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439028'),
    bookingId: 'BK17067344000018',
    customerName: 'Meera Krishnan',
    customerEmail: 'meera.krishnan@email.com',
    customerPhone: '+91-9876543227',
    chargerId: null,
    chargerName: 'Forest Reserve Charger',
    vehicleModel: 'MG ZS EV',
    vehicleNumber: 'DLxxxxxx19',
    connectorType: 'CCS',
    scheduledDateTime: new Date(),
    duration: 2,
    amount: 340,
    unitPrice: '₹20/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439029'),
    bookingId: 'BK17067344000019',
    customerName: 'Vivek Choudhary',
    customerEmail: 'vivek.choudhary@email.com',
    customerPhone: '+91-9876543228',
    chargerId: null,
    chargerName: 'Mountain View Resort',
    vehicleModel: 'Tata Punch EV',
    vehicleNumber: 'DLxxxxxx20',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 1.5,
    amount: 270,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439030'),
    bookingId: 'BK17067344000020',
    customerName: 'Anita Reddy',
    customerEmail: 'anita.reddy@email.com',
    customerPhone: '+91-9876543229',
    chargerId: null,
    chargerName: 'Downtown Business District',
    vehicleModel: 'Hyundai Ioniq 5',
    vehicleNumber: 'DLxxxxxx21',
    connectorType: 'CCS',
    scheduledDateTime: new Date(),
    duration: 3,
    amount: 480,
    unitPrice: '₹20/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439031'),
    bookingId: 'BK17067344000021',
    customerName: 'Sanjay Kumar',
    customerEmail: 'sanjay.kumar@email.com',
    customerPhone: '+91-9876543230',
    chargerId: null,
    chargerName: 'Suburban Shopping Center',
    vehicleModel: 'Mahindra e2o Plus',
    vehicleNumber: 'DLxxxxxx22',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2,
    amount: 320,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439032'),
    bookingId: 'BK17067344000022',
    customerName: 'Rashmi Verma',
    customerEmail: 'rashmi.verma@email.com',
    customerPhone: '+91-9876543231',
    chargerId: null,
    chargerName: 'Industrial Area Charger',
    vehicleModel: 'Tata Tigor EV',
    vehicleNumber: 'DLxxxxxx23',
    connectorType: 'Type2',
    scheduledDateTime: new Date(),
    duration: 2.5,
    amount: 380,
    unitPrice: '₹18/KWh',
    status: 'PENDING'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439033'),
    bookingId: 'BK17067344000023',
    customerName: 'Deepak Shah',
    customerEmail: 'deepak.shah@email.com',
    customerPhone: '+91-9876543232',
    chargerId: null,
    chargerName: 'Heritage Site Parking',
    vehicleModel: 'MG Windsor EV',
    vehicleNumber: 'DLxxxxxx24',
    connectorType: 'CCS',
    scheduledDateTime: new Date(),
    duration: 1.5,
    amount: 280,
    unitPrice: '₹20/KWh',
    status: 'PENDING'
  }
];

async function seedBookings() {
  try {
    // Connect to MongoDB using centralized connection
    await connectDB();
    console.log('Connected to MongoDB');

    // Get a charger for reference
    const charger = await Charger.findOne();
    if (!charger) {
      console.log('No chargers found. Please seed chargers first.');
      return;
    }

    // Assign charger ID to bookings
    sampleBookings.forEach(booking => {
      booking.chargerId = charger._id;
    });

    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('Cleared existing bookings');

    // Insert sample bookings
    const insertedBookings = await Booking.insertMany(sampleBookings);
    console.log(`Successfully inserted ${insertedBookings.length} bookings`);

    // Log the booking IDs for reference
    insertedBookings.forEach(booking => {
      console.log(`Booking ID: ${booking._id} (${booking.bookingId}) - Status: ${booking.status}`);
    });

  } catch (error) {
    console.error('Error seeding bookings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedBookings();
