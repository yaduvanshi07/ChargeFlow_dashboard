"use client";

import { useState } from "react";
import { Search, Filter, ArrowLeft } from "lucide-react";
import "./all-details.css";

interface BookingDetail {
  userName: string;
  vehicleModel: string;
  chargerType: string;
  bookingId: string;
  location: string;
  date: string;
  amount: string;
  duration: string;
}

export default function AllBookingRespondedDetails() {
  const [selectedFilter, setSelectedFilter] = useState<string>("Last 7 Days");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const bookingDetails: BookingDetail[] = [
    {
      userName: "Piya Singh",
      vehicleModel: "MG ZS EV",
      chargerType: "CCS2",
      bookingId: "#BK001233",
      location: "Sector 18, Noida",
      date: "April 12, 2025",
      amount: "₹350",
      duration: "1.5 Hours",
    },
    {
      userName: "Rohit Singh",
      vehicleModel: "Hyundai Kona EV",
      chargerType: "Type2",
      bookingId: "#BK001238",
      location: "Gurugram Sector 45",
      date: "April 12, 2025",
      amount: "₹450",
      duration: "1 Hours",
    },
    {
      userName: "Amit Sharma",
      vehicleModel: "Tata Nexon EV",
      chargerType: "Type 2",
      bookingId: "#BK001234",
      location: "Connaught Place, New Delhi",
      date: "April 12, 2025",
      amount: "₹320",
      duration: "2 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2O Puls Ev",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
  ];

  const filters = ["Last 7 Days", "Last 30 Days", "1 Month", "1 Year"];

  const filteredBookings = bookingDetails.filter((booking) =>
    booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="all-booking-details-container">
      {/* Header */}
      <div className="all-booking-details-header">
        <button className="all-booking-details-back-btn" onClick={() => window.history.back()}>
          <ArrowLeft style={{ width: "20px", height: "20px" }} />
        </button>
        <h1 className="all-booking-details-title">All Booking Responded Details</h1>
      </div>

      {/* Filters */}
      <div className="all-booking-details-filters">
        <div className="all-booking-details-filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`all-booking-details-filter-btn ${
                selectedFilter === filter ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <button className="all-booking-details-filter-icon-btn">
          <Filter style={{ width: "18px", height: "18px" }} />
          Filter
        </button>
      </div>

      {/* Search Bar */}
      <div className="all-booking-details-search">
        <Search style={{ width: "20px", height: "20px", color: "#8E8E93" }} />
        <input
          type="text"
          placeholder="Search Booking ID......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="all-booking-details-search-input"
        />
      </div>

      {/* Table */}
      <div className="all-booking-details-table-wrapper">
        <table className="all-booking-details-table">
          <thead>
            <tr className="all-booking-details-table-header">
              <th>User Name</th>
              <th>Vehicle Model</th>
              <th>Charger Type</th>
              <th>Booking ID</th>
              <th>Locations</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index} className="all-booking-details-table-row">
                <td>{booking.userName}</td>
                <td>{booking.vehicleModel}</td>
                <td>{booking.chargerType}</td>
                <td>{booking.bookingId}</td>
                <td>{booking.location}</td>
                <td>{booking.date}</td>
                <td>{booking.amount}</td>
                <td>{booking.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}