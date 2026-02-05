const fs = require('fs');
const path = require('path');

// Create .env file with MongoDB connection
const envContent = `MONGODB_URI=mongodb://localhost:27017/chargeflow
PORT=5000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, envContent);
console.log('✅ .env file created successfully!');
console.log('📍 Path:', envPath);
console.log('📄 Content:');
console.log(envContent);
