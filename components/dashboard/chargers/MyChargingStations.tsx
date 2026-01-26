"use client";

import ChargerCard from "../stats/ChargerCard";
import { Plus } from "lucide-react";
import { chargerData } from "@/lib/mockData";
import "./chargers.css";

export default function MyChargingStations() {
  return (
    <div className="charging-stations-container">
      {/* Header */}
      <div className="charging-stations-header">
        <h2 className="charging-stations-title">
          My Charging Stations
        </h2>
        <button 
          className="charging-stations-add-btn"
          onMouseDown={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <Plus className="charging-stations-add-btn-icon" />
          <span className="add-charger-text">Add Charger</span>
        </button>
      </div>

      {/* Charger Cards Grid */}
      <div className="charging-stations-grid">
        {chargerData.map((charger) => (
          <ChargerCard key={charger.id} {...charger} />
        ))}
      </div>
    </div>
  );
}

