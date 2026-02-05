# ChargeFlow Dashboard

A modern, responsive EV charging management dashboard built with Next.js, TypeScript, and Tailwind CSS. This application provides comprehensive monitoring and management capabilities for EV charging stations, revenue tracking, and customer interactions.

## 🚀 Features

### Core Dashboard
- **Real-time Statistics**: Live revenue, active chargers, and session data
- **Interactive Charts**: Revenue trends, charger utilization, and performance metrics
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Auto-refresh**: Smart data fetching with rate limiting and error handling

### Management Modules
- **Charger Management**: Monitor and manage EV charging stations
- **Booking System**: Handle customer bookings and reservations
- **Revenue Tracking**: Comprehensive financial analytics and reporting
- **Wallet Management**: Customer wallet and payment processing
- **User Profiles**: Host and customer profile management
- **Reviews & Ratings**: Customer feedback and rating system

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Component Architecture**: Reusable, modular React components
- **API Integration**: RESTful backend with real-time data synchronization
- **Error Handling**: Comprehensive error states and user feedback
- **Performance**: Optimized loading states and data caching

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.1**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **React 19.2.3**: UI library
- **Lucide React**: Icon library
- **Iconify**: Extensive icon collection

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication (planned)

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd next-Dashboard
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   # In backend/.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chargeflow
   NODE_ENV=development
   ```

5. **Seed the database (optional):**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start both servers:**
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev:both
   
   # Or start individually:
   # Frontend (port 3000)
   npm run dev
   
   # Backend (port 5000) - in separate terminal
   cd backend && npm run dev
   ```

7. **Open your browser:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

### Frontend Structure (Next.js)

```
next-Dashboard/
├── app/                                    # Next.js App Router directory
│   ├── dashboard/                         # Main dashboard application pages
│   │   ├── bookings/                      # Booking management system
│   │   │   ├── page.tsx                   # Main bookings page
│   │   │   ├── verification/              # Booking verification workflow
│   │   │   │   └── page.tsx              # Booking verification page
│   │   │   └── responded/                 # Responded bookings
│   │   │       └── page.tsx              # Responded bookings page
│   │   ├── earnings/                      # Revenue and earnings analytics
│   │   │   └── page.tsx                   # Earnings dashboard page
│   │   ├── edit-profile/                  # Profile editing interface
│   │   │   └── page.tsx                   # Edit profile page
│   │   ├── my-chargers/                   # Charger management system
│   │   │   └── page.tsx                   # My chargers dashboard
│   │   ├── page.tsx                       # Main dashboard overview page
│   │   ├── personal-information/          # Personal information management
│   │   │   ├── page.tsx                   # Personal info page
│   │   │   └── personal-information.css   # Personal info styles
│   │   ├── profile/                       # User profile section
│   │   │   └── page.tsx                   # Profile overview page
│   │   ├── reviews/                       # Customer reviews and ratings
│   │   │   └── page.tsx                   # Reviews management page
│   │   └── wallet/                        # Wallet and payment management
│   │       └── page.tsx                   # Wallet dashboard page
│   ├── favicon.ico                        # Website favicon
│   ├── globals.css                        # Global CSS styles and Tailwind imports
│   ├── layout.tsx                         # Root layout component with providers
│   └── page.tsx                           # Home/landing page
├── components/                             # Reusable React components
│   ├── bookings/                          # Booking-related components
│   │   ├── BookingRequests.tsx             # Booking requests list component
│   │   ├── BookingRequests.module.css      # Booking requests styles
│   │   ├── BookingStatCard.tsx            # Booking statistics card
│   │   ├── BookingStats.tsx               # Booking statistics container
│   │   ├── booking-requests.css            # Booking requests styles
│   │   ├── booking-stats.css              # Booking statistics styles
│   │   ├── booking-verification.css       # Booking verification styles
│   │   ├── verification-status.css        # Verification status styles
│   │   └── verification.css               # General verification styles
│   ├── common/                            # Shared/common components
│   │   ├── DashboardHeader.tsx             # Dashboard header with user info
│   │   ├── Footer.tsx                     # Application footer
│   │   └── Navbar.tsx                     # Navigation bar component
│   ├── dashboard/                         # Dashboard-specific components
│   │   ├── activity/                      # Activity feed components
│   │   │   ├── ActivityFeed.tsx           # Activity feed display
│   │   │   ├── activity-feed.css          # Activity feed styles
│   │   │   └── recent-activity.css       # Recent activity styles
│   │   ├── chargers/                      # Charger management components
│   │   │   ├── ChargerGrid.tsx            # Charger grid display
│   │   │   ├── ChargerStats.tsx           # Charger statistics
│   │   │   ├── charger-grid.css           # Charger grid styles
│   │   │   └── charger-stats.css          # Charger statistics styles
│   │   ├── charts/                        # Chart and visualization components
│   │   │   ├── RevenueChart.tsx           # Revenue trend chart
│   │   │   ├── revenue-chart.css          # Revenue chart styles
│   │   │   └── utilization-chart.css      # Utilization chart styles
│   │   ├── reviews/                       # Review and rating components
│   │   │   ├── ReviewCard.tsx              # Individual review card
│   │   │   ├── ReviewList.tsx              # Review list container
│   │   │   ├── review-card.css             # Review card styles
│   │   │   └── review-list.css            # Review list styles
│   │   └── stats/                         # Statistics and metrics components
│   │       ├── RevenueStatCards.tsx        # Revenue statistics cards
│   │       ├── StatsCard.tsx               # Generic statistics card
│   │       ├── revenue-stats.css          # Revenue statistics styles
│   │       └── stats-card.css              # Stats card styles
│   └── profile/                           # User profile components
│       ├── PersonalInfo.tsx               # Personal information form
│       ├── ProfileHeader.tsx              # Profile header component
│       ├── ProfileStats.tsx               # Profile statistics
│       ├── personal-info.css              # Personal info styles
│       ├── profile-header.css             # Profile header styles
│       └── profile-stats.css              # Profile statistics styles
├── contexts/                              # React Context providers
│   └── UserContext.tsx                    # User authentication and data context
├── lib/                                   # Utility libraries and helpers
│   ├── api.js                             # API helper functions and endpoints
│   └── mockData.ts                        # Mock data for development and testing
├── public/                                # Static assets and public files
│   ├── next.svg                           # Next.js logo
│   └── vercel.svg                         # Vercel deployment logo
├── styles/                                # Global CSS files
│   ├── globals.css                        # Global styles (duplicate, app/globals.css is primary)
│   └── pages/                             # Page-specific styles
│       ├── add-money.css                  # Add money page styles (removed)
│       ├── bookings.css                   # Bookings page styles
│       ├── dashboard.css                  # Dashboard page styles
│       ├── edit-profile.css               # Edit profile page styles
│       ├── earnings.css                   # Earnings page styles
│       ├── my-chargers.css                # My chargers page styles
│       ├── profile.css                    # Profile page styles
│       ├── reviews.css                    # Reviews page styles
│       └── wallet.css                     # Wallet page styles
├── .env.local                             # Local environment variables (gitignored)
├── .gitignore                             # Git ignore file
├── .next/                                 # Next.js build output (gitignored)
├── eslint.config.mjs                      # ESLint configuration
├── next-env.d.ts                          # Next.js TypeScript definitions
├── next.config.ts                         # Next.js configuration
├── node_modules/                          # Node.js dependencies (gitignored)
├── package-lock.json                      # Dependency lock file
├── package.json                           # Project dependencies and scripts
├── postcss.config.mjs                     # PostCSS configuration
├── start-both.js                          # Script to run both frontend and backend
├── tsconfig.json                          # TypeScript configuration
└── README.md                              # Project documentation (this file)
```

