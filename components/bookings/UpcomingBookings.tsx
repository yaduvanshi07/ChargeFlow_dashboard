"use client";

import { useRouter } from "next/navigation";
import "./bookings.css";

interface UpcomingBooking {
  id: number;
  station: string;
  vehicleModel: string;
  vehicleNumber: string;
  connector: string;
  chargerType: string;
  time: string;
  amount: string;
}

export default function UpcomingBookings() {
  const router = useRouter();

  const upcomingBookings: UpcomingBooking[] = [
    {
      id: 1,
      station: "Premium Mall Charging Hub",
      vehicleModel: "Tata Nexon EV",
      vehicleNumber: "DLxxxxxx34",
      connector: "Type 2",
      chargerType: "Premium DC Fast",
      time: "10:00 AM",
      amount: "₹320",
    },
    {
      id: 2,
      station: "Residential Society Charger",
      vehicleModel: "MG ZS EV",
      vehicleNumber: "DLxxxxxxx44",
      connector: "CCS2",
      chargerType: "Premium DC Fast",
      time: "11:00 AM",
      amount: "₹350",
    },
    {
      id: 3,
      station: "Workplace Charging",
      vehicleModel: "Hyundai Kona EV",
      vehicleNumber: "DLxxxxxx43",
      connector: "Type2",
      chargerType: "Premium AC Fast",
      time: "12:00 AM",
      amount: "₹450",
    },
    {
      id: 4,
      station: "Highway Charging Point",
      vehicleModel: "Mahindra E20 Puls Ev",
      vehicleNumber: "DLxxxxxxxx54",
      connector: "Type2",
      chargerType: "Premium AC Fast",
      time: "01:00 AM",
      amount: "₹550",
    },
  ];

  const handleTrack = (booking: UpcomingBooking) => {
    router.push(`/dashboard/bookings/verification?bookingId=${booking.id}`);
  };

  return (
    <div className="upcoming-bookings-container">
      <h2 className="upcoming-bookings-title mt-16">Booking Upcoming</h2>
      <div className="upcoming-bookings-wrapper mt-10">
        <table className="upcoming-bookings-table">
          <thead>
            <tr>
              <th>Stations</th>
              <th>Vehicle Model</th>
              <th>Vehicle Number</th>
              <th>Connector</th>
              <th>Charger Type</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {upcomingBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.station}</td>
                <td>{booking.vehicleModel}</td>
                <td>{booking.vehicleNumber}</td>
                <td>{booking.connector}</td>
                <td>{booking.chargerType}</td>
                <td>{booking.time}</td>
                <td>{booking.amount}</td>
                <td>
                  <button
                    className="track-btn"
                    onClick={() => handleTrack(booking)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    </svg>
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}