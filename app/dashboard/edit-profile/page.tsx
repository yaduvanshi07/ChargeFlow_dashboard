"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { User, Shield, Bell, Download, Camera, Mail, Crown, CheckCircle } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useUser } from "@/contexts/UserContext";
import PersonalInformationSection from "@/components/profile/PersonalInformationSection";
import SecuritySection from "@/components/profile/personal/SecuritySection";
import NotificationsSection from "@/components/profile/NotificationsSection";
import ExportDataSection from "@/components/profile/ExportDataSection";

export default function EditProfilePage() {
  const router = useRouter();
  const { userData, updateUserData, getUserFullName } = useUser();
  
  const [activeSection, setActiveSection] = useState("Personal Information");
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    dateOfBirth: userData.dateOfBirth,
    gender: userData.gender,
    address: userData.address,
  });


  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      address: userData.address,
    });
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      alert("First Name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      alert("Last Name is required");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      alert("Valid Email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      alert("Phone is required");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    updateUserData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
    });

    router.push("/dashboard/personal-information");
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      address: userData.address,
    });
    router.push("/dashboard/personal-information");
  };

  const fullName = getUserFullName();
  const firstNameInitial = userData.firstName.charAt(0).toUpperCase();

  return (
    <>
      <div className="profile-page-container">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Banner */}
          <div className="profile-welcome-banner">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {firstNameInitial}
              </div>
              <div className="profile-camera-icon">
                <Camera style={{ width: '16px', height: '16px', color: 'white' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'rgba(41, 205, 0, 1)',
                marginBottom: '8px',
                marginTop: 0,
              }}>
                Welcome Back, {fullName}!
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}>
                <Mail style={{ width: '16px', height: '16px', color: '#34C759' }} />
                <span style={{ fontSize: '14px', color: '#8E8E93' }}>
                  {userData.email}
                </span>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                <span className="profile-badge profile-badge-premium">
                  <Crown style={{ width: '14px', height: '14px' }} />
                  Premium Host
                </span>
                <span className="profile-badge profile-badge-verified">
                  <CheckCircle style={{ width: '14px', height: '14px' }} />
                  Verified
                </span>
                <span className="profile-badge profile-badge-trusted">
                  <span className="codicon codicon-workspace-trusted" style={{ fontSize: '14px' }} />
                  Trusted Host
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-main-content">
            <div style={{ marginBottom: 16 }}>
              <button
                type="button"
                className="profile-back-btn"
                onClick={() => router.back()}
              >
                <Icon icon="mdi:arrow-left" width={16} height={16} style={{ marginRight: 8 }} />
                Back
              </button>
            </div>

            {/* Content Container - Conditional Rendering */}
            <div className="profile-form-container">
              {activeSection === "Personal Information" && (
                <PersonalInformationSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  onCancel={handleCancel}
                  onSave={handleSave}
                />
              )}

              {activeSection === "Security" && (
                <SecuritySection />
              )}

              {activeSection === "Notifications" && (
                <NotificationsSection />
              )}

              {activeSection === "Export Data" && (
                <ExportDataSection />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
