# ChargeFlow Backend API

A comprehensive Node.js + Express + MongoDB backend for the ChargeFlow EV charging dashboard, providing APIs for revenue tracking, charger management, and real-time dashboard statistics.

## 🚀 Features

- **RESTful APIs** for transactions and charger management
- **MongoDB** with Mongoose ODM for data persistence
- **Real-time data** with intelligent auto-refresh capability
- **Production-ready** with security, rate limiting, and error handling
- **Comprehensive seeding** with realistic EV charging data
- **TypeScript support** in frontend integration

## 📊 API Endpoints

### Money Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/money/add` | Add a new transaction |
| GET | `/api/money/total` | Get total revenue (all sources) |
| GET | `/api/money/total/:source` | Get total by source (CHARGING/WALLET/OTHER) |
| GET | `/api/money/statistics` | Get comprehensive statistics |
| GET | `/api/money/transactions` | Get paginated transactions |

### Charger Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chargers` | Get all chargers with pagination |
| GET | `/api/chargers/statistics` | Get comprehensive charger statistics |
| GET | `/api/chargers/active` | Get count of active chargers |
| GET | `/api/chargers/sessions` | Get total sessions across all chargers |
| POST | `/api/chargers` | Add a new charger |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## 🛠️ Quick Start

### Prerequisites

- Node.js 16+
- MongoDB running locally or connection string

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file:**
   ```bash
   # Create .env file manually with:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chargeflow
   NODE_ENV=development
   ```

3. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```
   This will populate the database with:
   - 5 sample chargers (3 online, 1 offline, 1 maintenance)
   - 200+ sample transactions (charging and wallet transactions)
   - Realistic EV charging session data

4. **Start the server:**
   ```bash
   # Development with auto-reload
   npm run dev
   
   # Production
   npm start
   ```

## 📝 API Usage Examples

### Add a Transaction
```bash
curl -X POST http://localhost:5000/api/money/add \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "source": "CHARGING",
    "description": "EV charging session - Tesla Model 3"
  }'
```

### Get Total Revenue
```bash
curl http://localhost:5000/api/money/total
```

### Get Charger Statistics
```bash
curl http://localhost:5000/api/chargers/statistics
```

### Get Active Chargers Count
```bash
curl http://localhost:5000/api/chargers/active
```

### Add a New Charger
```bash
curl -X POST http://localhost:5000/api/chargers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium DC Charger #3",
    "location": "Sector 15, Noida",
    "type": "DC_FAST",
    "power": 150,
    "status": "ONLINE"
  }'
