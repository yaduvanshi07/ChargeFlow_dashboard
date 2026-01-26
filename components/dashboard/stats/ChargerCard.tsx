"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Zap, Plug, IndianRupee, Star } from "lucide-react";
import "./stats.css";

interface ChargerCardProps {
  id: number;
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
}

export default function ChargerCard({
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
}: ChargerCardProps) {
  const [onlineStatus, setOnlineStatus] = useState(isOnline);
  
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

  return (
    <div className="charger-card">
      {/* Header with Online Status and Edit Icon */}
      <div className="charger-card-header">
        {/* Online Status - NO BOX */}
        <div className="charger-card-status">
          <span 
            className="charger-card-status-text" 
            style={{
              color: onlineStatus ? "rgba(56, 239, 10, 1)" : "#8E8E93",
            }}
          >
            {onlineStatus ? "Online" : "Offline"}
          </span>
          <button
            onClick={() => setOnlineStatus(!onlineStatus)}
            className="relative inline-flex h-4 w-7 md:h-5 md:w-9 items-center rounded-full transition-colors"
            style={
              onlineStatus
                ? { backgroundColor: "rgba(56, 239, 10, 1)" }
                : { backgroundColor: "#E5E5EA" }
            }
          >
            <span
              className={`inline-block h-3 w-3 md:h-3.5 md:w-3.5 transform rounded-full bg-white transition-transform ${
                onlineStatus ? "translate-x-4 md:translate-x-5" : "translate-x-0.5 md:translate-x-1"
              }`}
              style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)" }}
            />
          </button>
        </div>

        {/* Edit Icon */}
        <button className="charger-card-edit-btn">
          <img 
            src="https://api.iconify.design/material-symbols:edit-outline.svg?color=%238E8E93"
            alt="Edit"
            style={{ width: "20px", height: "20px" }}
          />
        </button>
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
              {rating}
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