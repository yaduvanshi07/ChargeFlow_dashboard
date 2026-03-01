"use client";

import { Plus, Camera, Mail, Crown, CheckCircle, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import "./common.css";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  isOnline: boolean;
  onToggleStatus: any;
}

export default function DashboardHeader({
  userName,
  userEmail,
  isOnline,
  onToggleStatus,
}: DashboardHeaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load saved image on mount
  useEffect(() => {
    const saved = localStorage.getItem("profile-image");
    if (saved) setProfileImage(saved);
  }, []);

  const handleEditClick = () => {
    router.push("/dashboard/personal-information");
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfileImage(dataUrl);
      localStorage.setItem("profile-image", dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-main">
        {/* Left Side - Profile Avatar and User Info */}
        <div className="dashboard-user-section">
          {/* mobile-avatar-row: in desktop = display:contents (transparent),
              in mobile = flex row so avatar + right-controls sit side by side */}
          <div className="mobile-avatar-row">
            {/* Profile Avatar with Camera Icon */}
            <div style={{ position: 'relative' }}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />

              <div className="dashboard-avatar-container">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <span className="dashboard-avatar-text">
                    {userName.charAt(0)}
                  </span>
                )}
              </div>

              {/* Camera Icon Overlay — click to upload */}
              <div
                className="dashboard-camera-icon"
                onClick={handleCameraClick}
                style={{ cursor: 'pointer' }}
                title="Upload profile photo"
              >
                <Camera style={{ width: '16px', height: '16px', color: 'white' }} />
              </div>
            </div>

            {/* Mobile-only: Global Status + Edit icon stacked to the right of avatar.
                On desktop this wrapper is hidden (display:none), controls shown in dashboard-actions */}
            <div className="mobile-right-controls">
              {/* Global Status */}
              <div className="dashboard-status-box">
                <span className="dashboard-status-text">
                  Global Status
                </span>
                <div className="dashboard-status-toggle">
                  <span className="dashboard-status-value">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                  <button
                    onClick={onToggleStatus}
                    className="dashboard-toggle-button"
                    style={{
                      backgroundColor: isOnline ? '#38EF0A' : '#E5E5EA',
                    }}
                    suppressHydrationWarning
                  >
                    <span
                      className="dashboard-toggle-circle"
                      style={{
                        transform: isOnline ? 'translateX(19px)' : 'translateX(3px)',
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Edit Button — icon only on mobile */}
              <button
                onClick={handleEditClick}
                className="dashboard-edit-button"
                suppressHydrationWarning
              >
                <Edit style={{ width: '16px', height: '16px' }} />
                <span className="edit-text-label">Edit</span>
              </button>
            </div>
          </div>

          {/* User Details */}
          <div>
            <h1 className="dashboard-welcome-title">
              Welcome Back, {userName}!
            </h1>
            <div className="dashboard-email-row" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <Mail style={{ width: '16px', height: '16px', color: '#34C759' }} />
              <p style={{
                fontSize: '14px',
                color: '#8E8E93',
                margin: '0',
              }}>
                {userEmail}
              </p>
            </div>

            {/* Badges */}
            <div className="dashboard-badges-container">
              {/* Premium Host Badge */}
              <span
                className="dashboard-badge"
                style={{
                  background: 'rgba(255, 251, 235, 1)',
                  color: '#FF9500',
                }}
              >
                <Crown style={{ width: '14px', height: '14px' }} />
                Premium Host
              </span>

              {/* Verified Badge */}
              <span
                className="dashboard-badge"
                style={{
                  background: 'rgba(150, 255, 123, 0.29)',
                  color: '#34C759',
                }}
              >
                <CheckCircle style={{ width: '14px', height: '14px' }} />
                Verified
              </span>

              {/* Trusted Host Badge */}
              <span
                className="dashboard-badge"
                style={{
                  background: 'rgba(59, 130, 246, 0.19)',
                  color: '#2196F3',
                }}
              >
                <span
                  className="codicon codicon-workspace-trusted"
                  style={{
                    fontSize: '14px',
                    display: 'inline-block',
                    color: '#2196F3',
                    opacity: 1,
                  }}
                />
                Trusted Host
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Actions (desktop: all three; mobile: only Add Charger) */}
        <div className="dashboard-actions">
          {/* Global Status — desktop only (mobile version is inside mobile-right-controls) */}
          <div className="dashboard-status-box desktop-only-control">
            <span className="dashboard-status-text">
              Global Status
            </span>
            <div className="dashboard-status-toggle">
              <span className="dashboard-status-value">
                {isOnline ? "Online" : "Offline"}
              </span>
              <button
                onClick={onToggleStatus}
                className="dashboard-toggle-button"
                style={{
                  backgroundColor: isOnline ? '#38EF0A' : '#E5E5EA',
                }}
                suppressHydrationWarning
              >
                <span
                  className="dashboard-toggle-circle"
                  style={{
                    transform: isOnline ? 'translateX(19px)' : 'translateX(3px)',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Edit Button — desktop only */}
          <button
            onClick={handleEditClick}
            className="dashboard-edit-button desktop-only-control"
            suppressHydrationWarning
          >
            <Edit style={{ width: '16px', height: '16px' }} />
            <span>Edit</span>
          </button>

          {/* Add Charger Button — always visible */}
          <button className="dashboard-add-button" suppressHydrationWarning>
            <Plus style={{ width: '20px', height: '20px' }} />
            <span>Add Charger</span>
          </button>
        </div>
      </div>
    </div>
  );
}
