"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Zap, Plug, IndianRupee, Star, ChevronDown, Bell, BellOff } from "lucide-react";
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
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Create an array of 3 images for the carousel
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

  const statusConfig = {
    online: { color: "rgba(56, 239, 10, 1)", label: "Online" },
    offline: { color: "#FF3B30", label: "Offline" },
    maintenance: { color: "#FF9500", label: "Maintenance" },
  };

  const handleStatusChange = (status: "online" | "offline" | "maintenance") => {
    if (!isAlertActive) {
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
        onEdit
      });
    }
  };

  return (
    <div className="charger-card">
      {/* Header with Alert Button, Status Dropdown, and Edit Icon */}
      <div className="charger-card-header">
        {/* Alert Button */}
        <button
          onClick={() => {
            setIsAlertActive(!isAlertActive);
            if (!isAlertActive) {
              setIsDropdownOpen(false);
            }
          }}
          className={`alert-button ${isAlertActive ? 'active' : ''}`}
        >
          {isAlertActive ? (
            <Bell style={{ width: "1rem", height: "1rem" }} />
          ) : (
            <BellOff style={{ width: "1rem", height: "1rem" }} />
          )}
        </button>

        <div className="charging-stations-controls">
          {/* Status Dropdown */}
          <div className="status-dropdown-container">
            <button
              onClick={() => !isAlertActive && setIsDropdownOpen(!isDropdownOpen)}
              className="status-dropdown-button"
              style={{
                backgroundColor: statusConfig[selectedStatus].color,
                opacity: isAlertActive ? 0.5 : 1,
              }}
              disabled={isAlertActive}
            >
              <span>{statusConfig[selectedStatus].label}</span>
              <ChevronDown
                style={{
                  width: "1rem",
                  height: "1rem",
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && !isAlertActive && (
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
    </div>
  );
}