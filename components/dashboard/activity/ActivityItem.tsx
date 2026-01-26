import { CalendarCheck, HandCoins, Star } from "lucide-react";
import "./activity.css";

interface ActivityItemProps {
  type: "booking" | "payment" | "review";
  title: string;
  details: string;
  time: string;
  amount?: string;
  rating?: number;
}

export default function ActivityItem({
  type,
  title,
  details,
  time,
  amount,
  rating,
}: ActivityItemProps) {
  const icons = {
    booking: CalendarCheck,
    payment: HandCoins,
    review: Star,
  };

  const Icon = icons[type];

  return (
    <div className="activity-item">
      {/* Left side - Icon, Title, Details, Time */}
      <div className="activity-left-content">
        {/* Icon and Title in same line */}
        <div className="activity-item-title-row">
          <div className="activity-item-icon-container">
            <Icon className="activity-item-icon" />
          </div>
          <p className="activity-item-title">
            {title}
          </p>
        </div>
        
        {/* Details */}
        <p className="activity-item-details">
          {details}
        </p>
        
        {/* Time */}
        <p className="activity-item-time">
          {time}
        </p>
      </div>

      {/* Right side - Amount or Rating */}
      {amount && (
        <div className="activity-item-amount">
          {amount}
        </div>
      )}
      {rating && (
        <div className="activity-item-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="activity-item-star"
              style={{
                color: i < rating ? '#FFD700' : '#E5E5EA',
                fill: i < rating ? '#FFD700' : 'transparent',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

