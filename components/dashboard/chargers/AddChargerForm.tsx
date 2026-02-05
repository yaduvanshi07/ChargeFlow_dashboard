

import { useState } from "react";
import { X, MapPin, Zap, Plug, IndianRupee } from "lucide-react";
import { chargersAPI } from "@/lib/api";
import "./AddChargerForm.css";

interface AddChargerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onChargerAdded: (newCharger: any) => void;
}

export default function AddChargerForm({ isOpen, onClose, onChargerAdded }: AddChargerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    chargingSpeed: "",
    connectorType: "",
    pricePerKWh: "",
    power: "",
    type: "",
    status: "OFFLINE"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chargingSpeedOptions = [
    "AC Fast - 7.2KW",
    "AC Fast - 11KW",
    "AC Fast - 22KW",
    "DC Fast - 50kW",
    "DC Fast - 150KW",
    "DC Fast - 350KW"
  ];

  const connectorTypeOptions = [
    "Type 2",
    "CCS2",
    "CHAdeMO",
    "CCS2 + CHAdeMO",
    "Type 2 + CCS2"
  ];

  const chargerTypeOptions = [
    { value: "AC", label: "AC Charger" },
    { value: "DC", label: "DC Charger" },
    { value: "AC_FAST", label: "AC Fast Charger" },
    { value: "DC_FAST", label: "DC Fast Charger" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.name || !formData.location || !formData.chargingSpeed || !formData.connectorType || !formData.pricePerKWh || !formData.type) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Extract numeric value from pricePerKWh
      const pricePerKWhNum = formData.pricePerKWh ? parseFloat(formData.pricePerKWh) : 18;

      // Extract power from charging speed - get the numeric value before "KW" or "kW"
      const powerMatch = formData.chargingSpeed.match(/(\d+(?:\.\d+)?)(?:KW|kW)/);
      const powerNum = powerMatch ? parseFloat(powerMatch[1]) : 50;

      // Call API to add charger
      const response = await chargersAPI.addCharger(
        formData.name,
        formData.location,
        formData.type,
        powerNum, // Send as number, not string
        formData.status
      );

      console.log("Charger added successfully:", response);

      // Create new charger object with default values for UI
      const newCharger = {
        id: response.data?._id || response.data?.id || Date.now(), // Use MongoDB _id or fallback
        name: formData.name,
        location: formData.location,
        image: "/ev.avif", // Default image
        chargingSpeed: formData.chargingSpeed,
        connectorType: formData.connectorType,
        pricePerKWh: `₹${formData.pricePerKWh}/KWh`,
        utilization: 0, // New charger starts with 0% utilization
        rating: 0, // New charger starts with no rating
        sessions: 0, // New charger starts with 0 sessions
        isOnline: formData.status === "ONLINE",
      };

      // Notify parent component
      onChargerAdded(newCharger);

      // Reset form and close
      setFormData({
        name: "",
        location: "",
        chargingSpeed: "",
        connectorType: "",
        pricePerKWh: "",
        power: "",
        type: "",
        status: "OFFLINE"
      });

      onClose();

    } catch (err: any) {
      console.error("Error adding charger:", err);
      setError(err.message || "Failed to add charger. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      setFormData({
        name: "",
        location: "",
        chargingSpeed: "",
        connectorType: "",
        pricePerKWh: "",
        power: "",
        type: "",
        status: "OFFLINE"
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-charger-form-overlay">
      <div className="add-charger-form-container">
        {/* Header */}
        <div className="add-charger-form-header">
          <h2 className="add-charger-form-title">Add New Charger</h2>
          <button
            className="add-charger-form-close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="add-charger-form-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="add-charger-form">
          {/* Charger Name */}
          <div className="add-charger-form-group">
            <label className="add-charger-form-label">
              Charger Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="add-charger-form-input"
              placeholder="e.g., Premium DC Charger"
              required
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div className="add-charger-form-group">
            <label className="add-charger-form-label">
              <MapPin size={16} style={{ marginRight: '4px' }} />
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="add-charger-form-input"
              placeholder="e.g., Sector 18, Noida"
              required
              disabled={loading}
            />
          </div>

          {/* Charging Speed */}
          <div className="add-charger-form-group">
            <label className="add-charger-form-label">
              <Zap size={16} style={{ marginRight: '4px' }} />
              Charging Speed *
            </label>
            <select
              name="chargingSpeed"
              value={formData.chargingSpeed}
              onChange={handleInputChange}
              className="add-charger-form-select"
              required
              disabled={loading}
            >
              <option value="">Select charging speed</option>
              {chargingSpeedOptions.map(speed => (
                <option key={speed} value={speed}>
                  {speed}
                </option>
              ))}
            </select>
          </div>

          {/* Charger Type */}
          <div className="add-charger-form-group">
            <label className="add-charger-form-label">
              Charger Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="add-charger-form-select"
              required
              disabled={loading}
            >
              <option value="">Select charger type</option>
              {chargerTypeOptions.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Connector Type */}
          <div className="add-charger-form-group">
            <label className="add-charger-form-label">
              <Plug size={16} style={{ marginRight: '4px' }} />
              Connector Type *
            </label>
            <select
              name="connectorType"
              value={formData.connectorType}
              onChange={handleInputChange}
              className="add-charger-form-select"
              required
              disabled={loading}
            >
              <option value="">Select connector type</option>
              {connectorTypeOptions.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Price per KWh */}
          <div className="add-charger-form-group">
            <label className="add-charger-form-label">
              <IndianRupee size={16} style={{ marginRight: '4px' }} />
              Price per KWh *
            </label>
            <div className="price-input-container">
              <input
                type="number"
                name="pricePerKWh"
                value={formData.pricePerKWh || ""}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  // Prevent invalid characters: e, E, +, -
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="add-charger-form-input"
                placeholder="18.00"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
              <span className="input-suffix">₹/kWh</span>
            </div>
            <p className="add-charger-form-hint">Enter price in ₹ per kWh</p>
          </div>

          {/* Initial Status */}
          <div className="add-charger-form-group">
            <label className="add-charger-form-label">
              Initial Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="add-charger-form-select"
              disabled={loading}
            >
              <option value="OFFLINE">Offline</option>
              <option value="ONLINE">Online</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="add-charger-form-actions">
            <button
              type="button"
              className="add-charger-form-btn add-charger-form-btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-charger-form-btn add-charger-form-btn-submit"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Charger"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
