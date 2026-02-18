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
| GET | `/api/chargers/weekly-sessions` | Get weekly completed charging sessions (current week) |
| POST | `/api/chargers` | Add a new charger |
| PUT | `/api/chargers/:id` | Update an existing charger |

### Booking Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a new booking |
| PUT | `/api/bookings/:id/accept` | Accept a booking (creates management record) |
| POST | `/api/bookings/:id/pay` | Process payment and generate user password |
| POST | `/api/bookings/:id/auto-generate-otp` | Compatibility endpoint (deprecated; returns guidance message) |
| POST | `/api/bookings/:id/generate-otp` | Compatibility endpoint (deprecated; returns guidance message) |
| POST | `/api/bookings/verify-station` | Verify user password at station (admin only) |
| POST | `/api/bookings/:id/verify-otp` | Verify user password to start charging session (keeps `otp` request field name for compatibility) |
| POST | `/api/bookings/:id/complete` | Complete an active charging session |
| GET | `/api/bookings/management` | Get booking management data |
| GET | `/api/bookings` | Get all bookings with filters |
| GET | `/api/bookings/:id` | Get single booking details |
| PUT | `/api/bookings/:id/cancel` | Cancel a booking |

### Users & Passwords

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/by-email/:email` | Get a user by email |
| GET | `/api/user-passwords/:userId` | Get or create a user password record (internal use; password is never returned) |
| POST | `/api/user-passwords/verify` | Verify a user password |

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

### Create a Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "chargerId": "CHARGER_ID_HERE",
    "scheduledDateTime": "2024-01-15T10:00:00Z",
    "duration": 2,
    "amount": 500
  }'
```

### Accept a Booking
```bash
curl -X PUT http://localhost:5000/api/bookings/BOOKING_ID_HERE/accept
```

### Process Payment
```bash
curl -X POST http://localhost:5000/api/bookings/BOOKING_ID_HERE/pay
```

### Verify Station Access
```bash
curl -X POST http://localhost:5000/api/bookings/verify-station \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "password": "123456"
  }'
```

## 🗄️ Data Models

### Booking Schema

```javascript
{
  bookingId: String,         // Unique booking identifier (e.g., "BK12345678901234")
  customerName: String,      // Customer's full name
  customerEmail: String,     // Customer's email address
  customerPhone: String,    // Customer's phone number (optional)
  chargerId: ObjectId,       // Reference to Charger
  chargerName: String,       // Charger name (snapshot)
  vehicleModel: String,      // Vehicle model (optional)
  vehicleNumber: String,     // Vehicle number (optional)
  connectorType: String,     // Connector type (optional)
  scheduledDateTime: Date,   // Scheduled charging time
  duration: Number,          // Duration in hours
  amount: Number,            // Booking amount
  unitPrice: String,         // Unit price (optional)
  status: String,            // "PENDING" | "ACCEPTED" | "VERIFIED" | "CANCELLED" | "MISSED" | "COMPLETED"
  otp: {                     // OTP fields (for backward compatibility)
    code: String,
    expiresAt: Date,
    isUsed: Boolean,
    verifiedAt: Date
  },
  sessionStartedAt: Date,    // Session start time
  sessionEndedAt: Date,      // Session end time
  isSessionActive: Boolean,  // Session active status
  transactionId: ObjectId,  // Reference to Transaction
  createdAt: Date,           // Auto-generated
  updatedAt: Date,          // Auto-generated
  acceptedAt: Date,         // Booking acceptance time
  cancelledAt: Date         // Cancellation time
}
```

### BookingManagement Schema

