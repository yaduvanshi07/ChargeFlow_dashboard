require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
const limiter = require('./middleware/rateLimiter');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(corsOptions));

// Rate limiting (applied to all API routes)
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware - DISABLED to reduce terminal noise
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// } else {
//     app.use(morgan('combined'));
// }

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ChargeFlow Backend API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/api/money', require('./routes/money'));
app.use('/api/chargers', require('./routes/chargers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/user-passwords', require('./routes/userPasswords'));
app.use('/api/users', require('./routes/users'));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
