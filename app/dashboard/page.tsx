"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Clock,
  IndianRupee,
  Users,
  FileText,
  CalendarCheck,
  HandCoins,
  MessageSquare,
  Wallet,
} from "lucide-react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/common/Navbar";
import DashboardHeader from "@/components/common/DashboardHeader";
import RevenueStatCards from "@/components/dashboard/stats/RevenueStatCards";
import StatsCard from "@/components/dashboard/stats/StatsCard";
import MetricCard from "@/components/dashboard/stats/MetricCard";
import ActivityItem from "@/components/dashboard/activity/ActivityItem";
import BookingItem from "@/components/bookings/BookingItem";
import RevenueChart from "@/components/dashboard/charts/RevenueChart";
import Footer from "@/components/common/Footer";
import {
  statsData,
  performanceMetrics,
  recentActivities,
  todaysBookings, // Bring this back to use as a fallback dummy data example
  revenueData,
} from "@/lib/mockData";
import { bookingsAPI } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";

// Icon mapping for performance metrics
const iconMap = {
  Zap,
  Clock,
  IndianRupee,
  Users,
};

export default function DashboardPage() {
  const router = useRouter();
  const { userData, getUserFullName, updateUserData } = useUser();
  const [isOnline, setIsOnline] = useState(userData.isOnline);
  const [activeTab, setActiveTab] = useState("Overview");

  // State for live Today's Bookings
  const [realTodaysBookings, setRealTodaysBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Fetch Today's Bookings via the shared API helper (uses correct base URL)
  React.useEffect(() => {
    const fetchTodaysBookings = async () => {
      try {
        const data = await bookingsAPI.getTodaysBookings();
        setRealTodaysBookings(data ?? []);
      } catch (error) {
        console.error("Failed to fetch today's bookings:", error);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    fetchTodaysBookings();
  }, []);

  const tabs = ["Overview", "My Chargers", "Bookings", "Earnings", "Wallet", "Support Tickets", "Reviews"];

  const handleTabClick = (tab: string) => {
    if (tab === "My Chargers") {
      router.push("/dashboard/my-chargers");
    } else if (tab === "Bookings") {
      router.push("/dashboard/bookings");
    } else if (tab === "Earnings") {
      router.push("/dashboard/earnings");
    } else if (tab === "Wallet") {
      router.push("/dashboard/wallet");
    } else if (tab === "Reviews") {
      router.push("/dashboard/reviews");
    } else if (tab === "Support Tickets") {
      router.push("/dashboard/support-tickets");
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto dashboard-main">
          {/* Dashboard Header */}
          <DashboardHeader
            userName={getUserFullName()}
            userEmail={userData.email}
            isOnline={isOnline}
            onToggleStatus={() => {
              const newStatus = !isOnline;
              setIsOnline(newStatus);
              updateUserData({ isOnline: newStatus });
            }}
          />

          {/* Tabs Section */}
          <div className="dashboard-tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              const tabIconMap: { [key: string]: React.ComponentType<any> } = {
                Overview: FileText,
                Bookings: CalendarCheck,
                Earnings: HandCoins,
                Wallet,
                Reviews: MessageSquare,
              };
              const LucideIcon = tabIconMap[tab];
              const isMyChargers = tab === "My Chargers";
              const isSupportTab = tab === "Support Tickets";

              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`dashboard-tab flex items-center gap-1 md:gap-2 font-medium transition-all rounded-lg ${
                    isActive ? "active" : ""
                  }`}
                  style={{
                    backgroundColor: isActive ? "rgba(56, 239, 10, 1)" : "white",
                    color: isActive ? "white" : "#374151",
                    boxShadow: isActive ? "none" : "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "rgba(52, 199, 89, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  {isMyChargers ? (
                    <span
                      className="material-symbols-rounded text-base md:text-2xl"
                      style={{
                        color: isActive ? "white" : "#374151",
                      }}
                    >
                      ev_charger
                    </span>
                  ) : isSupportTab ? (
                    <Icon
                      icon="mynaui:ticket"
                      className="w-4 h-4 md:w-6 md:h-6"
                      style={{
                        color: isActive ? "white" : "#374151",
                      }}
                    />
                  ) : (
                    LucideIcon && (
                      <LucideIcon
                        className="w-4 h-4 md:w-6 md:h-6"
                        style={{
                          color: isActive ? "white" : "#374151",
                        }}
                      />
                    )
                  )}
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Revenue Stats Cards + Rating Card */}
          <div className="stats-grid">
            {/* Revenue Cards from Backend - 3 cards */}
            <RevenueStatCards />
            {/* Rating Card - Keep Original */}
            <StatsCard
              title="Host Rating"
              value="4.7"
              rating={4.7}
              icon="material-symbols-light:star-outline-rounded"
            />
          </div>

          {/* Main Content Grid */}
          <div className="content-grid-3col">
            {/* Revenue Analytics */}
            <div
              className="revenue-card-wrapper"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="revenue-analytics-title">
                  Revenue Analytics
                </h2>
                <select
                  className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer revenue-select"
                >
                  <option>This Month</option>
                  <option>This Week</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="revenue-container">
                <RevenueChart data={revenueData} />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="performance-metrics-card">
              <h2
                className="performance-metrics-title"
              >
                Performance Metrics
              </h2>
              <div className="performance-metrics-grid">
                {performanceMetrics.map((metric, index) => {
                  const Icon = iconMap[metric.icon];
                  return (
                    <MetricCard
                      key={index}
                      label={metric.label}
                      value={metric.value}
                      icon={Icon}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="content-grid-2col">
            {/* Recent Activity */}
            <div className="activity-section">
              <div className="recent-activity-header">
                <h2 className="activity-section-title">Recent Activity</h2>

              </div>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    type={activity.type}
                    title={activity.title}
                    details={activity.details}
                    time={activity.time}
                    amount={activity.amount}
                    rating={activity.rating}
                  />
                ))}
              </div>
            </div>

            {/* Today's Bookings */}
            <div
              className="bookings-section"
            >
              <h2
                className="bookings-section-title"
              >
                Today&apos;s Bookings
              </h2>
              <div className="space-y-3 bookings-scrollable">
                {isLoadingBookings ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  </div>
                ) : realTodaysBookings.length === 0 ? (
                  // Fallback to dummy data to show how it looks when there are no live API bookings yet
                  todaysBookings.slice(0, 1).map((booking, index) => (
                    <div key={`dummy-${index}`} className="relative">
                      {/* Optional Dummy Label */}
                      <span className="absolute top-2 right-2 bg-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-full z-10">Demo Data</span>
                      <BookingItem
                        time={booking.time}
                        duration={booking.duration}
                        chargerName={booking.chargerName}
                        customerName={booking.customerName}
                        vehicleName={booking.vehicleName}
                        vehicleImage={booking.vehicleImage}
                        vehicleType={booking.vehicleType}
                        status={booking.status}
                      />
                    </div>
                  ))
                ) : (
                  realTodaysBookings.map((booking: any, index: number) => {
                    // Format time
                    const dateObj = new Date(booking.scheduledDateTime);
                    const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    // Format duration string (e.g., 2 hours, 1.5 hours)
                    const durationStr = booking.duration ? `${booking.duration} hr` : 'N/A';

                    // Fallback to defaults where data might be missing
                    return (
                      <BookingItem
                        key={booking._id || index}
                        time={timeString}
                        duration={durationStr}
                        chargerName={booking.chargerName || "Unknown Charger"}
                        customerName={booking.customerName || "Customer"}
                        vehicleName={booking.vehicleModel || "EV"}
                        vehicleImage={""} // Cannot reliably know vehicle image from backend string
                        vehicleType={booking.connectorType || "EV"}
                        status={booking.status}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}