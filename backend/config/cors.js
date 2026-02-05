const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Next.js default ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;
