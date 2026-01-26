"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Filter, Search } from "lucide-react";
import "./all-missed-details.css";

interface MissedBookingDetail {
  stations: string;
  vehicleModel: string;
  vehicleNumber: string;
  connector: string;
  chargerType: string;
  time: string;
  amount: string;
}

const MISSED_DETAILS: MissedBookingDetail[] = [
  {
    stations: "Premium Mall Charging Hub",
    vehicleModel: "Tata Nexon EV",
    vehicleNumber: "DLxxxx34",
    connector: "Type 2",
    chargerType: "Premium DC Fast",
    time: "10:00 AM",
    amount: "₹320",
  },
  {
    stations: "Residential Society Charger",
    vehicleModel: "MG ZS EV",
    vehicleNumber: "DLxxxx44",
    connector: "CCS2",
    chargerType: "Premium DC Fast",
    time: "11:00 AM",
    amount: "₹350",
  },
  {
    stations: "Workplace Charging",
    vehicleModel: "Hyundai Kona EV",
    vehicleNumber: "DLxxxx43",
    connector: "Type2",
    chargerType: "Premium AC Fast",
    time: "12:00 AM",
    amount: "₹450",
  },
  {
    stations: "Highway Charging Point",
    vehicleModel: "Mahindra E2O Puls Ev",
    vehicleNumber: "DLxxxx54",
    connector: "CCS2",
    chargerType: "Premium AC Fast",
    time: "01:00 AM",
    amount: "₹550",
  },
  // Repeat to mimic the long list in the design
  ...Array.from({ length: 15 }).map(() => ({
    stations: "Highway Charging Point",
    vehicleModel: "Mahindra E2O Puls Ev",
    vehicleNumber: "DLxxxx54",
    connector: "Type2",
    chargerType: "Premium AC Fast",
    time: "01:00 AM",
    amount: "₹550",
  })),
];

export default function AllBookingMissedDetails() {
  const [selectedFilter, setSelectedFilter] = useState<string>("Last 7 Days");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filters = ["Last 7 Days", "Last 30 Days", "1 Month", "1 Year"];

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MISSED_DETAILS;

    return MISSED_DETAILS.filter((row) =>
      row.vehicleNumber.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="all-missed-details-container">
      {/* Header */}
      <div className="all-missed-details-header">
        <button
          className="all-missed-details-back-btn"
          onClick={() => window.history.back()}
        >
          <ArrowLeft style={{ width: "20px", height: "20px" }} />
        </button>
        <h1 className="all-missed-details-title">
          All Booking Missed Details
        </h1>
      </div>

      {/* Filters */}
      <div className="all-missed-details-filters">
        <div className="all-missed-details-filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`all-missed-details-filter-btn ${
                selectedFilter === filter ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <button className="all-missed-details-filter-icon-btn">
          <Filter style={{ width: "18px", height: "18px" }} />
          Filter
        </button>
      </div>

      {/* Search Bar */}
      <div className="all-missed-details-search">
        <Search style={{ width: "20px", height: "20px", color: "#8E8E93" }} />
        <input
          type="text"
          placeholder="Search Booking ID......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="all-missed-details-search-input"
        />
      </div>

      {/* Table */}
      <div className="all-missed-details-table-wrapper">
        <table className="all-missed-details-table">
          <thead>
            <tr className="all-missed-details-table-header">
              <th>Stations</th>
              <th>Vehicle Model</th>
              <th>Vehicle Number</th>
              <th>Connector</th>
              <th>Charger Type</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Missed</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((booking, index) => (
              <tr key={index} className="all-missed-details-table-row">
                <td>{booking.stations}</td>
                <td>{booking.vehicleModel}</td>
                <td>{booking.vehicleNumber}</td>
                <td>{booking.connector}</td>
                <td>{booking.chargerType}</td>
                <td>{booking.time}</td>
                <td>{booking.amount}</td>
                <td>
                  <span className="all-missed-details-status-badge">
                    X Missed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

