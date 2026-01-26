"use client";

import { useState, useEffect } from "react";
import { Wifi, Coffee, Shield, ParkingCircle, Bath } from "lucide-react";
import "./booking-requests.css";

interface BookingRequest {
  id: number;
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

export default function BookingRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>([
    {
      id: 1,
      stationName: "Premium Mall Charging Hub",
      vehicleModel: "Tata Nexon EV",
      vehicleNumber: "DLxxxxxx34",
      vehicleImage: "/ev.avif",
      connector: "Type2",
      chargerType: "Premium DC Fast-50kWh",
      unitPrice: "₹18/KWh",
      totalUnits: "₹18/KWh",
      amount: "₹320.00",
      amenities: ["WiFi", "Parking", "Cafe"],
      timer: 59,
    },
    {
      id: 2,
      stationName: "Residential Society Charger",
      vehicleModel: "MG ZS EV",
      vehicleNumber: "DLxxxxxx54",
      vehicleImage: "/evch.jpg",
      connector: "Type2",
      chargerType: "Premium AC Fast-50kWh",
      unitPrice: "₹18/KWh",
      totalUnits: "₹18/KWh",
      amount: "₹410.00",
      amenities: ["Security", "Parking", "Restroom"],
      timer: 59,
    },
    {
      id: 3,
      stationName: "Highway Charging Point",
      vehicleModel: "Tata Nexon EV",
      vehicleNumber: "DLxxxxxx43",
      vehicleImage: "/ev.avif",
      connector: "Type2",
      chargerType: "Premium DC Fast-50kWh",
      unitPrice: "₹18/KWh",
      totalUnits: "₹18/KWh",
      amount: "₹320.00",
      amenities: ["WiFi", "Parking", "Cafe"],
      timer: 59,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) => {
        // Only update if there are active timers to avoid unnecessary re-renders
        const hasActiveTimers = prev.some(req => req.timer > 0);
        if (!hasActiveTimers) return prev;
        
        return prev.map((req) => 
          req.timer > 0 
            ? { ...req, timer: req.timer - 1 }
            : req // Don't create new object if timer is already 0
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

  const handleAccept = (id: number) => {
    console.log("Accept booking:", id);
  };

  const handleCancel = (id: number) => {
    console.log("Cancel booking:", id);
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <div className="booking-requests-container">
      <h2 className="booking-requests-title">Booking Requests</h2>
      <div className="booking-requests-wrapper">
        <div className="booking-requests-cards">
          {requests.map((request) => (
            <div key={request.id} className="booking-request-card">
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