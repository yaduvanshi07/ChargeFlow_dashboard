"use client";

import { Plus, Camera, Mail, Crown, CheckCircle, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
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

  const handleEditClick = () => {
    router.push("/dashboard/personal-information");
  };

  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-main">
        {/* Left Side - Profile Avatar and User Info */}
        <div className="dashboard-user-section">
          {/* Profile Avatar with Camera Icon */}
          <div style={{ position: 'relative' }}>
            <div className="dashboard-avatar-container">
              <span className="dashboard-avatar-text">
                {userName.charAt(0)}
              </span>
            </div>
            {/* Camera Icon Overlay */}
            <div className="dashboard-camera-icon">
              <Camera style={{ width: '16px', height: '16px', color: 'white' }} />
            </div>
          </div>

          {/* User Details */}
          <div>
            <h1 className="dashboard-welcome-title">
              Welcome Back, {userName}!
            </h1>
            <div style={{ 
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

        {/* Right Side - Actions */}
        <div className="dashboard-actions">
          {/* Global Status Container */}
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

          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            className="dashboard-edit-button"
            suppressHydrationWarning
          >
            <Edit style={{ width: '16px', height: '16px' }} />
            <span>Edit</span>
          </button>

          {/* Add Charger Button */}
          <button className="dashboard-add-button" suppressHydrationWarning>
            <Plus style={{ width: '20px', height: '20px' }} />
            <span>Add Charger</span>
          </button>
        </div>
      </div>
    </div>
  );
}