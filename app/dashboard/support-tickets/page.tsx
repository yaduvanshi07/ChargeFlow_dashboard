"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CalendarCheck,
  HandCoins,
  MessageSquare,
  Wallet as WalletIcon,
} from "lucide-react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/common/Navbar";
import DashboardHeader from "@/components/common/DashboardHeader";
import Footer from "@/components/common/Footer";
import { useUser } from "@/contexts/UserContext";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/support-tickets.css";
import "@/components/bookings/bookings.css";
import "@/components/support_ticket/raise-ticket-modal.css";
import RaiseTicketModal from "@/components/support_ticket/RaiseTicketModal";
import GetHelpModal from "@/components/support_ticket/GetHelpModal";
import SupportChatModal from "@/components/support_ticket/SupportChatModal";

// ── Status Badge Components ──────────────────────────────────────────────────

function StatusBadgeInProgress() {
  return (
    <span className="status-badge-inprogress">
      <span className="status-icon">
        <Icon icon="game-icons:sands-of-time" width={17} height={17} />
      </span>
      <span className="status-text">In Progress</span>
    </span>
  );
}

function StatusBadgeOpen() {
  return (
    <span className="status-badge-open">
      <span className="status-icon">
        <Icon icon="mdi:alert" width={16} height={16} />
      </span>
      <span className="status-text">Open</span>
    </span>
  );
}

function StatusBadgeResolved() {
  return (
    <span className="status-badge-resolved">
      <span className="status-icon">
        <Icon icon="mingcute:check-fill" width={14} height={14} />
      </span>
      <span className="status-text">Resolved</span>
    </span>
  );
}

function StatusBadge({ status }: { status: "In Progress" | "Open" | "Resolved" }) {
  if (status === "In Progress") return <StatusBadgeInProgress />;
  if (status === "Open") return <StatusBadgeOpen />;
  return <StatusBadgeResolved />;
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function SupportTicketsPage() {
  const router = useRouter();
  const { userData, getUserFullName, updateUserData } = useUser();
  const [isOnline, setIsOnline] = useState(userData.isOnline);
  const [activeTab, setActiveTab] = useState("Support Tickets");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const tabs = [
    "Overview",
    "My Chargers",
    "Bookings",
    "Earnings",
    "Wallet",
    "Support Tickets",
    "Reviews",
  ];

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

  const tickets: {
    id: string;
    description: string;
    category: string;
    status: "In Progress" | "Open" | "Resolved";
    date: string;
    time: string;
  }[] = [
      {
        id: "TKT-2401",
        description: "Payment deducted but not reflected",
        category: "Payment issue",
        status: "In Progress",
        date: "Feb 15, 2026",
        time: "10:45 AM",
      },
      {
        id: "TKT-2398",
        description: "Charger not starting session",
        category: "Technical issue",
        status: "Open",
        date: "Feb 15, 2026",
        time: "02:15 PM",
      },
      {
        id: "TKT-2395",
        description: "Charging session stopped automatically",
        category: "Charging Error",
        status: "Resolved",
        date: "Feb 14, 2026",
        time: "09:30 AM",
      },
      {
        id: "TKT-2390",
        description: "Unable to login to my account",
        category: "Account problem",
        status: "Open",
        date: "Feb 14, 2026",
        time: "04:20 PM",
      },
      {
        id: "TKT-2391",
        description: "Request for refund of failed charging session",
        category: "Refund Request",
        status: "Resolved",
        date: "Feb 13, 2026",
        time: "11:10 AM",
      },
      {
        id: "TKT-2393",
        description: "Transaction ID not generated after payment",
        category: "Transaction Issue",
        status: "In Progress",
        date: "Feb 13, 2026",
        time: "01:25 PM",
      },
    ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto dashboard-main">
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

          {/* ── Dashboard Tabs ── */}
          <div className="dashboard-tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              const tabIconMap: { [key: string]: React.ComponentType<any> } = {
                Overview: FileText,
                Bookings: CalendarCheck,
                Earnings: HandCoins,
                Wallet: WalletIcon,
                Reviews: MessageSquare,
              };

              const LucideIcon = tabIconMap[tab];
              const isMyChargers = tab === "My Chargers";
              const isSupportTab = tab === "Support Tickets";

              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`dashboard-tab flex items-center gap-1 md:gap-2 font-medium transition-all rounded-lg ${isActive ? "active" : ""
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
                      style={{ color: isActive ? "white" : "#374151" }}
                    >
                      ev_charger
                    </span>
                  ) : isSupportTab ? (
                    <Icon
                      icon="mynaui:ticket"
                      className="w-4 h-4 md:w-6 md:h-6"
                      style={{ color: isActive ? "white" : "#374151" }}
                    />
                  ) : (
                    LucideIcon && (
                      <LucideIcon
                        className="w-4 h-4 md:w-6 md:h-6"
                        style={{ color: isActive ? "white" : "#374151" }}
                      />
                    )
                  )}
                  {tab}
                </button>
              );
            })}
          </div>

          {/* ── Support Tickets Section ── */}
          <section className="support-tickets-wrapper">
            <div className="support-tickets-inner">

              {/* Top Row */}
              <div className="support-top-row">
                <h2 className="support-title">Support Ticket</h2>

                <div className="support-actions">
                  {/* Create New Ticket */}
                  <button
                    className="support-primary-button"
                    aria-label="Create New Ticket"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <span className="btn-icon">
                      <Icon icon="ic:round-plus" width={26} height={26} color="#ffffff" />
                    </span>
                    Create New Ticket
                  </button>

                  {/* Get Help */}
                  <button
                    className="support-secondary-button"
                    aria-label="Get Help"
                    onClick={() => setIsHelpModalOpen(true)}
                  >
                    <span className="btn-icon">
                      <Icon icon="iconoir:headset-help" width={20} height={20} />
                    </span>
                    Get Help
                  </button>
                </div>
              </div>

              {/* Table Section */}
              <div className="support-table-section">
                <h3 className="support-subtitle">My Tickets</h3>

                <div className="support-table-card">
                  <div className="support-table-scroll">
                    <table className="support-table">
                      <thead>
                        <tr>
                          <th>Ticket ID</th>
                          <th>Description</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) => (
                          <tr key={ticket.id}>
                            <td>{ticket.id}</td>
                            <td>{ticket.description}</td>
                            <td>{ticket.category}</td>
                            <td>
                              <StatusBadge status={ticket.status} />
                            </td>
                            <td>{ticket.date}</td>
                            <td>{ticket.time}</td>
                            <td>
                              <button
                                className="support-table-action-button"
                                aria-label={`View ticket ${ticket.id}`}
                              >
                                <span className="action-icon">
                                  <Icon icon="mdi:eye-outline" width={16} height={16} />
                                </span>
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </main>

        <Footer />
      </div>

      <RaiseTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <GetHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onRequestChat={() => setIsChatModalOpen(true)}
      />

      <SupportChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </>
  );
}