// Mock data for the dashboard

export const userData = {
  name: "Abhinav Yadav",
  email: "abhinav@gmail.com",
  isOnline: true,
};

export const statsData = [
  {
    title: "Total Earnings",
    value: "₹45,680",
    change: {
      value: "18% Increase",
      isPositive: true,
    },
    icon: "fluent:arrow-growth-24-filled",
  },
  {
    title: "Active Chargers",
    value: "3",
    subtitle: "All Online",
    icon: "material-symbols:ev-charger-rounded",
  },
  {
    title: "Total Sessions",
    value: "127",
    change: {
      value: "12 This Week",
      isPositive: false,
    },
    icon: "bxs:calendar-check",
  },
  {
    title: "Host Rating",
    value: "4.7",
    rating: 4.7,
    icon: "material-symbols-light:star-outline-rounded",
  },
];

export const performanceMetrics = [
  {
    label: "Utilization Rate",
    value: "87%",
    icon: "Zap" as const,
  },
  {
    label: "Avg. Session Time",
    value: "2.3h",
    icon: "Clock" as const,
  },
  {
    label: "Avg. Per Session",
    value: "₹1,250",
    icon: "IndianRupee" as const,
  },
  {
    label: "Repeat Customers",
    value: "45",
    icon: "Users" as const,
  },
];

export const recentActivities = [
  {
    type: "booking" as const,
    title: "New Booking Received",
    details: "Premium DC Charger - 2 Hours",
    time: "30 Minutes Ago",
    amount: "₹450",
  },
  {
    type: "payment" as const,
    title: "Payment Received",
    details: "Weekly Payout Processed",
    time: "2 Hours Ago",
    amount: "₹8,240",
  },
  {
    type: "review" as const,
    title: "New Review",
    details: "5-Star Rating Received",
    time: "5 Hours Ago",
    rating: 5,
  },
];

export const todaysBookings = [
  {
    time: "10:00 AM",
    duration: "2 hours",
    chargerName: "Premium DC Charger",
    customerName: "Amit Sharma",
    vehicleName: "Tata Nexon EV",
    vehicleImage: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&h=150&fit=crop",
    vehicleType: "car" as const,
    status: "Confirmed" as const,
  },
  {
    time: "02:30 PM",
    duration: "1.5 hours",
    chargerName: "AC Charger #1",
    customerName: "Priya Singh",
    vehicleName: "Ola Electric S1 Pro",
    vehicleImage: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&h=150&fit=crop",
    vehicleType: "bike" as const,
    status: "Confirmed" as const,
  },
  {
    time: "04:00 PM",
    duration: "1.8 hours",
    chargerName: "Premium DC Charger",
    customerName: "Abhijit Sharma",
    vehicleName: "Mahindra XUV400 EV",
    vehicleImage: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&h=150&fit=crop",
    vehicleType: "car" as const,
    status: "Confirmed" as const,
  },
  {
    time: "03:30 PM",
    duration: "1 hours",
    chargerName: "AC Charger #2",
    customerName: "Rahul Verma",
    vehicleName: "Ather 450X",
    vehicleImage: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&h=150&fit=crop",
    vehicleType: "bike" as const,
    status: "Confirmed" as const,
  },
];

// Revenue data for the chart (weekly data in hours)
export const revenueData = [
  { day: "Mon", value: 3.5 },
  { day: "Tue", value: 4.5 },
  { day: "Wed", value: 4.2 },
  { day: "Thu", value: 5.7 },
  { day: "Fri", value: 6.1 },
  { day: "Sat", value: 7.5 },
  { day: "Sun", value: 8.5 },
];

// Charger data for My Charging Stations
export const chargerData = [
  {
    id: 1,
    name: "Premium DC Charger",
    location: "Sector 18, Noida",
    image: "/ch.jpg",
    chargingSpeed: "DC Fast - 50kW",
    connectorType: "Type 2",
    pricePerKWh: "₹18/KWh",
    utilization: 87,
    rating: 4.8,
    sessions: 45,
    isOnline: true,
  },
  {
    id: 2,
    name: "Premium AC Charger",
    location: "Sector 18, Noida",
    image: "/ev.avif",
    chargingSpeed: "AC Fast - 7.2KW",
    connectorType: "Type 2",
    pricePerKWh: "₹12/KWh",
    utilization: 92,
    rating: 4.6,
    sessions: 38,
    isOnline: true,
  },
  {
    id: 3,
    name: "Premium DC Charger",
    location: "Sector 18, Noida",
    image: "/evch.jpg",
    chargingSpeed: "DC Fast - 150KW",
    connectorType: "CCS2 + CHAdeMO",
    pricePerKWh: "₹22/KWh",
    utilization: 65,
    rating: 4.9,
    sessions: 44,
    isOnline: true,
  },
];

// Booking Management data
export const bookingManagementData = [
  {
    id: 1,
    customerName: "Amit Sharma",
    bookingId: "#BK001234",
    charger: "Premium DC Charger",
    dateTime: "Today, 10:00 AM",
    duration: "2 Hours",
    amount: "₹450",
    status: "Confirmed" as const,
  },
  {
    id: 2,
    customerName: "Priya Singh",
    bookingId: "#BK001233",
    charger: "Premium AC Charger",
    dateTime: "Today, 02:30 PM",
    duration: "1.5 Hours",
    amount: "₹320",
    status: "Upcoming" as const,
  },
  {
    id: 3,
    customerName: "Rohit Singh",
    bookingId: "#BK001238",
    charger: "Premium AC Charger",
    dateTime: "Today, 01:30 PM",
    duration: "1 Hours",
    amount: "₹350",
    status: "Upcoming" as const,
  },
  {
    id: 4,
    customerName: "Amit Sharma",
    bookingId: "#BK001234",
    charger: "Premium DC Charger",
    dateTime: "Today, 10:00 AM",
    duration: "2 Hours",
    amount: "₹450",
    status: "Confirmed" as const,
  },
  {
    id: 5,
    customerName: "Abhijit Sharma",
    bookingId: "#BK001242",
    charger: "Premium DC Charger",
    dateTime: "Today, 11:00 AM",
    duration: "2.5 Hours",
    amount: "₹550",
    status: "Confirmed" as const,
  },
];

