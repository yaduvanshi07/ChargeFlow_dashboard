"use client";

import { useMemo } from "react";
import { bookingManagementData } from "@/lib/mockData";

export default function BookingManagement() {
  // Memoize the tripled data to prevent recalculation on every render
  const displayData = useMemo(() => 
    [...bookingManagementData, ...bookingManagementData, ...bookingManagementData],
    []
  );
  
  return (
    <>
    
      
<div className="booking-management mt-30 ml-5">
        {/* Table Header - Fixed */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table className="booking-table">
            <thead>
              <tr className="booking-table-header-row">
                <th>Customer Name</th>
                <th>Booking ID</th>
                <th>Charger</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
          </table>
        </div>
        
        {/* Table Body - Scrollable */}
        <div className="booking-table-wrapper">
          <div className="booking-table-scroll">
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table className="booking-table">
                <tbody>
                  {displayData.map((booking, index) => (
                    <tr
                      key={`${booking.id}-${index}`}
                      style={{
                        borderBottom:
                          index < (displayData.length - 1)
                            ? "1px solid #E5E5EA"
                            : "none",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(160, 255, 137, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td>{booking.customerName}</td>
                      <td>{booking.bookingId}</td>
                      <td>{booking.charger}</td>
                      <td>{booking.dateTime}</td>
                      <td>{booking.duration}</td>
                      <td>{booking.amount}</td>
                      <td>
                        <span
                          className="booking-status-badge"
                          style={{
                            backgroundColor:
                              booking.status === "Confirmed"
                                ? "#38EF0A"
                                : "#FFD700",
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

