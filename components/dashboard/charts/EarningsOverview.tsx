"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import "./charts.css";

export default function EarningsOverview() {
  const maxY = 80;
  
  // Chart data points - 30 days of data
  const chartData = [
    { value: 20, label: "1" },
    { value: 25, label: "2" },
    { value: 30, label: "3" },
    { value: 35, label: "4" },
    { value: 32, label: "5" },
    { value: 28, label: "6" },
    { value: 25, label: "7" },
    { value: 30, label: "8" },
    { value: 38, label: "9" },
    { value: 42, label: "10" },
    { value: 45, label: "11" },
    { value: 48, label: "12" },
    { value: 44, label: "13" },
    { value: 40, label: "14" },
    { value: 43, label: "15" },
    { value: 47, label: "16" },
    { value: 52, label: "17" },
    { value: 55, label: "18" },
    { value: 58, label: "19" },
    { value: 60, label: "20" },
    { value: 63, label: "21" },
    { value: 65, label: "22" },
    { value: 62, label: "23" },
    { value: 58, label: "24" },
    { value: 60, label: "25" },
    { value: 64, label: "26" },
    { value: 67, label: "27" },
    { value: 70, label: "28" },
    { value: 68, label: "29" },
    { value: 70, label: "30" },
  ];

  // State for tooltip
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate positions for data points
  const getPointPosition = (index: number, value: number) => {
    const x = (index * 600) / (chartData.length - 1);
    const y = 220 - (value / maxY) * 220;
    return { x, y };
  };

  // Handle mouse move over chart
  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const svgX = (mouseX / rect.width) * 600;

    // Find closest data point
    let closestIndex = 0;
    let minDistance = Infinity;

    chartData.forEach((point, index) => {
      const pointPos = getPointPosition(index, point.value);
      const distance = Math.abs(svgX - pointPos.x);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    // Only show if within reasonable distance (30px for more precise selection)
    if (minDistance < 30) {
      setHoveredPoint(closestIndex);
      setTooltipPosition({
        x: mouseX,
        y: mouseY,
      });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleChartMouseLeave = () => {
    setHoveredPoint(null);
  };

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
              {[80, 60, 40, 20, 0].map((value) => (
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
                  cursor: "crosshair",
                }}
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
                onMouseMove={handleChartMouseMove}
                onMouseLeave={handleChartMouseLeave}
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

                {/* Area fill - Straight lines */}
                <path
                  d={`M 0 220 L ${chartData
                    .map((point, i) => {
                      const pos = getPointPosition(i, point.value);
                      return `${pos.x} ${pos.y}`;
                    })
                    .join(" L ")} L 600 220 Z`}
                  fill="url(#areaGradient)"
                />

                {/* Line - Straight lines */}
                <path
                  d={`M ${chartData
                    .map((point, i) => {
                      const pos = getPointPosition(i, point.value);
                      return `${pos.x} ${pos.y}`;
                    })
                    .join(" L ")}`}
                  stroke="#A0FF89"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Hover indicator - vertical line and circle */}
                {hoveredPoint !== null && (
                  <>
                    <line
                      x1={getPointPosition(hoveredPoint, chartData[hoveredPoint].value).x}
                      y1={getPointPosition(hoveredPoint, chartData[hoveredPoint].value).y}
                      x2={getPointPosition(hoveredPoint, chartData[hoveredPoint].value).x}
                      y2="220"
                      stroke="#38EF0A"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                    {/* Hover indicator - circle on point */}
                    <circle
                      cx={getPointPosition(hoveredPoint, chartData[hoveredPoint].value).x}
                      cy={getPointPosition(hoveredPoint, chartData[hoveredPoint].value).y}
                      r="5"
                      fill="#38EF0A"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>

              {/* Tooltip */}
              {hoveredPoint !== null && (
                <div
                  style={{
                    position: "absolute",
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y - 60}px`,
                    transform: "translateX(-50%)",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E5E5",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    pointerEvents: "none",
                    zIndex: 1000,
                    minWidth: "80px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#38EF0A",
                      marginBottom: "2px",
                    }}
                  >
                    ₹{chartData[hoveredPoint].value}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#8E8E93",
                    }}
                  >
                    Day {chartData[hoveredPoint].label}
                  </div>
                  {/* Tooltip arrow */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-6px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: "6px solid #FFFFFF",
                    }}
                  />
                </div>
              )}

              {/* X-axis labels - Show only select days */}
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
                {[
                  chartData[0].label,
                  chartData[Math.floor(chartData.length / 4)].label,
                  chartData[Math.floor(chartData.length / 2)].label,
                  chartData[Math.floor((3 * chartData.length) / 4)].label,
                  chartData[chartData.length - 1].label,
                ].map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
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