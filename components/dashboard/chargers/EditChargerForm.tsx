import { useState, useEffect, useRef } from "react";
import { X, MapPin, Zap, Plug, IndianRupee, ArrowLeft, Trash2, Plus, Pencil, ChevronDown, CloudUpload, Eye, EyeOff, Upload } from "lucide-react";
import { chargersAPI } from "@/lib/api";
import "./EditChargerForm.css";

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
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reasonDropdownRef = useRef<HTMLDivElement>(null);

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

  const deleteReasonOptions = [
    { value: "station_damaged", label: "Station permanently damaged / broken." },
    { value: "location_closed", label: "Location permanently closed / business shut down." },
    { value: "technical_failure", label: "Frequent technical / software failure." },
    { value: "unsafe_location", label: "Unsafe location / security concerns." },
    { value: "provider_transition", label: "Transition to new provider / model upgrade." },
    { value: "low_usage", label: "Low usage / not economically viable." },
    { value: "moving_location", label: "Moving to a new location." },
    { value: "upgrading_model", label: "Upgrading to a new model." },
    { value: "something_else", label: "Something Else" }
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

      setSelectedImage(charger.image || "/ev.avif");
    }
  }, [charger]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reasonDropdownRef.current && !reasonDropdownRef.current.contains(event.target as Node)) {
        setIsReasonDropdownOpen(false);
      }
    };

    if (isReasonDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isReasonDropdownOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoSheetOpen = () => {
    setIsPhotoSheetOpen(true);
  };

  const handlePhotoSheetClose = () => {
    setIsPhotoSheetOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage("/ev.avif");
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

      // Extract power from charging speed
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
        image: selectedImage || charger.image,
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

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteReason("");
    setPassword("");
    setOtp("");
    setShowPassword(false);
  };

  const handleDeleteSubmit = async () => {
    // Validate inputs
    if (!deleteReason) {
      alert("Please select a reason for removal");
      return;
    }
    if (!password) {
      alert("Please enter your password");
      return;
    }
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    // TODO: Implement actual delete API call
    console.log("Delete charger requested:", {
      chargerId: charger?.id,
      reason: deleteReason,
      password,
      otp
    });

    // Close modal and form after successful deletion
    handleDeleteModalClose();
    onClose();
  };

  const handleResendOTP = () => {
    // TODO: Implement OTP resend logic
    console.log("Resend OTP requested");
    alert("OTP has been resent to your registered mobile number");
  };

  if (!isOpen || !charger) return null;

  return (
    <div className="edit-charger-overlay">
      <div className="edit-charger-container">
        {/* Header */}
        <div className="edit-charger-header">
          <div className="edit-charger-header-left">
            <button
              className="edit-charger-back-btn"
              onClick={handleClose}
              disabled={loading}
              title="Go Back"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="edit-charger-title">Edit Charger</h2>
          </div>
          <button
            className="edit-charger-delete-btn"
            onClick={handleDelete}
            title="Delete Charger"
            disabled={loading}
          >
            <Trash2 size={25.38} className="delete-icon" />
          </button>
        </div>

        {/* Scrollable Content Wrapper */}
        <div className="edit-charger-content">

          {/* Error Message */}
          {error && (
            <div className="add-charger-form-error" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {/* Image Upload Section */}
          <div className="edit-charger-images">
            {/* Main Image */}
            <div className="edit-charger-main-image-wrapper">
              <img
                src={selectedImage || charger.image || "/ev.avif"}
                alt="Charger"
                className="edit-charger-main-image"
              />
              <div
                className="edit-charger-edit-icon"
                title="Change Image"
                onClick={handlePhotoSheetOpen}
              >
                <Pencil size={14} strokeWidth={2.5} />
              </div>
            </div>

            {/* Placeholder Slots */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="edit-charger-placeholder"
                onClick={handleUploadClick}
                title="Add Image"
              >
                <Plus size={24} strokeWidth={1.5} color="#9CA3AF" />
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="edit-charger-form">
            {/* Charger Name */}
            <div className="edit-charger-form-group">
              <label className="edit-charger-label">
                Charger Name *
              </label>
              <div className="edit-charger-input-wrapper">
                <Zap size={20} className="edit-charger-input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="edit-charger-input"
                  placeholder="Premium DC Charger"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Location */}
            <div className="edit-charger-form-group">
              <label className="edit-charger-label">
                Location *
              </label>
              <div className="edit-charger-input-wrapper">
                <MapPin size={20} className="edit-charger-input-icon" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="edit-charger-input"
                  placeholder="Sector 18, Noida"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Charging Speed */}
            <div className="edit-charger-form-group">
              <label className="edit-charger-label">
                Charging Speed *
              </label>
              <div className="edit-charger-input-wrapper">
                <Zap size={20} className="edit-charger-input-icon" />
                <select
                  name="chargingSpeed"
                  value={formData.chargingSpeed}
                  onChange={handleInputChange}
                  className="edit-charger-select"
                  required
                  disabled={loading}
                >
                  <option value="">Select Charging Speed</option>
                  {chargingSpeedOptions.map(speed => (
                    <option key={speed} value={speed}>
                      {speed}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="edit-charger-chevron" />
              </div>
            </div>

            {/* Charger Type */}
            <div className="edit-charger-form-group">
              <label className="edit-charger-label">
                Charger Type *
              </label>
              <div className="edit-charger-input-wrapper">
                <Zap size={20} className="edit-charger-input-icon" />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="edit-charger-select"
                  required
                  disabled={loading}
                >
                  <option value="">Select Charger Type</option>
                  {chargerTypeOptions.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="edit-charger-chevron" />
              </div>
            </div>

            {/* Connector Type */}
            <div className="edit-charger-form-group">
              <label className="edit-charger-label">
                Connector Type *
              </label>
              <div className="edit-charger-input-wrapper">
                <Plug size={20} className="edit-charger-input-icon" />
                <select
                  name="connectorType"
                  value={formData.connectorType}
                  onChange={handleInputChange}
                  className="edit-charger-select"
                  required
                  disabled={loading}
                >
                  <option value="">Select Connector Type</option>
                  {connectorTypeOptions.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="edit-charger-chevron" />
              </div>
            </div>

            {/* Price per KWh */}
            <div className="edit-charger-form-group">
              <label className="edit-charger-label">
                Price Per KWh *
              </label>
              <div className="edit-charger-input-wrapper">
                <IndianRupee size={20} className="edit-charger-input-icon" />
                <input
                  type="number"
                  name="pricePerKWh"
                  value={formData.pricePerKWh || ""}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="edit-charger-input"
                  placeholder="18.00"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Status */}
            <div className="edit-charger-form-group">
              <label className="edit-charger-label">
                Status
              </label>
              <div className="edit-charger-input-wrapper">
                <Zap size={20} className="edit-charger-input-icon" />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="edit-charger-select"
                  disabled={loading}
                >
                  <option value="OFFLINE">Offline</option>
                  <option value="ONLINE">Online</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
                <ChevronDown size={20} className="edit-charger-chevron" />
              </div>
            </div>

            {/* Form Actions */}
            <div className="edit-charger-actions">
              <button
                type="button"
                className="edit-charger-btn edit-charger-cancel-btn"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="edit-charger-btn edit-charger-update-btn"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Charger"}
              </button>
            </div>
          </form>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* Image Edit Bottom Sheet - UPDATED DESIGN */}
      {isPhotoSheetOpen && (
        <div className="photo-sheet-overlay" onClick={handlePhotoSheetClose}>
          <div className="photo-sheet-container" onClick={e => e.stopPropagation()}>

            {/* Sheet Header */}
            <div className="photo-sheet-header">
              <button className="photo-sheet-back-btn" onClick={handlePhotoSheetClose}>
                <ArrowLeft size={24} />
              </button>
              <h3 className="photo-sheet-title">Edit Photo</h3>
            </div>

            <div className="photo-sheet-content">
              {/* Large Preview */}
              <div className="photo-sheet-preview-wrapper">
                <img
                  src={selectedImage || charger.image || "/ev.avif"}
                  alt="Charger Preview"
                  className="photo-sheet-preview-image"
                />
              </div>

              {/* Actions */}
              <div className="photo-sheet-actions">
                <button className="photo-sheet-action-row" onClick={handleUploadClick}>
                  <CloudUpload size={20} color="#374151" strokeWidth={2} />
                  <span className="photo-sheet-action-text">Upload Photo</span>
                </button>

                <button className="photo-sheet-action-row">
                  <Pencil size={20} color="#374151" strokeWidth={2} />
                  <span className="photo-sheet-action-text">Edit Photo</span>
                </button>

                <button className="photo-sheet-action-row" onClick={handleRemoveImage}>
                  <Trash2 size={20} color="#B3261E" strokeWidth={2} />
                  <span className="photo-sheet-action-text destructive">Remove</span>
                </button>
              </div>

              {/* Update Button */}
              <button
                className="photo-sheet-update-btn"
                onClick={handlePhotoSheetClose}
              >
                <span>Update</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Charger Modal - EXACT DESIGN FROM FIRST IMAGE */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-[20px] w-full max-w-[540px] shadow-2xl overflow-hidden delete-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteModalClose}
                  className="p-0 hover:opacity-70 transition-opacity -ml-1"
                >
                  <ArrowLeft size={28} className="text-[#757575]" strokeWidth={2} />
                </button>
                <h2 className="text-[24px] font-bold text-black leading-none">Delete Charger Station</h2>
              </div>
            </div>

            {/* Modal Content - with hidden scrollbar */}
            <div className="delete-modal-content px-6 py-6 max-h-[calc(90vh-180px)] overflow-y-auto">
              {/* Description */}
              <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                You are about to remove this charging station from the active network. please provide a reason for this removal and verify your credentials to proceed. note that this action is permanent, and the station's charging history will no longer be accessible.
              </p>

              {/* Reason Selection */}
              <div className="mb-6">
                <label className="delete-modal-label block mb-3">
                  Why Are You Deleting This Charger?
                </label>
                <div className="relative" ref={reasonDropdownRef}>
                  <div
                    onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg bg-white text-gray-400 text-[15px] cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <span className={deleteReason ? "text-gray-700" : "text-gray-400"}>
                      {deleteReason
                        ? deleteReasonOptions.find(opt => opt.value === deleteReason)?.label
                        : "Select A Reason For Removal.."}
                    </span>
                    <ChevronDown
                      className={`text-gray-400 transition-transform ${isReasonDropdownOpen ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </div>

                  {/* Custom Dropdown Menu */}
                  {isReasonDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[300px] overflow-y-auto custom-dropdown-menu">
                      {deleteReasonOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setDeleteReason(option.value);
                            setIsReasonDropdownOpen(false);
                          }}
                          className="px-4 py-3 text-[15px] text-gray-700 cursor-pointer hover:bg-[#38EF0A] hover:text-white transition-colors custom-dropdown-option"
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Warning Text - NO RED BACKGROUND BOX */}
              <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                If you proceed, this charging station and all its associated data will be permanently removed. this action is irreversible and the station cannot be recovered later.
              </p>

              {/* Password Input */}
              <div className="mb-6">
                <label className="delete-modal-label block mb-3">
                  Enter Your Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Current Password"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12 text-[15px] text-gray-400 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-[14px] text-[#00C853] hover:text-green-700 font-medium">
                    Forget Password?
                  </a>
                </div>
              </div>

              {/* OTP Input */}
              <div className="mb-2">
                <label className="delete-modal-label block mb-3">
                  Enter The 6-Digit Code Sent To Your Registered Mobile Number.
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                    }}
                    placeholder="Enter 6-Digit Code"
                    maxLength={6}
                    className="flex-1 px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-[15px] text-gray-400 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-[14px] text-[#00C853] hover:text-green-700 font-semibold whitespace-nowrap"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 bg-white flex gap-4">
              <button
                onClick={handleDeleteModalClose}
                className="flex-1 px-4 py-3.5 border border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-[16px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="flex-1 px-4 py-3.5 bg-[#2FEA00] border border-[#38EF0A] text-white rounded-xl font-medium hover:bg-[#28D100] transition-all text-[16px]"
              >
                Request Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}