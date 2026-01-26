"use client";

import { useRouter } from "next/navigation";
import "./responded.css";

interface BookingRespondedData {
  userName: string;
  vehicleModel: string;
  chargerType: string;
  bookingId: string;
  location: string;
  date: string;
  amount: string;
  duration: string;
}

export default function BookingResponded() {
  const router = useRouter();

  const bookingData: BookingRespondedData[] = [
    {
      userName: "Priya Singh",
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
      vehicleModel: "Mahindra E2o Puls Ex",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2o Puls Ex",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2o Puls Ex",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
    {
      userName: "Rahul Verma",
      vehicleModel: "Mahindra E2o Puls",
      chargerType: "CCS2",
      bookingId: "#BK001232",
      location: "Yamuna Expressway",
      date: "April 12, 2025",
      amount: "₹550",
      duration: "3 Hours",
    },
  ];

  const handleViewAll = () => {
    router.push("/dashboard/bookings/responded/all");
  };

  return (
    <div className="booking-responded-container">
      <div className="booking-responded-header">
        <h2 className="booking-responded-title">Booking Responded</h2>
        <button className="booking-responded-view-all-btn" onClick={handleViewAll}>
          View All
        </button>
      </div>
      <div className="booking-responded-table-wrapper">
        <table className="booking-responded-table">
          <thead>
            <tr className="booking-responded-table-header">
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
            {bookingData.map((booking, index) => (
              <tr key={index} className="booking-responded-table-row">
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

