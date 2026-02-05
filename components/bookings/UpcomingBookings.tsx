"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { bookingsAPI } from "@/lib/api";
import "./bookings.css";

interface UpcomingBooking {
  id: string;
  station: string;
  vehicleModel: string;
  vehicleNumber: string;
  connector: string;
  chargerType: string;
  time: string;
  amount: string;
}

// localStorage helpers
const STORAGE_KEY = 'accepted_bookings';

const saveAcceptedBookings = (bookings: UpcomingBooking[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving accepted bookings:', error);
  }
};

const loadAcceptedBookings = (): UpcomingBooking[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading accepted bookings:', error);
    return [];
  }
};

// Function to clear all accepted bookings from localStorage
const clearAcceptedBookings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Cleared accepted bookings from localStorage (UpcomingBookings)');
  } catch (error) {
    console.error('Error clearing accepted bookings:', error);
  }
};

export default function UpcomingBookings() {
  const router = useRouter();
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount to avoid hydration mismatch
  useEffect(() => {
    setUpcomingBookings(loadAcceptedBookings());
  }, []);

  // Fetch verified bookings from backend
  useEffect(() => {
    const fetchVerifiedBookings = async () => {
      try {
        setLoading(true);

        // Fetch both ACCEPTED and VERIFIED bookings
        const [acceptedResponse, verifiedResponse] = await Promise.all([
          bookingsAPI.getBookings(1, 50, 'ACCEPTED' as any),
          bookingsAPI.getBookings(1, 50, 'VERIFIED' as any)
        ]);

        // Handle nested response structure for both responses
        const acceptedBookings = acceptedResponse?.data?.bookings || acceptedResponse?.bookings || [];
        const verifiedBookings = verifiedResponse?.data?.bookings || verifiedResponse?.bookings || [];

        // Combine both arrays
        const allBookings = [...acceptedBookings, ...verifiedBookings];

        const transformedBookings = allBookings.map((booking: any) => ({
          id: booking._id,
          station: booking.chargerName || 'Unknown Station',
          vehicleModel: booking.vehicleModel || 'Unknown Vehicle',
          vehicleNumber: booking.vehicleNumber || 'N/A',
          connector: booking.connectorType || 'Type2',
          chargerType: 'Premium DC Fast',
          time: booking.acceptedAt ? new Date(booking.acceptedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
            booking.verifiedAt ? new Date(booking.verifiedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          amount: `₹${booking.amount || 0}`,
        }));

        // Get locally stored bookings
        const localBookings = loadAcceptedBookings();

        // Merge API data with local data, avoiding duplicates by ID
        const mergedBookings = [...transformedBookings];
        localBookings.forEach(localBooking => {
          if (!mergedBookings.find(apiBooking => apiBooking.id === localBooking.id)) {
            mergedBookings.push(localBooking);
          }
        });

        setUpcomingBookings(mergedBookings);
        saveAcceptedBookings(mergedBookings);
      } catch (error) {
        console.error('Error fetching verified bookings:', error);
        // Fallback to locally stored bookings if API fails
        const localBookings = loadAcceptedBookings();
        if (localBookings.length > 0) {
          setUpcomingBookings(localBookings);
        } else {
          // Fallback to mock data if no local data
          setUpcomingBookings([
            {
              id: "507f1f77bcf86cd799439014",
              station: "Premium Mall Charging Hub",
              vehicleModel: "Tata Nexon EV",
              vehicleNumber: "DLxxxxxx34",
              connector: "Type 2",
              chargerType: "Premium DC Fast",
              time: "10:00 AM",
              amount: "₹320",
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedBookings();

    // Refresh every 30 seconds
    const interval = setInterval(fetchVerifiedBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleBookingAccepted = (event: CustomEvent) => {
      const newBooking = event.detail;

      setUpcomingBookings((prev: UpcomingBooking[]) => {
        const updatedBookings = [newBooking, ...prev];
        saveAcceptedBookings(updatedBookings);
        return updatedBookings;
      });
    };

    window.addEventListener('booking-accepted', handleBookingAccepted as EventListener);

    return () => {
      window.removeEventListener('booking-accepted', handleBookingAccepted as EventListener);
    };
  }, []);

  // Save to localStorage whenever upcomingBookings changes
  useEffect(() => {
    saveAcceptedBookings(upcomingBookings);
  }, [upcomingBookings]);

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