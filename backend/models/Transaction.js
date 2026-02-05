const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: ['CHARGING', 'WALLET', 'OTHER'],
    default: 'OTHER'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
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
transactionSchema.index({ source: 1, createdAt: -1 });
transactionSchema.index({ createdAt: -1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(this.amount);
});

// Static method to get total by source
transactionSchema.statics.getTotalBySource = async function(source = null) {
  const pipeline = [];
  
  if (source) {
    pipeline.push({
      $match: { source: source }
    });
  }
  
  pipeline.push({
    $group: {
      _id: null,
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }
  });
  
  const result = await this.aggregate(pipeline);
  return result.length > 0 ? result[0] : { total: 0, count: 0 };
};

// Static method to get transaction statistics
transactionSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$source',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        average: { $avg: '$amount' }
      }
    },
    {
      $group: {
        _id: null,
        sources: {
          $push: {
            source: '$_id',
            total: '$total',
            count: '$count',
            average: '$average'
          }
        },
        grandTotal: { $sum: '$total' },
        grandCount: { $sum: '$count' }
      }
    }
  ]);
  
  return stats.length > 0 ? stats[0] : { sources: [], grandTotal: 0, grandCount: 0 };
};

module.exports = mongoose.model('Transaction', transactionSchema);
