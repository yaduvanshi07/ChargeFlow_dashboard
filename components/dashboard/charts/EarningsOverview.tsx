"use client";

import { Download } from "lucide-react";
import "./charts.css";

export default function EarningsOverview() {
  const maxY = 80;

  return (
    <div className="earnings-overview-container">
      <h2 className="earnings-title">Earnings Overview</h2>
      
      <div className="earnings-responsive-grid">
        {/* Last 30 Days Card */}
        <div className="last-30-days-card">
          <p className="last-30-days-title">Last 30 Days</p>
          
          {/* Chart Container */}
          <div className="earnings-chart-container">
            {/* Y-axis labels */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "25px",
              }}
            >
              {[80, 70, 60, 40, 20, 10, 0].map((value) => (
                <span
                  key={value}
                  style={{
                    fontSize: "10px",
                    color: "#8E8E93",
                    textAlign: "right",
                    fontFamily: "sans-serif",
                  }}
                >
                  {value}
                </span>
              ))}
            </div>

            {/* Chart Area */}
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              {/* SVG Chart */}
              <svg
                width="100%"
                height="176px"
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: 0,
                }}
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#A0FF89" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#A0FF89" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <path
                  d={`M 0 220 L 0 ${220 - (20 / maxY) * 220} L 100 ${
                    220 - (35 / maxY) * 220
                  } L 200 ${220 - (25 / maxY) * 220} L 300 ${
                    220 - (45 / maxY) * 220
                  } L 400 ${220 - (40 / maxY) * 220} L 500 ${
                    220 - (60 / maxY) * 220
                  } L 600 ${220 - (70 / maxY) * 220} L 600 220 Z`}
                  fill="url(#areaGradient)"
                />

                {/* Line */}
                <path
                  d={`M 0 ${220 - (20 / maxY) * 220} L 100 ${
                    220 - (35 / maxY) * 220
                  } L 200 ${220 - (25 / maxY) * 220} L 300 ${
                    220 - (45 / maxY) * 220
                  } L 400 ${220 - (40 / maxY) * 220} L 500 ${
                    220 - (60 / maxY) * 220
                  } L 600 ${220 - (70 / maxY) * 220}`}
                  stroke="#A0FF89"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* X-axis labels */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "#8E8E93",
                  fontFamily: "sans-serif",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                }}
              >
                {["201", "201", "200", "200", "201", "201", "200"].map(
                  (label, i) => (
                    <span key={i}>{label}</span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* This Month Card */}
        <div className="this-month-card">
          <p className="this-month-title">This Month</p>
          
          {/* Cards */}
          <div className="earnings-items-container">
            {/* Total Earnings Card */}
            <div className="earning-item">
              <div className="earning-icon-box">
                <img 
                  src="https://api.iconify.design/la:money-bill-wave.svg?color=%2338EF0A"
                  alt=""
                  className="earning-icon"
                />
              </div>
              <div className="earning-details">
                <p className="earning-amount">₹12,450</p>
                <p className="earning-label">Total Earnings</p>
              </div>
            </div>

            {/* After Commission Card */}
            <div className="earning-item">
              <div className="earning-icon-box">
                <img 
                  src="https://api.iconify.design/lineicons:trend-up-1.svg?color=%2338EF0A"
                  alt=""
                  className="earning-icon"
                />
              </div>
              <div className="earning-details">
                <p className="earning-amount">₹10,766</p>
                <p className="earning-label">After Commission</p>
              </div>
            </div>

            {/* Platform Fee Card */}
            <div className="earning-item">
              <div className="earning-icon-box">
                <img 
                  src="https://api.iconify.design/hugeicons:coupon-02.svg?color=%2338EF0A"
                  alt=""
                  className="earning-icon"
                />
              </div>
              <div className="earning-details">
                <p className="earning-amount">₹10,766</p>
                <p className="earning-label">Platform Fee</p>
              </div>
            </div>
          </div>

          {/* Download Invoice Button */}
          <button className="download-invoice-btn">
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}