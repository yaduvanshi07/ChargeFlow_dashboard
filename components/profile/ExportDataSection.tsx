"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import './export-data-section.css';

export default function ExportDataSection() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 Days");
  const [selectedFormat, setSelectedFormat] = useState<"PDF" | "CSV" | null>(null);

  const handleDownload = () => {
    if (!selectedFormat) {
      alert('Please select a file format');
      return;
    }
    alert(`Downloading ${selectedFormat} report for ${selectedTimeRange}`);
  };

  return (
    <div className="export-data-container">
      <div className="export-data-section">
        <h2 className="export-data-title">Export Your Data</h2>

        {/* Time Range Selection */}
        <div className="export-time-range">
          <div className="export-time-range-buttons">
            <button
              type="button"
              onClick={() => setSelectedTimeRange("Last 7 Days")}
              className={`export-time-range-btn ${selectedTimeRange === "Last 7 Days" ? "active" : ""}`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setSelectedTimeRange("Last 30 Days")}
              className={`export-time-range-btn ${selectedTimeRange === "Last 30 Days" ? "active" : ""}`}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => setSelectedTimeRange("Custom Range")}
              className={`export-time-range-btn ${selectedTimeRange === "Custom Range" ? "active" : ""}`}
            >
              Custom Range
            </button>
          </div>
        </div>

        {/* File Format Selection */}
        <div className="export-format-section">
          <label className="export-format-label">Chooses File Format</label>
          <div className="export-format-options">
            <div
              className={`export-format-option ${selectedFormat === "PDF" ? "active" : ""}`}
              onClick={() => setSelectedFormat("PDF")}
            >
              <FileText className="export-format-icon" />
              <span className="export-format-text">PDF</span>
            </div>
            <div
              className={`export-format-option ${selectedFormat === "CSV" ? "active" : ""}`}
              onClick={() => setSelectedFormat("CSV")}
            >
              <FileSpreadsheet className="export-format-icon" />
              <span className="export-format-text">CSV</span>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={!selectedFormat}
          className="export-download-btn"
        >
          Download Report
        </button>
      </div>
    </div>
  );
}