```

## 🗄️ Data Models

### Transaction Schema

```javascript
{
  amount: Number,           // Required, positive
  source: String,           // "CHARGING" | "WALLET" | "OTHER"
  description: String,      // Optional, max 500 chars
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

### Charger Schema

```javascript
{
  name: String,             // Required, charger name
  location: String,         // Required, charger location
  type: String,             // "AC" | "DC" | "AC_FAST" | "DC_FAST"
  power: Number,            // Required, power rating in kW
  status: String,           // "ONLINE" | "OFFLINE" | "MAINTENANCE"
  utilization: Number,      // 0-100, utilization percentage
  totalSessions: Number,     // Total charging sessions
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## 🔌 Frontend Integration

The Next.js frontend automatically connects to this backend and displays live data with:

- **Smart Auto-refresh**: 30-60 second intervals with exponential backoff
- **Rate Limit Handling**: Graceful degradation when API limits are reached
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages and retry mechanisms
- **INR Formatting**: Proper currency formatting for Indian market

### Dashboard Statistics Provided

1. **Total Revenue**: Sum of all transactions across all sources
2. **Active Chargers**: Count of chargers with ONLINE status
3. **Total Sessions**: Cumulative charging sessions across all chargers
4. **Charger Utilization**: Average utilization percentage
5. **Revenue by Source**: Breakdown by CHARGING, WALLET, and OTHER

### Shared Dashboard Metrics

The following pages share the same real-time backend data for consistency:
- **Dashboard** (Overview)
- **My Chargers**
- **Earnings**
- **Wallet**
- **Reviews**

All these pages utilize the consolidated `RevenueStatCards` component which fetches data from:
1. `/api/money/total` (Total Revenue)
2. `/api/chargers/active` (Active Chargers)
3. `/api/chargers/sessions` (Total Sessions)

## 🔒 Security Features

- **CORS** configured for Next.js frontend (localhost:3000)
- **Rate Limiting**: 1000 requests/15min (dev), 100 requests/15min (prod)
- **Helmet.js** for security headers
- **Input Validation** and sanitization
- **Error Handling** with proper HTTP status codes
- **Environment-based Configuration**

## 📁 Project Structure

```
backend/
├── config/             # Configuration files
│   ├── cors.js         # CORS configuration
│   └── database.js     # MongoDB connection setup
├── controllers/        # Business logic controllers
│   ├── bookingController.js # Booking logic (create, verify, cancel)
│   ├── chargerController.js # Charger logic (stats, create, list)
│   └── moneyController.js   # Transaction logic (revenue, history)
├── middleware/         # Express middleware
│   ├── errorHandler.js # Global error handling
│   └── rateLimiter.js  # API rate limiting
├── models/             # Mongoose Data Models
│   ├── Booking.js      # Booking schema
│   ├── Charger.js      # Charger schema
│   └── Transaction.js  # Transaction schema
├── routes/             # API Route Definitions
│   ├── bookings.js     # Booking endpoints
│   ├── chargers.js     # Charger endpoints
│   └── money.js        # Money endpoints
├── scripts/            # Utility & Maintenance Scripts
│   ├── fix-orphans.js  # Data repair script
│   ├── seed-chargers.js # Database seeder
│   └── ...             # Other dev scripts
├── utils/              # Helper utilities
│   └── otpUtils.js     # OTP generation helper
├── app.js              # Express app setup
├── server.js           # Server entry point
├── .env                # Environment variables
└── package.json
```

## 🌱 Database Seeding

The consolidated seeder (`seed-chargers.js`) provides:

### Charger Data
- **5 Sample Chargers**: Mix of AC/DC, fast/slow charging
- **Realistic Locations**: Sector 18, Sector 62 (Noida)
- **Status Distribution**: 3 Online, 1 Offline, 1 Maintenance
- **Utilization Data**: Realistic usage patterns
- **Session History**: Total sessions per charger

### Transaction Data
- **200+ Transactions**: Mix of charging and wallet transactions
- **Time Distribution**: Spread over several months
- **Source Variety**: CHARGING (70%), WALLET (30%)
- **Realistic Amounts**: ₹200-₹2200 range
- **EV Variety**: Different car models and charging types

### Running the Seeder

```bash
# All these commands do the same thing now:
npm run seed
npm run seed-chargers
npm run seed-all
```

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | - |
| NODE_ENV | Environment (development/production) | development |

## 🚀 Production Deployment

1. **Set production environment variables:**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=mongodb://your-production-db
   export PORT=5000
   ```

2. **Install production dependencies:**
   ```bash
   npm ci --only=production
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Configure reverse proxy (nginx/Apache)** for production domain

## 📈 Monitoring & Performance

The server includes:
- **Health Check Endpoint**: `/health` for uptime monitoring
- **Structured Logging**: Morgan middleware for request logging
- **Error Tracking**: Detailed error logs with stack traces
- **Rate Limit Headers**: Standard rate limit information
- **Performance Monitoring**: Response time tracking

### Rate Limiting Strategy

- **Development**: 1000 requests per 15 minutes
- **Production**: 100 requests per 15 minutes
- **Exponential Backoff**: Automatic retry with increasing delays
- **Graceful Degradation**: User-friendly error messages

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run test         # Run tests (when implemented)
```

### Development Workflow

1. Make changes to routes/models
2. Server auto-restarts with nodemon
3. Test endpoints with curl/Postman
4. Verify frontend integration
5. Update seed data if needed

## 🔧 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info (development only)"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For API issues:
1. Check the troubleshooting section
2. Verify MongoDB connection
3. Check environment variables
4. Review server logs
5. Create an issue with detailed information

---

**Built with ❤️ for the EV charging ecosystem**
