"use client";

import { useState } from "react";
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
  todaysBookings,
  revenueData,
} from "@/lib/mockData";
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

  const tabs = ["Overview", "My Chargers", "Bookings", "Earnings", "Wallet", "Reviews"];

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
              // Icon mapping for each tab
              const iconMap: { [key: string]: React.ComponentType<any> } = {
                "Overview": FileText,
                "Bookings": CalendarCheck,
                "Earnings": HandCoins,
                "Wallet": Wallet,
                "Reviews": MessageSquare,
              };
              const Icon = iconMap[tab];
              const isMyChargers = tab === "My Chargers";

              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`dashboard-tab ${isActive ? 'active' : ''}`}
                >
                  {isMyChargers ? (
                    <span className="material-symbols-rounded tab-icon">
                      ev_charger
                    </span>
                  ) : (
                    Icon && (
                      <Icon className="tab-icon" />
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
                {todaysBookings.map((booking, index) => (
                  <BookingItem
                    key={index}
                    time={booking.time}
                    duration={booking.duration}
                    chargerName={booking.chargerName}
                    customerName={booking.customerName}
                    vehicleName={booking.vehicleName}
                    vehicleImage={booking.vehicleImage}
                    vehicleType={booking.vehicleType}
                    status={booking.status}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}