### Backend Structure (Express.js)

```
backend/                                   # Backend API server
├── config/                                # Configuration files
│   └── database.js                        # MongoDB connection configuration
├── models/                                # Mongoose data models
│   ├── Charger.js                         # Charger model with methods
│   └── Transaction.js                    # Transaction model with methods
├── routes/                                # API route handlers
│   ├── chargers.js                         # Charger management API routes
│   └── money.js                           # Money transaction API routes
├── .env                                   # Environment variables (gitignored)
├── node_modules/                          # Node.js dependencies (gitignored)
├── package-lock.json                      # Dependency lock file
├── package.json                           # Backend dependencies and scripts
├── seed-chargers.js                       # Consolidated database seeder
├── server.js                              # Express server configuration
└── README.md                              # Backend API documentation
```

## 🎯 Key Components

### Dashboard Stats
- **RevenueStatCards**: Real-time revenue, active chargers, and total sessions
- **StatsCard**: Reusable statistics display component
- **ActivityFeed**: Recent activities and updates

### Booking Management
- **BookingRequests**: Handle incoming booking requests
- **BookingStats**: Booking analytics and metrics
- **Verification**: Booking verification and confirmation

### Charger Management
- **ChargerGrid**: Visual charger status display
- **ChargerStats**: Performance and utilization metrics

### User Interface
- **Navbar**: Navigation and user menu
- **DashboardHeader**: User info and status
- **Footer**: Application footer

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Backend (backend/.env)
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chargeflow
NODE_ENV=development
```

### API Integration

The frontend automatically connects to the backend API for:
- Real-time dashboard statistics
- Transaction data and revenue tracking
- Charger status and utilization
- Booking management
- User profile data

## 📊 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run dev:both     # Start both frontend and backend
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run test         # Run tests (when implemented)
```

## 🎨 Styling

The application uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Additional styles for specific components
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme support (planned)

### CSS Organization
- `app/globals.css`: Global styles and Tailwind imports
- `styles/pages/`: Page-specific styles
- Component-level styles: Inline or CSS modules

## 🔐 Security Features

- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Server-side validation
- **Error Handling**: Secure error responses
- **Helmet.js**: Security headers (backend)

## 📈 Performance

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js image optimization
- **Caching**: API response caching
- **Lazy Loading**: Component and route lazy loading
- **Bundle Analysis**: Optimized bundle sizes

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
npm run build
vercel --prod
```

### Backend (Heroku/Render)
```bash
# Build and deploy backend
cd backend
npm run build
# Deploy to your preferred platform
```

### Environment Setup for Production
1. Set production environment variables
2. Configure MongoDB connection
3. Set up CORS for production domain
4. Configure rate limiting for production traffic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication
Currently using mock authentication. JWT implementation planned.

### Key Endpoints
- `GET /api/money/total` - Total revenue
- `GET /api/chargers/statistics` - Charger statistics
- `GET /api/chargers/active` - Active charger count
- `GET /api/chargers/sessions` - Total sessions

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify database permissions

2. **CORS Issues**
   - Check API URL in frontend .env
   - Verify CORS configuration in backend

3. **Port Conflicts**
   - Change ports if 3000/5000 are occupied
   - Update environment variables accordingly

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for the EV charging community**
