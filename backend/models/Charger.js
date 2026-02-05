const mongoose = require('mongoose');

const chargerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Charger name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Charger type is required'],
    enum: ['AC', 'DC', 'AC_FAST', 'DC_FAST'],
    default: 'AC'
  },
  power: {
    type: Number,
    required: [true, 'Power rating is required'],
    min: [1, 'Power must be at least 1kW']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE'],
    default: 'OFFLINE'
  },
  utilization: {
    type: Number,
    min: [0, 'Utilization cannot be negative'],
    max: [100, 'Utilization cannot exceed 100'],
    default: 0
  },
  totalSessions: {
    type: Number,
    min: [0, 'Total sessions cannot be negative'],
    default: 0
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
chargerSchema.index({ status: 1 });
chargerSchema.index({ createdAt: -1 });

// Static method to get charger statistics
chargerSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalChargers: { $sum: 1 },
        activeChargers: {
          $sum: {
            $cond: [{ $eq: ['$status', 'ONLINE'] }, 1, 0]
          }
        },
        offlineChargers: {
          $sum: {
            $cond: [{ $eq: ['$status', 'OFFLINE'] }, 1, 0]
          }
        },
        maintenanceChargers: {
          $sum: {
            $cond: [{ $eq: ['$status', 'MAINTENANCE'] }, 1, 0]
          }
        },
        totalSessions: { $sum: '$totalSessions' },
        averageUtilization: { $avg: '$utilization' }
      }
    }
  ]);
  
  return stats.length > 0 ? stats[0] : {
    totalChargers: 0,
    activeChargers: 0,
    offlineChargers: 0,
    maintenanceChargers: 0,
    totalSessions: 0,
    averageUtilization: 0
  };
};

// Static method to get active chargers count
chargerSchema.statics.getActiveChargersCount = async function() {
  const result = await this.aggregate([
    {
      $match: { status: 'ONLINE' }
    },
    {
      $count: 'activeChargers'
    }
  ]);
  
  return result.length > 0 ? result[0].activeChargers : 0;
};

// Static method to get total sessions
chargerSchema.statics.getTotalSessions = async function() {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        totalSessions: { $sum: '$totalSessions' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].totalSessions : 0;
};

module.exports = mongoose.model('Charger', chargerSchema);
