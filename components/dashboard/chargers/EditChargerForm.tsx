import { useState, useEffect } from "react";
import { X, MapPin, Zap, Plug, IndianRupee } from "lucide-react";
import { chargersAPI } from "@/lib/api";
import "./AddChargerForm.css";

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

interface EditChargerFormProps {
  isOpen: boolean;
  onClose: () => void;
  charger: ChargerData | null;
  onChargerUpdated: (updatedCharger: ChargerData) => void;
}

export default function EditChargerForm({ isOpen, onClose, charger, onChargerUpdated }: EditChargerFormProps) {
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

  // Initialize form data when charger changes
  useEffect(() => {
    if (charger) {
      // Extract numeric price from pricePerKWh string (e.g., "₹18/KWh" -> "18")
      const priceMatch = charger.pricePerKWh?.match(/(\d+(?:\.\d+)?)/);
      const priceValue = priceMatch ? priceMatch[1] : "";

      setFormData({
        name: charger.name || "",
        location: charger.location || "",
        chargingSpeed: charger.chargingSpeed || "",
        connectorType: charger.connectorType || "",
        pricePerKWh: priceValue,
        power: charger.power?.toString() || "",
        type: charger.type || "",
        status: charger.status || "OFFLINE"
      });
    }
  }, [charger]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charger) return;

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

      // Call API to update charger
      const response = await chargersAPI.updateCharger(
        charger.id,
        formData.name,
        formData.location,
        formData.type,
        powerNum,
        formData.status
      );

      console.log("Charger updated successfully:", response);

      // Create updated charger object with form data
      const updatedCharger: ChargerData = {
        ...charger,
        name: formData.name,
        location: formData.location,
        chargingSpeed: formData.chargingSpeed,
        connectorType: formData.connectorType,
        pricePerKWh: `₹${formData.pricePerKWh}/KWh`,
        type: formData.type,
        status: formData.status,
        power: powerNum,
      };

      // Notify parent component
      onChargerUpdated(updatedCharger);

      onClose();

    } catch (err: any) {
      console.error("Error updating charger:", err);
      setError(err.message || "Failed to update charger. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      onClose();
    }
  };

  if (!isOpen || !charger) return null;

  return (
    <div className="add-charger-form-overlay">
      <div className="add-charger-form-container">
        {/* Header */}
        <div className="add-charger-form-header">
          <h2 className="add-charger-form-title">Edit Charger</h2>
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

          {/* Status */}
          <div className="add-charger-form-group">
            <label className="add-charger-form-label">
              Status
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
              {loading ? "Updating..." : "Update Charger"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
