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
import StatsCard from "@/components/dashboard/stats/StatsCard";
import RatingSummary from "@/components/dashboard/reviews/RatingSummary";
import CustomerReviews from "@/components/dashboard/reviews/CustomerReviews";
import Footer from "@/components/common/Footer";
import {
  statsData,
} from "@/lib/mockData";
import { useUser } from "@/contexts/UserContext";
import "@/styles/pages/reviews.css";

// Icon mapping for performance metrics
const iconMap = {
  Zap,
  Clock,
  IndianRupee,
  Users,
};

export default function ReviewsPage() {
  const router = useRouter();
  const { userData, getUserFullName, updateUserData } = useUser();
  const [isOnline, setIsOnline] = useState(userData.isOnline);
  const [activeTab, setActiveTab] = useState("Reviews");

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
      setActiveTab(tab);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto reviews-main">
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
          <div className="reviews-tabs">
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
                className="reviews-tab flex items-center gap-1 md:gap-2 font-medium transition-all rounded-lg"
                style={{
                  backgroundColor: isActive ? 'rgba(56, 239, 10, 1)' : 'white',
                  color: isActive ? 'white' : '#374151',
                  boxShadow: isActive ? 'none' : '0px 1px 2px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
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
                    className="material-symbols-rounded"
                    style={{
                      fontSize: '20px',
                      color: isActive ? 'white' : '#374151',
                    }}
                  >
                    ev_charger
                  </span>
                ) : (
                  Icon && (
                    <Icon 
                      style={{
                        width: '20px',
                        height: '20px',
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            let iconName = "";
            if (stat.title === "Total Earnings") {
              iconName = "fluent:arrow-growth-24-filled";
            } else if (stat.title === "Active Chargers") {
              iconName = "material-symbols:ev-charger-rounded";
            } else if (stat.title === "Total Sessions") {
              iconName = "bxs:calendar-check";
            } else if (stat.title === "Host Rating") {
              iconName = "material-symbols-light:star-outline-rounded";
            }
            
            return (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                subtitle={stat.subtitle}
                subtitleColor={
                  stat.subtitle === "All Online" ? "text-green-600" : undefined
                }
                rating={stat.rating}
                icon={iconName}
              />
            );
          })}
        </div>

        {/* Reviews Content */}
<div className="reviews-content-wrapper mb-8">
          {/* Rating Summary */}
          <RatingSummary />
          
          {/* Customer Reviews */}
          <CustomerReviews />
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}

