import { Star } from "lucide-react";
import { Icon } from "@iconify/react";
import "./stats.css";

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  subtitleColor?: string;
  icon?: string;
  rating?: number;
}

export default function StatsCard({
  title,
  value,
  change,
  subtitle,
  subtitleColor = "text-gray-500",
  icon,
  rating,
}: StatsCardProps) {
  return (
    <div className="stats-card">
      {/* Header - Icon and Title */}
      <div className="stats-card-header">
        {icon && (
          <div className={`stats-card-icon ${title === "Host Rating" ? 'large' : ''}`}>
            <Icon icon={icon} style={{ color: "#38EF0A" }} />
          </div>
        )}
        <h3 className="stats-card-title">{title}</h3>
      </div>

      {/* Value */}
      <p className="stats-card-value">{value}</p>

      {/* Change/Subtitle/Rating */}
      {change ? (
        <div className={`stats-card-change ${change.isPositive ? 'positive' : 'negative'}`}>
          {change.value === "12 This Week" ? (
            <div className="stats-card-change-icon">
              <Icon icon="lineicons:trend-up-1" style={{ color: "#2ACD01" }} />
            </div>
          ) : (
            <div className="stats-card-change-icon">
              <Icon icon="solar:arrow-up-outline" style={{ color: "#2ACD01" }} />
            </div>
          )}
          <span>{change.value}</span>
        </div>
      ) : subtitle ? (
        <div className={`stats-card-subtitle ${subtitle === "All Online" ? 'online' : 'default'}`}>
          {subtitle === "All Online" && (
            <div className="stats-card-subtitle-icon">
              <Icon icon="token:zap" style={{ color: "#2ACD01" }} />
            </div>
          )}
          {subtitle === "12 This Week" && (
            <div className="stats-card-subtitle-icon">
              <Icon icon="solar:calendar-minimalistic-outline" style={{ color: "#8E8E93" }} />
            </div>
          )}
          {subtitle}
        </div>
      ) : null}

      {/* Rating Stars */}
      {rating !== undefined && (
        <div className="stats-card-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="stats-card-star"
              style={{
                color: i < Math.floor(rating) ? '#FFD700' : i < rating ? '#FFD70080' : '#E5E5EA',
                fill: i < Math.floor(rating) ? '#FFD700' : i < rating ? '#FFD70080' : 'transparent',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

