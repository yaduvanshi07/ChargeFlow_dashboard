const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://charge-flow-dashboard.vercel.app', // Production Vercel frontend
        process.env.FRONTEND_URL // Allow additional frontend URL
    ].filter(Boolean), // Filter out undefined if env var is missing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;
