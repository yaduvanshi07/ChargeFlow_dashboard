"use client";

import { useState, ChangeEvent, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/common/DashboardHeader";
import Footer from "@/components/common/Footer";
import PersonalInformationSection from "@/components/profile/PersonalInformationSection";
import SecuritySection from "@/components/profile/personal/SecuritySection";
import NotificationsSection from "@/components/profile/NotificationsSection";
import ExportDataSection from "@/components/profile/ExportDataSection";
import "@/styles/pages/edit-profile.css";

function ProfilePageContent() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isOnline, setIsOnline] = useState(true);

  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  const handleSave = () => {
    console.log("Saving personal information:", formData);
  };

  const handleToggleStatus = () => {
    setIsOnline(!isOnline);
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "security" || tab === "notifications" || tab === "export" || tab === "personal") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div>
      <DashboardHeader
        userName="John Doe"
        userEmail="john@example.com"
        isOnline={isOnline}
        onToggleStatus={handleToggleStatus}
      />

      <div className="edit-profile-container">
        <div className="edit-profile-content">
          {/* Tabs Navigation */}
          <div className="edit-profile-tabs">
            <button
              className={`edit-profile-tab-btn ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Information
            </button>
            <button
              className={`edit-profile-tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
            <button
              className={`edit-profile-tab-btn ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
            <button
              className={`edit-profile-tab-btn ${activeTab === "export" ? "active" : ""}`}
              onClick={() => setActiveTab("export")}
            >
              Export Data
            </button>
          </div>

          {/* Tab Content */}
          <div className="edit-profile-sections">
            {activeTab === "personal" && (
              <PersonalInformationSection
                formData={formData}
                onInputChange={handleInputChange}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            )}
            {activeTab === "security" && <SecuritySection />}
            {activeTab === "notifications" && <NotificationsSection />}
            {activeTab === "export" && <ExportDataSection />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
