"use client";

import { useRouter } from "next/navigation";
import "./booking-cancelled.css";

interface CancelledBooking {
  id: number;
  stations: string;
  vehicleNumber: string;
  connector: string;
  chargerType: string;
  time: string;
  amount: string;
}

const cancelledBookingsData: CancelledBooking[] = [
  {
    id: 1,
    stations: "Premium Mall Charging ",
    vehicleNumber: "DL12AB1234",
    connector: "Type2",
    chargerType: "Premium DC Fast-50kWh",
    time: "10:30 AM",
    amount: "₹320",
  },
  {
    id: 2,
    stations: "Residential Society",
    vehicleNumber: "MG34CD5678",
    connector: "Type2",
    chargerType: "Premium AC Fast-50kWh",
    time: "11:45 AM",
    amount: "₹410",
  },
  {
    id: 3,
    stations: "Highway Charging Point",
    vehicleNumber: "HR90EF9012",
    connector: "Type2",
    chargerType: "Premium DC Fast-50kWh",
    time: "01:15 PM",
    amount: "₹320",
  },
  {
    id: 4,
    stations: "Premium Mall Charging ",
    vehicleNumber: "HR56GH3456",
    connector: "Type2",
    chargerType: "Premium DC Fast-50kWh",
    time: "03:20 PM",
    amount: "₹320",
  },
  {
    id: 5,
    stations: "Highway Charging Point",
    vehicleNumber: "MH78IJ7890",
    connector: "Type2",
    chargerType: "Premium DC Fast-50kWh",
    time: "05:10 PM",
    amount: "₹320",
  },
  {
    id: 6,
    stations: "Premium Mall Charging ",
    vehicleNumber: "MH12KL1234",
    connector: "Type2",
    chargerType: "Premium DC Fast-50kWh",
    time: "07:30 PM",
    amount: "₹320",
  },
  {
    id: 7,
    stations: "Highway Charging Point",
    vehicleNumber: "MH34MN5678",
    connector: "Type2",
    chargerType: "Premium DC Fast-50kWh",
    time: "08:45 PM",
    amount: "₹320",
  },
];

export default function BookingCancelled() {
  const router = useRouter();

  const handleViewAll = () => {
    router.push("/dashboard/bookings/cancelled/all");
  };

  return (
    <>
      {/* Title and View All Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 className="booking-cancelled-title">Booking Cancelled</h2>
        <button className="booking-cancelled-view-all-btn" onClick={handleViewAll}>
          View All
        </button>
      </div>

      <div className="booking-cancelled-container">
        {/* Single Table with Header and Body */}
        <div className="booking-cancelled-wrapper">
          <div className="booking-cancelled-scroll">
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table className="booking-cancelled-table">
                <thead>
                  <tr className="booking-cancelled-header-row">
                    <th>Stations</th>
                    <th>Vehicle Number</th>
                    <th>Connector</th>
                    <th>Charger Type</th>
                    <th>Time</th>
                    <th>Amount</th>
                    <th>Cancelled</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelledBookingsData.map((booking, index) => (
                    <tr
                      key={booking.id}
                      style={{
                        borderBottom:
                          index < cancelledBookingsData.length - 1
                            ? "1px solid #E5E5EA"
                            : "none",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(160, 255, 137, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td>{booking.stations}</td>
                      <td>{booking.vehicleNumber}</td>
                      <td>{booking.connector}</td>
                      <td>{booking.chargerType}</td>
                      <td>{booking.time}</td>
                      <td>{booking.amount}</td>
                      <td>
                        <span className="booking-cancelled-status-badge">
                          <span
                            className="iconify booking-cancelled-icon"
                            data-icon="mdi:close"
                            data-inline="false"
                            aria-hidden="true"
                          ></span>
                          Cancelled
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