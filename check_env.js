const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

console.log('Environment check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.MONGODB_URI) {
    const uri = process.env.MONGODB_URI;
    const masked = uri.replace(/:[^:@]+@/, ':****@');
    console.log('MongoDB URI (masked):', masked);
}
