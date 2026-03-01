"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CalendarCheck,
  HandCoins,
  MessageSquare,
  Wallet,
} from "lucide-react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/common/Navbar";
import DashboardHeader from "@/components/common/DashboardHeader";
import BookingStats from "@/components/bookings/BookingStats";
import BookingRequests from "@/components/bookings/BookingRequests";
import UpcomingBookings from "@/components/bookings/UpcomingBookings";
import BookingManagement from "@/components/bookings/BookingManagement";
import Footer from "@/components/common/Footer";
import { useUser } from "@/contexts/UserContext";

export default function BookingsPage() {
  const router = useRouter();
  const { userData, getUserFullName, updateUserData } = useUser();
  const [isOnline, setIsOnline] = useState(userData.isOnline);
  const [activeTab, setActiveTab] = useState("Bookings");

  const tabs = ["Overview", "My Chargers", "Bookings", "Earnings", "Wallet", "Support Tickets", "Reviews"];

  const handleTabClick = (tab: string) => {
    if (tab === "Overview") {
      router.push("/dashboard");
    } else if (tab === "My Chargers") {
      router.push("/dashboard/my-chargers");
    } else if (tab === "Bookings") {
      setActiveTab(tab);
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

        <main className="max-w-7xl mx-auto bookings-main">
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
 {/* Booking Management Title */}
          <h2 className="booking-management-title">Booking Management</h2>
        {/* Booking Stats Cards */}
        <BookingStats />

        {/* Booking Requests */}
        <BookingRequests />

        {/* Upcoming Bookings */}
        <UpcomingBookings />

        {/* Booking Management Component */}
        <div className="mb-8">
          <BookingManagement />
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}