```javascript
{
  bookingId: ObjectId,       // Reference to Booking (unique)
  userId: ObjectId,          // Reference to User (optional initially)
  stationName: String,       // Station name (snapshot)
  chargerName: String,       // Charger name (snapshot)
  amount: Number,            // Booking amount (snapshot)
  status: String,            // "UPCOMING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  paymentStatus: String,     // "PENDING" | "PAID"
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

### User Schema

```javascript
{
  email: String,             // User email (unique)
  name: String,              // User name
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

### UserPassword Schema

```javascript
{
  userId: ObjectId,          // Reference to User (unique, indexed)
  hashedPassword: String,    // Bcrypt hash of user password
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

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

## 📌 Booking Lifecycle Flow

The ChargeFlow booking system follows a structured lifecycle:

### 1. Booking Request
- **Endpoint**: `POST /api/bookings`
- **Status**: `PENDING`
- **Description**: Customer creates a booking request

### 2. Booking Acceptance
- **Endpoint**: `PUT /api/bookings/:id/accept`
- **Status**: `ACCEPTED`
- **Management Record**: Created with `UPCOMING` status and `PENDING` payment
- **Description**: Host/admin accepts the booking request

### 3. Payment Processing
- **Endpoint**: `POST /api/bookings/:id/pay`
- **Management Status**: `CONFIRMED`
- **Payment Status**: `PAID`
- **Password**: Generated/retrieved for user (derived from the last 6 characters of the user's MongoDB `_id`, i.e. hexadecimal)
- **Description**: User completes payment, receives unique password

### 4. Station Verification
- **Endpoint**: `POST /api/bookings/verify-station` (admin) or `POST /api/bookings/:id/verify-otp` (user)
- **Booking Status**: `VERIFIED`
- **Management Status**: Remains `CONFIRMED` while the session is active (updated on completion)
- **Description**: Password verified, charging session starts and revenue is recorded

### 5. Session Completion
- **Endpoint**: `POST /api/bookings/:id/complete`
- **Booking Status**: `COMPLETED`
- **Management Status**: `COMPLETED`
- **Description**: Charging session ends

## 🔐 Password System

### One Password Per User
- Each user has **one unique password** system-wide, derived from their User ID.
- **Format**: The password is the **last 6 characters** of the user's MongoDB `_id` (e.g., if ID ends in `...439011`, password is `439011`).
- **Hashed Storage**: Password is **hashed using bcrypt** for security before storage.
- **Auto-Migration**: Legacy random passwords are automatically updated to match this new policy upon next access.

### Password Generation API
```javascript
// Deterministic generation (last 6 chars of userId)
const password = UserPassword.generatePassword(userId); 

// Hashed storage
const hashedPassword = await UserPassword.hashPassword(password);
```

### Security & Logging Behaviour
- **Hashed Storage Only**: Passwords are stored **only** as bcrypt hashes in MongoDB (no plain text field).
- **Bcrypt Encryption**: Industry-standard password hashing with salt.
- **Unique & Deterministic**: One password per user, always predictable from their ID (last 6 characters).
- **Migration Script**: Run `node scripts/migrate_passwords.js` to update all existing users to the new password policy immediately.
- **Terminal Logging**:
  - The system logs when a password is generated or verified.
  - Plain passwords are logged in development for testing purposes but are never stored in plain text.
- **API Responses**: Passwords are **never** included in any API response.

## 📊 Dashboard Integration

### Frontend Pages Using Booking Data

1. **Booking Requests Page**
   - Shows `PENDING` bookings
   - Accept/Reject functionality
   - Real-time updates

2. **Booking Management Table**
   - Shows accepted but unpaid bookings
   - Tracks lifecycle: `UPCOMING` → `CONFIRMED` → `COMPLETED`
   - Payment status tracking

3. **Upcoming Bookings Table**
   - Shows confirmed and paid bookings
   - Ready for station verification
   - Session management

### API Response Format

All booking endpoints return consistent responses:

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info (development only)"
}
```

## 📌 Frontend Integration

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

- **CORS** configured for Next.js frontend:
  - Development: `http://localhost:3000`, `http://127.0.0.1:3000`
  - Production: `https://charge-flow-dashboard.vercel.app`
  - Configurable via `FRONTEND_URL` environment variable
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
│   ├── userController.js     # User lookup helpers
│   └── userPasswordController.js # User password endpoints (get/create + verify)
├── middleware/         # Express middleware
│   ├── errorHandler.js # Global error handling
│   └── rateLimiter.js  # API rate limiting
├── models/             # Mongoose Data Models
│   ├── Booking.js      # Booking schema
│   ├── BookingManagement.js # Booking management lifecycle
│   ├── Charger.js      # Charger schema
│   ├── Transaction.js  # Transaction schema
│   ├── User.js         # User schema
│   └── UserPassword.js # User password management
├── routes/             # API Route Definitions
│   ├── bookings.js     # Booking endpoints
│   ├── chargers.js     # Charger endpoints
│   └── money.js        # Money endpoints
│   ├── users.js        # User endpoints
│   └── userPasswords.js # User password endpoints
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

## 🧰 Operational Scripts (Run Manually)

These scripts are **not** used by `npm start` / `npm run dev`. They are meant for local debugging, maintenance, and data operations.

### `backend/scripts/*`

- `node scripts/seed-chargers.js`: Seed chargers + transactions (used by `npm run seed`, `seed-chargers`, `seed-all`)
- `node scripts/seed-bookings.js`: Seed sample bookings
- `node scripts/reset-bookings.js`: Reset bookings back to a known test state
- `node scripts/fix-orphans.js`: Repair bookings referencing missing chargers
- `node scripts/migrate_passwords.js`: Migrate/normalize passwords to the current userId-suffix policy
- `node scripts/check-bookings.js`: Print bookings from DB (for manual inspection)
- `node scripts/create-fresh-booking.js`: Create a single fresh `PENDING` booking
- `node scripts/create-accepted-booking.js`: Create a single `ACCEPTED` booking (test helper)
- `node scripts/create-test-bookings.js`: Create multiple test bookings (test helper)
- `node scripts/setup-env.js`: Writes a local `.env` file (use with caution; intended for local setup only)

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
| FRONTEND_URL | Frontend URL for CORS | - |

## 🚀 Production Deployment

### Render Deployment (Recommended)

1. **Connect Repository:**
   - Push code to GitHub/GitLab
   - Connect repository to Render

2. **Set Environment Variables in Render:**
   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   PORT=5000
   FRONTEND_URL=https://charge-flow-dashboard.vercel.app
   ```

3. **Configure Service:**
   - Build Command: `npm ci`
   - Start Command: `npm start`
   - Health Check Path: `/health`

### Vercel Frontend Integration

**Required Environment Variable in Vercel:**
```bash
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
```

### Manual Production Setup

1. **Set production environment variables:**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=mongodb://your-production-db
   export PORT=5000
   export FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Install production dependencies:**
   ```bash
   npm ci --only=production
   ```

3. **Start server:**
   ```bash
   npm start
   ```

4. **Configure reverse proxy (nginx/Apache)** for production domain

## 📈 Monitoring & Performance

The server includes:
- **Health Check Endpoint**: `/health` for uptime monitoring
- **Request logging dependency**: `morgan` is included (currently disabled in `app.js` to reduce terminal noise)
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
