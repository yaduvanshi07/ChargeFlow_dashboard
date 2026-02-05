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
    <div className="booking-management-container">
      <div className="booking-management-wrapper">
        <div className="booking-table-scroll-container">
          <table className="booking-management-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Booking ID</th>
                <th>Charger</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((booking, index) => (
                <tr key={`${booking.id}-${index}`}>
                  <td>{booking.customerName}</td>
                  <td>{booking.bookingId}</td>
                  <td>{booking.charger}</td>
                  <td>{booking.dateTime}</td>
                  <td>{booking.duration}</td>
                  <td>{booking.amount}</td>
                  <td>
                    <span
                      className="booking-management-status-badge"
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
  );
}