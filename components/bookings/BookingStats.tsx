"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import BookingStatCard from "./BookingStatCard";
import "./booking-stats.css";

export default function BookingStats() {
  const pathname = usePathname();
  
  const stats = [
    {
      title: "Total Leads",
      count: 1000,
      label: "Booking Inquiries",
      href: "/dashboard/bookings",
      icon: "material-symbols:group",
      type: "total",
    },
    {
      title: "Responded",
      count: 700,
      label: "Booking Inquiries",
      href: "/dashboard/bookings/responded",
      icon: "icon-park-solid:check-one",
      type: "responded",
    },
    {
      title: "Cancelled",
      count: 200,
      label: "Booking Inquiries",
      href: "/dashboard/bookings/cancelled",
      icon: "material-symbols-light:cancel-rounded",
      type: "cancelled",
    },
    {
      title: "Missed",
      count: 100,
      label: "Booking Inquiries",
      href: "/dashboard/bookings/missed",
      icon: "pajamas:time-out",
      type: "missed",
    },
  ];

  const getIconColor = (isActive: boolean, type?: string) => {
    // Use white color when active, otherwise use green (or red for cancelled)
    if (isActive) {
      return "#FFFFFF"; // White when active
    } else if (type === "cancelled") {
      return "#FF3B30"; // Red for cancelled when not active
    }
    return "#38EF0A"; // Default green
  };

  return (
    <div className="booking-stats-container">
      {stats.map((stat, index) => {
        // Check if current path matches the href
        const isActive = pathname === stat.href ||
          // Keep Total Leads active for the main bookings page and verification subpage
          (stat.href === "/dashboard/bookings" && (pathname === "/dashboard/bookings" || pathname.startsWith("/dashboard/bookings/verification"))) ||
          (stat.href === "/dashboard/bookings/responded" && pathname.startsWith("/dashboard/bookings/responded")) ||
          (stat.href === "/dashboard/bookings/cancelled" && pathname.startsWith("/dashboard/bookings/cancelled")) ||
          (stat.href === "/dashboard/bookings/missed" && pathname.startsWith("/dashboard/bookings/missed"));
        
        return (
          <BookingStatCard
            key={index}
            title={stat.title}
            count={stat.count}
            label={stat.label}
            href={stat.href}
            icon={
              <Icon 
                icon={stat.icon}
                style={{ 
                  width: "24px", 
                  height: "24px",
                  color: getIconColor(isActive, stat.type)
                }}
              />
            }
            isActive={isActive}
            type={stat.type}
          />
        );
      })}
    </div>
  );
}