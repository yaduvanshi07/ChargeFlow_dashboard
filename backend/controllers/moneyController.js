const Transaction = require('../models/Transaction');

// Add a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { amount, source, description } = req.body;

        // Validation
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid positive amount is required'
            });
        }

        if (!source || !['CHARGING', 'WALLET', 'OTHER'].includes(source)) {
            return res.status(400).json({
                success: false,
                message: 'Valid source is required (CHARGING, WALLET, or OTHER)'
            });
        }

        // Create transaction
        const transaction = new Transaction({
            amount,
            source,
            description: description || ''
        });

        await transaction.save();

        res.status(201).json({
            success: true,
            message: 'Transaction added successfully',
            data: transaction
        });
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get total of all transactions
exports.getTotal = async (req, res) => {
    try {
        const result = await Transaction.getTotalBySource();

        res.status(200).json({
            success: true,
            data: {
                total: result.total,
                count: result.count,
                formattedTotal: new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                }).format(result.total)
            }
        });
    } catch (error) {
        console.error('Error getting total:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get total filtered by source
exports.getTotalBySource = async (req, res) => {
    try {
        const { source } = req.params;

        // Validate source parameter
        if (!['CHARGING', 'WALLET', 'OTHER'].includes(source)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid source. Must be CHARGING, WALLET, or OTHER'
            });
        }

        const result = await Transaction.getTotalBySource(source);

        res.status(200).json({
            success: true,
            data: {
                source,
                total: result.total,
                count: result.count,
                formattedTotal: new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                }).format(result.total)
            }
        });
    } catch (error) {
        console.error('Error getting total by source:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get comprehensive statistics
exports.getStatistics = async (req, res) => {
    try {
        const stats = await Transaction.getStatistics();

        res.status(200).json({
            success: true,
            data: {
                ...stats,
                formattedGrandTotal: new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                }).format(stats.grandTotal)
            }
        });
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all transactions with pagination
exports.getAllTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const source = req.query.source;

        const query = {};
        if (source && ['CHARGING', 'WALLET', 'OTHER'].includes(source)) {
            query.source = source;
        }

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                transactions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
