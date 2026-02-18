"use client";

import { useMemo } from "react";
import { bookingsAPI, useApiData } from "@/lib/api";

export default function BookingManagement() {
  // Use the custom hook to fetch data
  const { data: managementData, loading, error } = useApiData(bookingsAPI.getBookingManagement, [], 5000); // Poll every 5s

  // Memoize the data
  const displayData = useMemo(() => {
    if (!managementData) return [];
    return managementData;
  }, [managementData]);

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
              {loading && !displayData.length && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>}
              {error && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'red', padding: '20px' }}>Error: {error}</td></tr>}

              {displayData.map((booking: any, index: number) => (
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
                          booking.status === "CONFIRMED" || booking.status === "COMPLETED"
                            ? "#38EF0A"
                            : booking.status === "UPCOMING" ? "#FFD700" : "#E5E7EB",
                        color: booking.status === "CONFIRMED" || booking.status === "COMPLETED" ? "#FFF" : "#374151"
                      }}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}

              {!loading && !error && displayData.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No active bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}