const mongoose = require('mongoose');

const bookingManagementSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    /**
     * Charger and host linkage
     * Note: hostId is reserved for future use when host ownership is modelled.
     */
    chargerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Charger'
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    /**
     * Snapshot of details at time of acceptance/management creation
     * These are used purely for reporting / UI and are intentionally denormalised.
     */
    stationName: {
        type: String,
        required: true
    },
    chargerName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    /**
     * Scheduled time of the booking (slot)
     * Captured here so lifecycle tracking does not depend on the live Booking document.
     */
    scheduledTime: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['UPCOMING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
        default: 'UPCOMING'
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID'],
        default: 'PENDING'
    },
    /**
     * Reference to the user-bound password record.
     * This is nullable to support legacy data and flows before payment.
     */
    passwordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPassword'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for querying lifecycle state and user-specific views
bookingManagementSchema.index({ status: 1 });
bookingManagementSchema.index({ userId: 1 });
bookingManagementSchema.index({ chargerId: 1 });

module.exports = mongoose.model('BookingManagement', bookingManagementSchema);
