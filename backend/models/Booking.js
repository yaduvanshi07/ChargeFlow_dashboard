const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking basic info
  bookingId: {
    type: String,
    required: [true, 'Booking ID is required'],
    unique: true,
    trim: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  
  // Charger reference
  chargerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charger',
    required: [true, 'Charger ID is required']
  },
  chargerName: {
    type: String,
    required: [true, 'Charger name is required'],
    trim: true
  },
  
  // Vehicle info
  vehicleModel: {
    type: String,
    trim: true
  },
  vehicleNumber: {
    type: String,
    trim: true
  },
  connectorType: {
    type: String,
    trim: true
  },
  
  // Booking details
  scheduledDateTime: {
    type: Date,
    required: [true, 'Scheduled date and time is required']
  },
  duration: {
    type: Number, // Duration in hours
    required: [true, 'Duration is required'],
    min: [0.5, 'Duration must be at least 0.5 hours']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  unitPrice: {
    type: String,
    trim: true
  },
  
  // Booking status
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ACCEPTED', 'VERIFIED', 'CANCELLED', 'MISSED', 'COMPLETED'],
    default: 'PENDING'
  },
  
  // OTP fields (only set when user reaches station)
  otp: {
    code: {
      type: String,
      trim: true
    },
    expiresAt: {
      type: Date
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    }
  },
  
  // Session tracking (only set after OTP verification)
  sessionStartedAt: {
    type: Date
  },
  sessionEndedAt: {
    type: Date
  },
  isSessionActive: {
    type: Boolean,
    default: false
  },
  
  // Transaction reference (created after OTP verification)
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ status: 1 });
bookingSchema.index({ chargerId: 1 });
bookingSchema.index({ scheduledDateTime: -1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'otp.code': 1 }); // For OTP lookup

// Method to check if OTP is valid (not expired, not used)
bookingSchema.methods.isOtpValid = function() {
  if (!this.otp || !this.otp.code) {
    return false;
  }
  
  if (this.otp.isUsed) {
    return false;
  }
  
  if (this.otp.expiresAt && new Date() > this.otp.expiresAt) {
    return false;
  }
  
  return true;
};

// Method to verify OTP
bookingSchema.methods.verifyOtp = function(otpCode) {
  if (!this.isOtpValid()) {
    return { valid: false, message: 'OTP is not valid, expired, or already used' };
  }
  
  if (this.otp.code !== otpCode) {
    return { valid: false, message: 'Invalid OTP code' };
  }
  
  // Mark OTP as used
  this.otp.isUsed = true;
  this.otp.verifiedAt = new Date();
  
  return { valid: true, message: 'OTP verified successfully' };
};

// Static method to generate unique booking ID
bookingSchema.statics.generateBookingId = async function() {
  let bookingId;
  let isUnique = false;
  
  while (!isUnique) {
    // Format: BK + timestamp + random 4 digits
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    bookingId = `BK${timestamp}${random}`;
    
    const existing = await this.findOne({ bookingId });
    if (!existing) {
      isUnique = true;
    }
  }
  
  return bookingId;
};

// Static method to get bookings by status
bookingSchema.statics.getByStatus = async function(status, page = 1, limit = 10) {
  const query = { status };
  const skip = (page - 1) * limit;
  
  const bookings = await this.find(query)
    .populate('chargerId', 'name location type power status')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
  
  const total = await this.countDocuments(query);
  
  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = mongoose.model('Booking', bookingSchema);

