import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Zap, Plug, IndianRupee, Star, ChevronDown, Download } from "lucide-react";
import "./stats.css";

interface ChargerCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  chargingSpeed: string;
  connectorType: string;
  pricePerKWh: string;
  utilization: number;
  rating: number;
  sessions: number;
  isOnline: boolean;
  type: string;
  status: string;
  power?: number;
  onEdit?: (charger: ChargerCardProps) => void;
}

export default function ChargerCard({
  id,
  name,
  location,
  image,
  chargingSpeed,
  connectorType,
  pricePerKWh,
  utilization,
  rating,
  sessions,
  isOnline,
  type,
  status,
  power,
  onEdit,
}: ChargerCardProps) {
  const [selectedStatus, setSelectedStatus] = useState<"online" | "offline" | "maintenance">(isOnline ? "online" : "offline");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [appealText, setAppealText] = useState("");

  // Check if charger is blocked
  const isBlocked = status === "BLOCKED";

  // Create an array of 3 images for carousel
  const allImages = ['/ch.jpg', '/ev.avif', '/evch.jpg'];
  const otherImages = allImages.filter(img => img !== image);
  const images = [
    image,
    ...(otherImages.length >= 2
      ? otherImages.slice(0, 2)
      : [...otherImages, ...allImages].slice(0, 2)),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle ESC key to close blocked modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsBlockedModalOpen(false);
      }
    };

    if (isBlockedModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isBlockedModalOpen]);

  const statusConfig = {
    online: {
      color: isBlocked ? "rgba(41, 182, 5, 0.14)" : "rgba(56, 239, 10, 1)",
      label: "Online",
      icon: "meteocons:lightning-bolt"
    },
    offline: { color: "#FF3B30", label: "Offline", icon: "mdi:wifi-off" },
    maintenance: { color: "#FF9500", label: "Maintenance", icon: "mdi:wrench" },
  };

  const handleStatusChange = (status: "online" | "offline" | "maintenance") => {
    if (!isBlocked) {
      setSelectedStatus(status);
      setIsDropdownOpen(false);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit({
        id,
        name,
        location,
        image,
        chargingSpeed,
        connectorType,
        pricePerKWh,
        utilization,
        rating,
        sessions,
        isOnline,
        type,
        status,
        power,
      });
    }
  };

  return (
    <div className={`charger-card ${isBlocked ? 'blocked' : ''}`}>
      {/* Header with Block/Alert and Status/Edit Controls */}
      <div className="charger-card-header">

        {/* Left side - Block and Alert buttons (only when blocked) */}
        {isBlocked && (
          <div className="left-controls">
            {/* Block Pill */}
            <div className="block-pill">
              <img
                src="https://api.iconify.design/bx:block.svg?color=white"
                alt="Block"
                style={{ width: "16px", height: "16px" }}
              />
              <span>Block</span>
            </div>

            {/* Alert Button */}
            <button
              className="alert-button"
              onClick={() => setIsBlockedModalOpen(true)}
            >
              <img
                src="https://api.iconify.design/mdi:alert-circle-outline.svg?color=%23FA2023"
                alt="Alert"
                style={{ width: "16px", height: "16px" }}
              />
            </button>
          </div>
        )}

        {/* Right side - Status Dropdown and Edit Icon (always visible) */}
        <div className="right-controls">
          {/* Status Dropdown */}
          <div className="status-dropdown-container">
            <button
              onClick={() => !isBlocked && setIsDropdownOpen(!isDropdownOpen)}
              className={`status-dropdown-button ${isBlocked ? 'disabled' : ''}`}
              disabled={isBlocked}
              style={{
                backgroundColor: statusConfig[selectedStatus].color,
                cursor: isBlocked ? 'not-allowed' : 'pointer',
              }}
            >
              <img
                src={`https://api.iconify.design/${statusConfig[selectedStatus].icon}.svg?color=white`}
                alt={statusConfig[selectedStatus].label}
                style={{ width: "14px", height: "14px" }}
              />
              <span>{statusConfig[selectedStatus].label}</span>
              <ChevronDown
                style={{
                  width: "0.875rem",
                  height: "0.875rem",
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && !isBlocked && (
              <div className="status-dropdown-menu">
                {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`status-dropdown-option ${selectedStatus === status ? 'selected' : ''}`}
                    style={{
                      color: statusConfig[status].color,
                    }}
                  >
                    <span
                      style={{
                        width: "0.5rem",
                        height: "0.5rem",
                        borderRadius: "50%",
                        backgroundColor: statusConfig[status].color,
                      }}
                    />
                    {statusConfig[status].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Edit Icon */}
          <button
            className="charger-card-edit-btn"
            onClick={handleEditClick}
          >
            <img
              src="https://api.iconify.design/material-symbols:edit-outline.svg?color=%238E8E93"
              alt="Edit"
              style={{ width: "20px", height: "20px" }}
            />
          </button>
        </div>
      </div>

      {/* Charger Image Carousel */}
      <div className="charger-card-image" style={{ position: "relative" }}>
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: index === currentImageIndex ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            <Image
              src={img}
              alt={`${name} - Image ${index + 1}`}
              fill
              className="object-cover"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="charger-card-content">
        {/* Charger Name */}
        <h3 className="charger-card-name">
          {name}
        </h3>

        {/* Details Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div>
              <MapPin className="charger-card-icon" style={{ color: "#2EDE02" }} />
            </div>
            <span className="charger-card-detail">
              {location}
            </span>
          </div>

          {/* Charging Speed */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="icon-circle">
              <Zap className="charger-card-icon" style={{ color: "#2EDE02" }} />
            </div>
            <span className="charger-card-detail">
              {chargingSpeed}
            </span>
          </div>

          {/* Connector Type */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="icon-circle">
              <Plug className="charger-card-icon" style={{ color: "#2EDE02" }} />
            </div>
            <span className="charger-card-detail">
              {connectorType}
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="icon-circle">
              <IndianRupee className="charger-card-icon" style={{ color: "#2EDE02" }} />
            </div>
            <span className="charger-card-detail">
              {pricePerKWh}
            </span>
          </div>
        </div>

        {/* Metrics Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: "1px solid #E5E5EA",
          }}
        >
          {/* Utilization */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <p className="charger-card-metric-value" style={{
              margin: 0,
              marginBottom: "4px",
            }}>
              {utilization}%
            </p>
            <p className="charger-card-metric-label" style={{
              margin: 0,
            }}>
              Utilization
            </p>
          </div>

          {/* Rating */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <p className="charger-card-metric-value" style={{
              margin: 0,
              marginBottom: "4px",
            }}>
              {rating.toFixed(1)}
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
            }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="charger-card-icon"
                  style={{
                    color:
                      i < Math.floor(rating)
                        ? "#FFD700"
                        : i < rating
                          ? "#FFD70080"
                          : "#E5E5EA",
                    fill:
                      i < Math.floor(rating)
                        ? "#FFD700"
                        : i < rating
                          ? "#FFD70080"
                          : "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sessions */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <p className="charger-card-metric-value" style={{
              margin: 0,
              marginBottom: "4px",
            }}>
              {sessions}
            </p>
            <p className="charger-card-metric-label" style={{
              margin: 0,
            }}>
              Sessions
            </p>
          </div>
        </div>
      </div>

      {/* Blocked Charger Modal */}
      {isBlocked && isBlockedModalOpen && (
        <div className="blocked-modal-overlay" onClick={() => setIsBlockedModalOpen(false)}>
          <div className="blocked-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="blocked-modal-header">
              <div className="blocked-modal-title-wrapper">
                <div className="blocked-modal-icon-wrapper">
                  <img
                    src="/warning-icon.png"
                    alt="Warning"
                  />
                </div>
                <div>
                  <h2 className="blocked-modal-title">Charger Blocked</h2>
                  <p className="blocked-modal-subtitle">Temporary Suspension</p>
                </div>
              </div>
              <button
                className="blocked-modal-close"
                onClick={() => setIsBlockedModalOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="blocked-modal-content">
              {/* Reason for blocking */}
              <div className="blocked-modal-section">
                <div className="blocked-modal-reason">
                  <span style={{ fontWeight: 500, fontSize: '20px', color: '#000000' }}>Reason for Blocking: </span>Your charger has been blocked due to repeated customer complaints regarding damaged connectors and safety concerns. this violates our platform's quality standards.
                </div>
              </div>

              {/* Actions Required */}
              <div className="blocked-modal-section">
                <h3 className="blocked-modal-section-title">Actions Required:</h3>
                <ul className="blocked-modal-actions">
                  <li>Read full details (Download Report).</li>
                  <li>Fix the technical issues.</li>
                  <li>Submit details below.</li>
                </ul>
              </div>

              {/* Download Report Button */}
              <button className="blocked-modal-download-btn">
                <Download size={16} />
                Download Report (PDF)
              </button>

              {/* Appeal Text Area */}
              <div className="blocked-modal-section">
                <p style={{ marginBottom: '8px', fontSize: '14px', color: '#1C1C1E' }}>
                  Please describe the repairs and actions you have taken in 50-150 words or less for unblocking.
                </p>
                <textarea
                  className="blocked-modal-textarea"
                  placeholder="Enter Details About The Fix Here... (50-150 Words)"
                  value={appealText}
                  onChange={(e) => setAppealText(e.target.value)}
                />
                <div className="blocked-modal-textarea-info" style={{ color: (appealText.trim().split(/\s+/).filter(w => w.length > 0).length < 50 || appealText.trim().split(/\s+/).filter(w => w.length > 0).length > 150) ? '#FF3B30' : '#8E8E93' }}>
                  <span>{appealText.trim().split(/\s+/).filter(w => w.length > 0).length}</span> / 150 words
                </div>
              </div>

              {/* Visual Evidence */}
              <div className="blocked-modal-section">
                <h3 className="blocked-modal-section-title">Visual Evidence Of Repair</h3>
                <p style={{ marginBottom: '16px', fontSize: '14px', color: '#48484A', lineHeight: '1.5' }}>
                  Please Upload Clear Photos Showing The Condition Of The Connector Before And After The Repair
                </p>
                <div className="blocked-modal-uploads">
                  <div className="blocked-modal-upload">
                    <div className="blocked-modal-upload-box">
                      <img
                        src="https://api.iconify.design/f7:camera-fill.svg?color=%238E8E93"
                        alt="Camera"
                        className="blocked-modal-upload-icon"
                      />
                      <span className="blocked-modal-upload-text">Before Photo / Video (Damage)</span>
                    </div>
                  </div>
                  <div className="blocked-modal-upload">
                    <div className="blocked-modal-upload-box">
                      <img
                        src="https://api.iconify.design/f7:camera-fill.svg?color=%2338EF0A"
                        alt="Camera"
                        className="blocked-modal-upload-icon"
                      />
                      <span className="blocked-modal-upload-text">After Photo / Video (Fix)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button className="blocked-modal-submit-btn">
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}