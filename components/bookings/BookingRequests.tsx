"use client";

import { useState, useEffect } from "react";
import { Wifi, Coffee, Shield, ParkingCircle, Bath } from "lucide-react";
import { bookingsAPI } from "@/lib/api";
import "./booking-requests.css";

interface BookingRequest {
  id: string;
  stationName: string;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleImage: string;
  connector: string;
  chargerType: string;
  unitPrice: string;
  totalUnits: string;
  amount: string;
  amenities: string[];
  timer: number;
}

// localStorage helpers for accepted bookings
const ACCEPTED_BOOKINGS_KEY = 'accepted_bookings';

const saveAcceptedBooking = (booking: any) => {
  try {
    const existingBookings = JSON.parse(localStorage.getItem(ACCEPTED_BOOKINGS_KEY) || '[]');
    const updatedBookings = [booking, ...existingBookings];
    localStorage.setItem(ACCEPTED_BOOKINGS_KEY, JSON.stringify(updatedBookings));
  } catch (error) {
    console.error('Error saving accepted booking:', error);
  }
};

// Function to clear all accepted bookings from localStorage
const clearAcceptedBookings = () => {
  try {
    localStorage.removeItem(ACCEPTED_BOOKINGS_KEY);
    console.log('✅ Cleared accepted bookings from localStorage');
  } catch (error) {
    console.error('Error clearing accepted bookings:', error);
  }
};

