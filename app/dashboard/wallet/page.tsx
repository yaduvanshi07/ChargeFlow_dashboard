"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Clock,
  IndianRupee,
  Users,
  Star,
  TrendingUp,
  FileText,
  CalendarCheck,
  HandCoins,
  MessageSquare,
  Plus,
  AlignJustify,
  Wallet,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import DashboardHeader from "@/components/common/DashboardHeader";
import StatsCard from "@/components/dashboard/stats/StatsCard";
import Footer from "@/components/common/Footer";
import { statsData } from "@/lib/mockData";
import { useUser } from "@/contexts/UserContext";
import "@/styles/pages/wallet.css";

export default function WalletPage() {
  const router = useRouter();
  const { userData, getUserFullName, updateUserData } = useUser();
  const [isOnline, setIsOnline] = useState(userData.isOnline);
  const [activeTab, setActiveTab] = useState("Wallet");

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
      setActiveTab(tab);
    } else if (tab === "Reviews") {
      router.push("/dashboard/reviews");
    } else {
      setActiveTab(tab);
    }
  };

  const transactions = [
    { date: "2025-07-10", description: "Booking Payment - Honda Accord", amount: "₹450" },
    { date: "2025-07-05", description: "Booking Payment - Ford Explorer", amount: "₹500" },
    { date: "2025-06-28", description: "Booking Payment - Toyota Camry", amount: "₹400" },
    { date: "2025-06-20", description: "Booking Payment - Honda Accord", amount: "₹399" },
    { date: "2025-06-15", description: "Booking Payment - Ford Explorer", amount: "₹500" },
  ];

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
              "Reviews": MessageSquare,
            };
            const Icon = iconMap[tab];
            const isMyChargers = tab === "My Chargers";
            const isWallet = tab === "Wallet";
            
            return (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className="dashboard-tab flex items-center gap-1 md:gap-2 font-medium transition-all rounded-lg"
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
                ) : isWallet ? (
                  <Wallet 
                    style={{
                      width: '20px',
                      height: '20px',
                      color: isActive ? 'white' : '#374151',
                    }}
                  />
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

          {/* Wallet Content */}
          <div className="wallet-container">
            {/* Wallet Section */}
            <div className="wallet-section">
              <h2 className="wallet-section-title">Wallet Section</h2>
              <div className="wallet-card">
                {/* Horizontal layout: Icon on left, text on right */}
                <div className="wallet-balance-container">
                  {/* Wallet Icon */}
                  <div className="wallet-icon-wrapper">
                    <Wallet 
                      className="wallet-icon"
                      style={{
                        width: '36px',
                        height: '36px',
                        color: 'white',
                      }}
                    />
                  </div>
                  {/* Text Content */}
                  <div className="wallet-text-content">
                    <div className="wallet-balance-label">Available Balance</div>
                    <div className="wallet-balance-value">₹2,450</div>
                  </div>
                </div>
                {/* Add Money Button - Aligned with text */}
                <button className="wallet-add-money-btn">
                  <Plus style={{ width: '28px', height: '28px'}} />
                  Add Money
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="transaction-history-section">
              <h2 className="transaction-history-title">Transaction History</h2>
              <div className="transaction-table-wrapper">
                <div className="transaction-table">
                  <div className="transaction-table-header">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Amount</div>
                  </div>
                  {transactions.map((transaction, index) => (
                    <div key={index} className="transaction-table-row">
                      <span className="transaction-date">{transaction.date}</span>
                      <span className="transaction-description">{transaction.description}</span>
                      <span 
                        className="transaction-amount"
                        style={{
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          color: '#364153',
                        }}
                      >
                        {transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}