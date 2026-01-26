"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Filter, Search } from "lucide-react";
import "./all-cancelled-details.css";

interface CancelledBookingDetail {
  stations: string;
  vehicleModel: string;
  vehicleNumber: string;
  connector: string;
  chargerType: string;
  time: string;
  amount: string;
}

const CANCELLED_DETAILS: CancelledBookingDetail[] = [
  {
    stations: "Premium Mall Charging Hub",
    vehicleModel: "Tata Nexon EV",
    vehicleNumber: "DLxxxxxx34",
    connector: "Type 2",
    chargerType: "Premium DC Fast",
    time: "10:00 AM",
    amount: "₹320",
  },
  {
    stations: "Residential Society Charger",
    vehicleModel: "MG ZS EV",
    vehicleNumber: "DLxxxxxx44",
    connector: "CCS2",
    chargerType: "Premium DC Fast",
    time: "11:00 AM",
    amount: "₹350",
  },
  {
    stations: "Workplace Charging",
    vehicleModel: "Hyundai Kona EV",
    vehicleNumber: "DLxxxxxx43",
    connector: "Type2",
    chargerType: "Premium AC Fast",
    time: "12:00 AM",
    amount: "₹450",
  },
  {
    stations: "Highway Charging Point",
    vehicleModel: "Mahindra E2o Puls Ev",
    vehicleNumber: "DLxxxxxx54",
    connector: "CCS2",
    chargerType: "Premium AC Fast",
    time: "01:00 AM",
    amount: "₹550",
  },
  // repeat a bit to mimic the long list in the design
  ...Array.from({ length: 14 }).map(() => ({
    stations: "Highway Charging Point",
    vehicleModel: "Mahindra E2o Puls Ev",
    vehicleNumber: "DLxxxxxx24",
    connector: "Type2",
    chargerType: "Premium AC Fast",
    time: "01:00 AM",
    amount: "₹550",
  })),
];

export default function AllBookingCancelledDetails() {
  const [selectedFilter, setSelectedFilter] = useState<string>("Last 7 Days");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filters = ["Last 7 Days", "Last 30 Days", "1 Month", "1 Year"];

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CANCELLED_DETAILS;

    return CANCELLED_DETAILS.filter((row) =>
      row.vehicleNumber.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="all-cancelled-details-container">
      {/* Header */}
      <div className="all-cancelled-details-header">
        <button
          className="all-cancelled-details-back-btn"
          onClick={() => window.history.back()}
        >
          <ArrowLeft style={{ width: "20px", height: "20px" }} />
        </button>
        <h1 className="all-cancelled-details-title">
          All Booking Cancelled Details
        </h1>
      </div>

      {/* Filters */}
      <div className="all-cancelled-details-filters">
        <div className="all-cancelled-details-filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`all-cancelled-details-filter-btn ${
                selectedFilter === filter ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <button className="all-cancelled-details-filter-icon-btn">
          <Filter style={{ width: "18px", height: "18px" }} />
          Filter
        </button>
      </div>

      {/* Search */}
      <div className="all-cancelled-details-search">
        <Search style={{ width: "20px", height: "20px", color: "#8E8E93" }} />
        <input
          type="text"
          placeholder="Search Booking ID......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="all-cancelled-details-search-input"
        />
      </div>

      {/* Table */}
      <div className="all-cancelled-details-table-wrapper">
        <table className="all-cancelled-details-table">
          <thead>
            <tr className="all-cancelled-details-table-header">
              <th>Stations</th>
              <th>Vehicle Model</th>
              <th>Vehicle Number</th>
              <th>Connector</th>
              <th>Charger Type</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Cancelled</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr key={index} className="all-cancelled-details-table-row">
                <td>{row.stations}</td>
                <td>{row.vehicleModel}</td>
                <td>{row.vehicleNumber}</td>
                <td>{row.connector}</td>
                <td>{row.chargerType}</td>
                <td>{row.time}</td>
                <td>{row.amount}</td>
                <td>
                  <span className="all-cancelled-details-status-badge">
                    <span
                      className="iconify all-cancelled-details-icon"
                      data-icon="mdi:close"
                      data-inline="false"
                      aria-hidden="true"
                    />
                    Cancelled
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


