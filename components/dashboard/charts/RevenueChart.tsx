"use client";

import { useState, useEffect } from "react";
import "./charts.css";

interface RevenueChartProps {
  data: { day: string; value: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Chart dimensions - responsive
  const getChartDimensions = () => {
    if (typeof window === 'undefined') {
      // Default dimensions for SSR
      return { width: 600, height: 250, padding: { top: 20, right: 20, bottom: 40, left: 50 } };
    }
    
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile) {
      return { width: 400, height: 180, padding: { top: 15, right: 15, bottom: 30, left: 35 } };
    } else if (isTablet) {
      return { width: 500, height: 220, padding: { top: 18, right: 18, bottom: 35, left: 45 } };
    }
    return { width: 600, height: 250, padding: { top: 20, right: 20, bottom: 40, left: 50 } };
  };

  const [isMounted, setIsMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 250, padding: { top: 20, right: 20, bottom: 40, left: 50 } });

  useEffect(() => {
    setIsMounted(true);
    setDimensions(getChartDimensions());
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      // Debounce resize to prevent excessive recalculations
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDimensions(getChartDimensions());
      }, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const { width, height, padding } = dimensions;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Y-axis values (3h to 8h)
  const yAxisValues = [3, 4, 5, 6, 7, 8];
  const minY = 3;
  const maxY = 8;
  const yRange = maxY - minY;

  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = padding.left + (i * chartWidth) / (data.length - 1);
    const y = padding.top + chartHeight - ((d.value - minY) / yRange) * chartHeight;
    return { x, y, value: d.value };
  });

  // Create path for the line
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Create path for the filled area (line + bottom corners)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div className="revenue-chart-container w-full">
      {isMounted && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="revenue-chart-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis grid lines and labels */}
          {yAxisValues.map((value, i) => {
            const y = padding.top + chartHeight - ((value - minY) / yRange) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#6b7280"
                  className="revenue-chart-text"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {value}h
                </text>
              </g>
            );
          })}

          {/* Filled area beneath the line */}
          <path
            d={areaPath}
            fill="rgba(59, 130, 246, 0.2)"
          />

          {/* Chart line */}
          <path
            d={linePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points (blue circles) */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              className="revenue-chart-circle"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Green highlight dot above Thursday (index 3) */}
          {points[3] && (
            <circle
              cx={points[3].x}
              cy={padding.top + chartHeight - ((7 - minY) / yRange) * chartHeight}
              className="revenue-chart-circle"
              fill="#34C759"
              stroke="white"
              strokeWidth="2"
            />
          )}

          {/* X-axis labels */}
          {data.map((d, i) => {
            const x = padding.left + (i * chartWidth) / (data.length - 1);
            return (
              <text
                key={i}
                x={x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fill="#6b7280"
                className="revenue-chart-text"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {d.day}
              </text>
            );
          })}
        </svg>
      )}
    </div>
  );
}

