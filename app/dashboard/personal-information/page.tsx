"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { User, Shield, Bell, Download, FileText, Edit } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import DashboardHeader from "@/components/common/DashboardHeader";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect, Suspense } from "react";
import PersonalInformationSection from "@/components/profile/PersonalInformationSection";
import KYCVerificationSection from "@/components/profile/KYCVerificationSection";
import SecuritySection from "@/components/profile/personal/SecuritySection";
import NotificationsSection from "@/components/profile/NotificationsSection";
import ExportDataSection from "@/components/profile/ExportDataSection";
import "./personal-information.css";

function PersonalInformationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData, getUserFullName, updateUserData } = useUser();
  const [isOnline, setIsOnline] = useState(userData.isOnline);
  const [activeTab, setActiveTab] = useState("personal");

  const handleEditClick = () => {
    router.push("/dashboard/edit-profile");
  };

  // Handle URL parameter changes
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "security" || tab === "notifications" || tab === "export" || tab === "personal" || tab === "kyc") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const goToProfileTab = (tab: string) => {
    setActiveTab(tab);
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <>
            {/* Header with Title and Edit Button */}
            <div className="personal-info-header">
              <h2 className="personal-info-title">Personal Information</h2>
              <button
                onClick={handleEditClick}
                className="personal-info-edit-button"
                suppressHydrationWarning
              >
                <Edit className="personal-info-edit-icon" />
                <span>Edit</span>
              </button>
            </div>

            {/* Read-only Information Fields */}
            <div className="personal-info-grid">
              <div className="personal-info-field">
                <label className="personal-info-label">First Name</label>
                <input
                  type="text"
                  value={userData.firstName || ""}
                  readOnly
                  className="personal-info-input-readonly"
                  suppressHydrationWarning
                />
              </div>

              <div className="personal-info-field">
                <label className="personal-info-label">Last Name</label>
                <input
                  type="text"
                  value={userData.lastName || ""}
                  readOnly
                  className="personal-info-input-readonly"
                  suppressHydrationWarning
                />
              </div>

              <div className="personal-info-field">
                <label className="personal-info-label">Email</label>
                <input
                  type="email"
                  value={userData.email || ""}
                  readOnly
                  className="personal-info-input-readonly"
                  suppressHydrationWarning
                />
              </div>

              <div className="personal-info-field">
                <label className="personal-info-label">Phone</label>
                <input
                  type="tel"
                  value={userData.phone || ""}
                  readOnly
                  className="personal-info-input-readonly"
                  suppressHydrationWarning
                />
              </div>

              <div className="personal-info-field">
                <label className="personal-info-label">Date Of Birth</label>
                <input
                  type="text"
                  value={userData.dateOfBirth || ""}
                  readOnly
                  className="personal-info-input-readonly"
                  suppressHydrationWarning
                />
              </div>

              <div className="personal-info-field">
                <label className="personal-info-label">Gender</label>
                <input
                  type="text"
                  value={userData.gender || ""}
                  readOnly
                  className="personal-info-input-readonly"
                  suppressHydrationWarning
                />
              </div>

              <div className="personal-info-field full-width">
                <label className="personal-info-label">Address</label>
                <input
                  type="text"
                  value={userData.address || ""}
                  readOnly
                  className="personal-info-input-readonly"
                  suppressHydrationWarning
                />
              </div>
            </div>
          </>
        );
      case "kyc":
        return <KYCVerificationSection />;
      case "security":
        return <SecuritySection />;
      case "notifications":
        return <NotificationsSection />;
      case "export":
        return <ExportDataSection />;
      default:
        return null;
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

          {/* Main Content */}
          <div className="personal-info-main-content">
            {/* Sidebar */}
            <div className="personal-info-sidebar">
              <div
                className={`personal-info-sidebar-item ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => goToProfileTab('personal')}
                role="button"
                tabIndex={0}
                suppressHydrationWarning
              >
                <User style={{ width: '20px', height: '20px' }} />
                Personal Information
              </div>
              <div
                className={`personal-info-sidebar-item ${activeTab === 'kyc' ? 'active' : ''}`}
                onClick={() => goToProfileTab('kyc')}
                role="button"
                tabIndex={0}
                suppressHydrationWarning
              >
                <FileText style={{ width: '20px', height: '20px' }} />
                KYC Verification
              </div>
              <div
                className={`personal-info-sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => goToProfileTab('security')}
                role="button"
                tabIndex={0}
                suppressHydrationWarning
              >
                <Shield style={{ width: '20px', height: '20px' }} />
                Security
              </div>
              <div
                className={`personal-info-sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => goToProfileTab('notifications')}
                role="button"
                tabIndex={0}
                suppressHydrationWarning
              >
                <Bell style={{ width: '20px', height: '20px' }} />
                Notifications
              </div>
              <div
                className={`personal-info-sidebar-item ${activeTab === 'export' ? 'active' : ''}`}
                onClick={() => goToProfileTab('export')}
                role="button"
                tabIndex={0}
                suppressHydrationWarning
              >
                <Download style={{ width: '20px', height: '20px' }} />
                Export Data
              </div>
            </div>

            {/* Content Container */}
            <div className="personal-info-content-container">
              {renderContent()}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default function PersonalInformationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonalInformationContent />
    </Suspense>
  );
}