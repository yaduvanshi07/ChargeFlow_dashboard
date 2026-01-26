"use client";

import { useRouter } from "next/navigation";
import "./booking-missed.css";

interface MissedBooking {
  id: number;
  stations: string;
  vehicleModel: string;
  vehicleNumber: string;
  connector: string;
  chargerType: string;
  time: string;
  amount: string;
}

const missedBookingsData: MissedBooking[] = [
  {
    id: 1,
    stations: "Premium Mall Charging Hub",
    vehicleModel: "Tata Nexon EV",
    vehicleNumber: "DLxxxxxx34",
    connector: "Type 2",
    chargerType: "Premium DC Fast",
    time: "10:00 AM",
    amount: "₹320",
  },
  {
    id: 2,
    stations: "Residential Society Charger",
    vehicleModel: "MG ZS EV",
    vehicleNumber: "DLxxxxxx44",
    connector: "CC82",
    chargerType: "Premium DC Fast",
    time: "11:00 AM",
    amount: "₹350",
  },
  {
    id: 3,
    stations: "Workplace Charging",
    vehicleModel: "Hyundai Kona EV",
    vehicleNumber: "DLxxxxxx43",
    connector: "Type2",
    chargerType: "Premium AC Fast",
    time: "12:00 AM",
    amount: "₹450",
  },
  {
    id: 5,
    stations: "Highway Charging Point",
    vehicleModel: "Mahindra E2o Plus Ev",
    vehicleNumber: "DLxxxxxx54",
    connector: "CC82",
    chargerType: "Premium AC Fast",
    time: "01:00 AM",
    amount: "₹550",
  },
  {
    id: 6,
    stations: "Highway Charging Point",
    vehicleModel: "Mahindra E2o Plus Ev",
    vehicleNumber: "DLxxxxxx54",
    connector: "Type2",
    chargerType: "Premium AC Fast",
    time: "01:00 AM",
    amount: "₹550",
  },
  {
    id: 7,
    stations: "Highway Charging Point",
    vehicleModel: "Mahindra E2o Plus Ev",
    vehicleNumber: "DLxxxxxx54",
    connector: "CC82",
    chargerType: "Premium AC Fast",
    time: "01:00 AM",
    amount: "₹550",
  },
  {
    id: 8,
    stations: "Highway Charging Point",
    vehicleModel: "Mahindra E2o Plus Ev",
    vehicleNumber: "DLxxxxxx54",
    connector: "Type2",
    chargerType: "Premium AC Fast",
    time: "01:00 AM",
    amount: "₹550",
  },
];

export default function BookingMissed() {
  const router = useRouter();

  const handleViewAll = () => {
    router.push("/dashboard/bookings/missed/all");
  };

  return (
    <>
      {/* Title and View All Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 className="booking-missed-title">Booking Missed</h2>
        <button className="booking-missed-view-all-btn" onClick={handleViewAll}>
          View All
        </button>
      </div>

      <div className="booking-missed-container">
        {/* Single Table with Header and Body */}
        <div className="booking-missed-wrapper">
          <div className="booking-missed-scroll">
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table className="booking-missed-table">
                <thead>
                  <tr className="booking-missed-header-row">
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
                  {missedBookingsData.map((booking, index) => (
                    <tr
                      key={booking.id}
                      style={{
                        borderBottom:
                          index < missedBookingsData.length - 1
                            ? "1px solid #E5E5EA"
                            : "none",
                      }}
                    >
                      <td>{booking.stations}</td>
                      <td>{booking.vehicleModel}</td>
                      <td>{booking.vehicleNumber}</td>
                      <td>{booking.connector}</td>
                      <td>{booking.chargerType}</td>
                      <td>{booking.time}</td>
                      <td>{booking.amount}</td>
                      <td>
                        <span className="booking-missed-status-badge">
                          Missed
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