export default function BookingRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending bookings from backend
  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingsAPI.getBookings(1, 50, 'PENDING' as any);
        
        // Handle nested response structure: {success: true, data: {bookings: [...], pagination: {...}}}
        const bookings = response?.data?.bookings || response?.bookings || [];
        
        // Transform backend data to frontend format
        const transformedRequests = bookings.map((booking: any) => ({
          id: booking._id,
          stationName: booking.chargerName || 'Unknown Station',
          vehicleModel: booking.vehicleModel || 'Unknown Vehicle',
          vehicleNumber: booking.vehicleNumber || 'N/A',
          vehicleImage: "/ev.avif",
          connector: booking.connectorType || 'Type2',
          chargerType: 'Premium AC Fast-50kWh',
          unitPrice: booking.unitPrice || '₹18/KWh',
          totalUnits: booking.unitPrice || '₹18/KWh',
          amount: `₹${booking.amount || 0}.00`,
          amenities: ["WiFi", "Parking", "Security"],
          timer: 59,
        }));
        
        setRequests(transformedRequests);
      } catch (error) {
        console.error('Error fetching pending bookings:', error);
        // Fallback to mock data if API fails
        setRequests([
          {
            id: "507f1f77bcf86cd799439015",
            stationName: "Auto Test Station",
            vehicleModel: "Tata Tigor EV",
            vehicleNumber: "DLAUTO8888",
            vehicleImage: "/ev.avif",
            connector: "Type2",
            chargerType: "Premium AC Fast-50kWh",
            unitPrice: "₹18/KWh",
            totalUnits: "₹18/KWh",
            amount: "₹180.00",
            amenities: ["WiFi", "Parking", "Security"],
            timer: 59,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) => {
        const hasActiveTimers = prev.some(req => req.timer > 0);
        if (!hasActiveTimers) return prev;
        
        return prev.map((req) => 
          req.timer > 0 
            ? { ...req, timer: req.timer - 1 }
            : req
        );
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi />;
      case "parking":
        return <ParkingCircle />;
      case "cafe":
        return <Coffee />;
      case "security":
        return <Shield />;
      case "restroom":
        return <Bath />;
      default:
        return null;
    }
  };

  const handleAccept = async (id: string) => {
    try {
      // Check if booking is already being processed
      const existingRequest = requests.find(req => req.id === id);
      if (!existingRequest) {
        console.log("Booking already processed:", id);
        return;
      }

      // Call backend API to accept booking
      await bookingsAPI.acceptBooking(id);
      
      // Remove from requests list
      setRequests((prev) => prev.filter((req) => req.id !== id));
      
      // Create booking object for upcoming bookings
      const acceptedBooking = {
        id,
        station: existingRequest.stationName,
        vehicleModel: existingRequest.vehicleModel,
        vehicleNumber: existingRequest.vehicleNumber,
        connector: existingRequest.connector,
        chargerType: existingRequest.chargerType,
        amount: existingRequest.amount,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      // Save to localStorage
      saveAcceptedBooking(acceptedBooking);
      
      // Add to upcoming bookings (trigger event to update UpcomingBookings component)
      window.dispatchEvent(new CustomEvent('booking-accepted', { 
        detail: acceptedBooking
      }));
      
      // Dispatch charger status change event (charger goes online when booking is accepted)
      window.dispatchEvent(new CustomEvent('charger-status-changed', {
        detail: {
          bookingId: id,
          status: 'ONLINE',
          timestamp: new Date().toISOString(),
          message: 'Charger status changed to online after booking acceptance'
        }
      }));
      
      console.log("Booking accepted successfully:", id);
    } catch (error: any) {
      console.error("Error accepting booking:", error);
      
      // If booking is already accepted, remove it from requests and add to upcoming
      if (error.message?.includes("Current status: ACCEPTED")) {
        console.log("Booking was already accepted, updating UI...");
        const existingRequest = requests.find(req => req.id === id);
        if (existingRequest) {
          // Remove from requests list
          setRequests((prev) => prev.filter((req) => req.id !== id));
          
          // Create booking object for upcoming bookings
          const acceptedBooking = {
            id,
            station: existingRequest.stationName,
            vehicleModel: existingRequest.vehicleModel,
            vehicleNumber: existingRequest.vehicleNumber,
            connector: existingRequest.connector,
            chargerType: existingRequest.chargerType,
            amount: existingRequest.amount,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          
          // Save to localStorage
          saveAcceptedBooking(acceptedBooking);
          
          // Add to upcoming bookings
          window.dispatchEvent(new CustomEvent('booking-accepted', { 
            detail: acceptedBooking
          }));
        }
      }
    }
  };

  const handleCancel = (id: string) => {
    console.log("Cancel booking:", id);
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <div className="booking-requests-container">
      <h2 className="booking-requests-title">Booking Requests</h2>
      <div 
        className="booking-requests-wrapper"
        style={{
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        } as React.CSSProperties}
      >
        <style jsx>{`
          .booking-requests-wrapper::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div 
          className="booking-requests-cards"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            gap: '20px'
          }}
        >
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="booking-request-card"
              style={{
                minWidth: '320px',
                width: '359px',
                flexShrink: 0
              }}
            >
              <div className="booking-request-image-container">
                <div className="booking-request-image">
                  <img src={request.vehicleImage} alt={request.vehicleModel} />
                </div>
              </div>

              <div className="booking-request-details">
                <h3 className="booking-request-station">{request.stationName}</h3>
                
                <div className="booking-request-info">
                  <div className="booking-info-item">
                    <span className="booking-info-icon-box">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16m11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5M5 11l1.5-4.5h11L19 11z"/>
                      </svg>
                    </span>
                    <span className="booking-info-label">Vehicle Number:</span>
                    <span className="booking-info-value">{request.vehicleNumber}</span>
                  </div>
                  
                  <div className="booking-info-item">
                    <span className="booking-info-icon-box">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>
                        <path fill="currentColor" d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2M19 8l.001 12H5V8z"/>
                      </svg>
                    </span>
                    <span className="booking-info-label">Connector Gun1:</span>
                    <span className="booking-info-value">{request.connector}</span>
                  </div>
                  
                  <div className="booking-info-item">
                    <span className="booking-info-icon-box">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66c.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21"/>
                      </svg>
                    </span>
                    <span className="booking-info-label">Charger Type:</span>
                    <span className="booking-info-value">{request.chargerType}</span>
                  </div>
                  
                  <div className="booking-info-item">
                    <span className="booking-info-icon-box">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M15 11V5l-3-3l-3 3v2H3v14h8v-4c0-1.1.9-2 2-2s2 .9 2 2v4h8V11z"/>
                      </svg>
                    </span>
                    <span className="booking-info-label">Charger Unit:</span>
                    <span className="booking-info-value">{request.unitPrice}</span>
                  </div>
                  
                  <div className="booking-info-item amount-row">
                    <div className="amount-left">
                      <span className="booking-info-icon-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15"/>
                        </svg>
                      </span>
                      <span className="booking-info-label">Amount:</span>
                      <span className="booking-info-value">{request.amount}</span>
                    </div>
                    <div className="booking-request-timer">
                      <span className="booking-request-timer-text">
                        {formatTimer(request.timer)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-request-amenities">
                  {request.amenities.map((amenity, idx) => (
                    <div key={idx} className="amenity-item">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="booking-request-actions">
                <button
                  className="booking-cancel-btn"
                  onClick={() => handleCancel(request.id)}
                >
                  ✕ Cancel
                </button>
                <button
                  className="booking-accept-btn"
                  onClick={() => handleAccept(request.id)}
                >
                  ✓ Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}