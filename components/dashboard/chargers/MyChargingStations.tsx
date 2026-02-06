"use client";

import { useState, useEffect } from "react";
import ChargerCard from "../stats/ChargerCard";
import AddChargerForm from "./AddChargerForm";
import EditChargerForm from "./EditChargerForm";
import { Plus } from "lucide-react";
import { chargersAPI } from "@/lib/api";
import "./chargers.css";

interface ChargerData {
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
}

export default function MyChargingStations() {
  const [chargers, setChargers] = useState<ChargerData[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingCharger, setEditingCharger] = useState<ChargerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch chargers from backend
  const fetchChargers = async () => {
    try {
      setLoading(true);
      const response = await chargersAPI.getChargers(1, 50); // Fetch up to 50 chargers

      // Transform backend data to match ChargerCard interface
      const transformedChargers = response.chargers.map((charger: any, index: number) => {
        // Determine charging speed string based on type and power
        let chargingSpeed = "";
        switch (charger.type) {
          case "AC":
            chargingSpeed = `AC Standard - ${charger.power}KW`;
            break;
          case "AC_FAST":
            chargingSpeed = `AC Fast - ${charger.power}KW`;
            break;
          case "DC":
            chargingSpeed = `DC Standard - ${charger.power}KW`;
            break;
          case "DC_FAST":
            chargingSpeed = `DC Fast - ${charger.power}KW`;
            break;
          default:
            chargingSpeed = `${charger.power}KW`;
        }

        // Default connector type based on charger type
        let connectorType = "Type 2";
        if (charger.type.includes("DC")) {
          connectorType = "CCS2 + CHAdeMO";
        }

        // Generate price based on power (higher power = higher price)
        let pricePerKWh = "₹12/KWh";
        if (charger.power >= 150) {
          pricePerKWh = "₹22/KWh";
        } else if (charger.power >= 50) {
          pricePerKWh = "₹18/KWh";
        }

        // Select image based on charger type
        let image = "/ev.avif";
        if (charger.type.includes("DC")) {
          image = charger.power >= 150 ? "/evch.jpg" : "/ch.jpg";
        }

        // Mock blocked status for the second charger (index 1)
        const status = index === 1 ? "BLOCKED" : (charger.status || "ONLINE");

        return {
          id: charger._id || charger.id,
          name: charger.name,
          location: charger.location,
          image: image,
          chargingSpeed: chargingSpeed,
          connectorType: connectorType,
          pricePerKWh: pricePerKWh,
          utilization: charger.utilization || 0,
          rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0 for demo
          sessions: charger.totalSessions || 0,
          isOnline: status === "ONLINE", // Use the derived status
          type: charger.type,
          status: status, // Use the derived status
          power: charger.power,
        };
      });

      setChargers(transformedChargers);
    } catch (error) {
      console.error("Error fetching chargers:", error);
      // Fallback to empty array on error
      setChargers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chargers on component mount
  useEffect(() => {
    fetchChargers();
  }, []);

  const handleAddCharger = () => {
    setIsAddFormOpen(true);
  };

  const handleChargerAdded = (newCharger: ChargerData) => {
    setChargers(prev => [newCharger, ...prev]);
    console.log("New charger added to UI:", newCharger);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEditCharger = (charger: ChargerData) => {
    setEditingCharger(charger);
    setIsEditFormOpen(true);
  };

  const handleChargerUpdated = (updatedCharger: ChargerData) => {
    setChargers(prev =>
      prev.map(charger =>
        charger.id === updatedCharger.id ? updatedCharger : charger
      )
    );
    console.log("Charger updated in UI:", updatedCharger);
    setIsEditFormOpen(false);
    setEditingCharger(null);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingCharger(null);
  };

  return (
    <div className="charging-stations-container">
      {/* Header */}
      <div className="charging-stations-header">
        <h2 className="charging-stations-title">
          My Charging Stations
        </h2>

        <div className="charging-stations-controls">
          {/* Add Charger Button */}
          <button
            className="charging-stations-add-btn"
            onClick={handleAddCharger}
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
      </div>

      {/* Charger Cards Grid */}
      <div className="charging-stations-grid-horizontal-scroll">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="charger-card-skeleton">
              <div className="skeleton-shimmer"></div>
            </div>
          ))
        ) : chargers.length > 0 ? (
          chargers.map((charger) => (
            <ChargerCard
              key={charger.id}
              {...charger}
              onEdit={handleEditCharger}
            />
          ))
        ) : (
          // Empty state - takes full width when no chargers
          <div className="charging-stations-empty-horizontal">
            <div className="empty-state-icon">🔌</div>
            <h3>No Charging Stations</h3>
            <p>Get started by adding your first charging station.</p>
            <button
              className="charging-stations-add-btn"
              onClick={handleAddCharger}
            >
              <Plus className="charging-stations-add-btn-icon" />
              <span className="add-charger-text">Add Your First Charger</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Charger Form Modal */}
      <AddChargerForm
        isOpen={isAddFormOpen}
        onClose={handleCloseForm}
        onChargerAdded={handleChargerAdded}
      />

      {/* Edit Charger Form Modal */}
      <EditChargerForm
        isOpen={isEditFormOpen}
        onClose={handleCloseEditForm}
        charger={editingCharger}
        onChargerUpdated={handleChargerUpdated}
      />
    </div>
  );
}