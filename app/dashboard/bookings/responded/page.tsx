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
import Navbar from "@/components/common/Navbar";
import DashboardHeader from "@/components/common/DashboardHeader";
import BookingStats from "@/components/bookings/BookingStats";
import BookingResponded from "@/components/bookings/responded/BookingResponded";
import Footer from "@/components/common/Footer";
import { useUser } from "@/contexts/UserContext";

export default function BookingRespondedPage() {
  const router = useRouter();
  const { userData, getUserFullName, updateUserData } = useUser();
  const [isOnline, setIsOnline] = useState(userData.isOnline);
  const [activeTab, setActiveTab] = useState("Bookings");

  const tabs = ["Overview", "My Chargers", "Bookings", "Earnings", "Wallet", "Reviews"];

  const handleTabClick = (tab: string) => {
    if (tab === "Overview") {
      router.push("/dashboard");
    } else if (tab === "My Chargers") {
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
          <div className="bookings-tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
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
                  className="bookings-tab"
                  style={{
                    backgroundColor: isActive ? 'rgba(56, 239, 10, 1)' : 'white',
                    color: isActive ? 'white' : '#374151',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(52, 199, 89, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {isMyChargers ? (
                    <span 
                      className="material-symbols-rounded tab-icon"
                      style={{
                        color: isActive ? 'white' : '#374151',
                      }}
                    >
                      ev_charger
                    </span>
                  ) : (
                    Icon && (
                      <Icon 
                        className="tab-icon"
                        style={{
                          color: isActive ? 'white' : '#374151',
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

          {/* Booking Responded Section */}
          <BookingResponded />
        </main>

        <Footer />
      </div>
    </>
  );
}

