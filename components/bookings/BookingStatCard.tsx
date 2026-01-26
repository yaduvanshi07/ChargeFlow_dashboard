"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import "./booking-stats.css";

interface BookingStatCardProps {
  title: string;
  count: number;
  label: string;
  href: string;
  icon: React.ReactNode;
  iconColor?: string;
  isActive?: boolean;
  type?: string;
}

export default function BookingStatCard({
  title,
  count,
  label,
  href,
  icon,
  iconColor,
  isActive = false,
  type = "",
}: BookingStatCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  const formatCount = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div
      className={`booking-stat-card ${isActive ? "active" : ""}`}
      onClick={handleClick}
      data-type={type}
    >
      <div className="booking-stat-content-container">
        <div className="booking-stat-header">
          <div className="booking-stat-icon-container">{icon}</div>
          <div className="booking-stat-title">{title}</div>
        </div>
        
        <div className="booking-stat-count">{formatCount(count)}</div>
        <div className="booking-stat-label">{label}</div>
        
        {!isActive && (
          <div className="booking-stat-view-details">
            View Details
            <ArrowRight />
          </div>
        )}
      </div>
    </div>
  );
}