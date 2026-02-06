require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Charger = require('../models/Charger');
const connectDB = require('../config/database');

const fixOrphans = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('Connected.');

        // 1. Ensure at least one charger exists
        let defaultCharger = await Charger.findOne({ status: 'ONLINE' });
        if (!defaultCharger) {
            console.log('No online charger found. Creating a default one...');
            defaultCharger = await Charger.create({
                name: 'Default Public Charger',
                location: 'Main Street',
                type: 'AC',
                power: 22,
                status: 'ONLINE',
                utilization: 0,
                totalSessions: 0
            });
            console.log('Created default charger:', defaultCharger.name);
        } else {
            console.log('Using existing charger:', defaultCharger.name);
        }

        // 2. Find all bookings
        const bookings = await Booking.find({});
        console.log(`Found ${bookings.length} bookings. Checking for orphans...`);

        let fixedCount = 0;
        for (const booking of bookings) {
            const charger = await Charger.findById(booking.chargerId);
            if (!charger) {
                console.log(`Booking ${booking.bookingId} has missing charger (${booking.chargerId}). Fixing...`);

                booking.chargerId = defaultCharger._id;
                booking.chargerName = defaultCharger.name;
                await booking.save();

                fixedCount++;
            }
        }

        console.log(`\nFixed ${fixedCount} orphaned bookings.`);
        console.log('Done!');
        process.exit(0);

    } catch (error) {
        console.error('Error fixing orphans:', error);
        process.exit(1);
    }
};

fixOrphans();
