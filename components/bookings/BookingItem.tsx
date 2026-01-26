import Image from "next/image";
import "./bookings.css";

interface BookingItemProps {
  time: string;
  duration: string;
  chargerName: string;
  customerName: string;
  vehicleName: string;
  vehicleImage?: string;
  vehicleType?: "car" | "bike";
  status: "Confirmed" | "Pending" | "Cancelled";
}

// Server Component - no client-side interactivity needed
export default function BookingItem({
  time,
  duration,
  chargerName,
  customerName,
  vehicleName,
  vehicleImage,
  vehicleType = "car",
  status,
}: BookingItemProps) {

  return (
    <div className="booking-item">
      {/* Left side - Time, Duration, Charger, Customer */}
      <div className="booking-left-content">
        {/* Time and Duration */}
        <div className="booking-time-row">
          <span className="booking-item-time">
            {time}
          </span>
          <span style={{ width: '1px', height: '16px', background: '#E5E5EA' }} />
          <span className="booking-item-duration">
            {duration}
          </span>
        </div>
        
        {/* Charger Name */}
        <p className="booking-item-charger">
          {chargerName}
        </p>
        
        {/* Customer Name */}
        <div className="booking-item-name-row">
          <span className="booking-item-name-label">Name:</span>
          <span className="booking-item-name-value">{customerName}</span>
        </div>
      </div>

      {/* Right side - Vehicle Image and Status Button */}
      <div className="booking-right-content">
        {/* Vehicle Image Container */}
        <div className="booking-item-vehicle">
          {vehicleImage ? (
            <Image
              src={vehicleImage}
              alt={vehicleName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: vehicleType === "car" ? "#3b82f6" : "#6b7280",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '10px',
              textAlign: 'center',
              padding: '4px',
            }}>
              {vehicleName}
            </div>
          )}
        </div>

        {/* Status Button */}
        <div className="booking-item-status">
          {status}
        </div>
      </div>
    </div>
  );
}

