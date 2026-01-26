import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ChevronDown, Eye, EyeOff } from "lucide-react";
import "./account.css";

interface DeleteAccountModalProps {
  onCancel: () => void;
  onDelete: () => void;
  onForgetPassword?: () => void;
}

export default function DeleteAccountModal({ 
  onCancel, 
  onDelete,
  onForgetPassword 
}: DeleteAccountModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const reasons = [
    "Poor user experience",
    "Too expensive",
    "Found a better alternative",
    "Technical issues",
    "Security concerns",
    "Not using the service",
    "Other",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="delete-account-modal">
      <div className="delete-account-header">
        <button
          type="button"
          onClick={onCancel}
          className="delete-account-back-btn"
          aria-label="Go back"
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <h2 className="delete-account-title">Delete Account</h2>
      </div>

      <p className="delete-account-text">
        It looks like you&apos;ve had a sub-optimal experience with charge flow. before you go, we would truly appreciate it if you could let us know what went wrong. your feedback is vital for us to enhance our platform and provide a more seamless experience for our community in the future.
      </p>

      <label className="delete-account-label">
        Please Select The Primary Reason Why You Wish To Delete Your Account ?
      </label>

      <div className="delete-account-dropdown" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="delete-account-select"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span style={{ color: selectedReason ? '#1C1C1E' : '#8E8E93' }}>
            {selectedReason || "Why Are You Leaving Us?"}
          </span>
          <ChevronDown 
            style={{ 
              width: '20px', 
              height: '20px', 
              color: '#8E8E93',
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }} 
          />
        </button>

        {isDropdownOpen && (
          <div className="delete-account-dropdown-list" role="listbox">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="delete-account-dropdown-item"
                onClick={() => {
                  setSelectedReason(reason);
                  setIsDropdownOpen(false);
                }}
                role="option"
                aria-selected={selectedReason === reason}
              >
                {reason}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="delete-account-warning">
        If you proceed, your profile and all associated data will be permanently removed. you will no longer be able to log in to your charge flow account or access your service history.
      </p>

      <div className="delete-account-password-section">
        <label className="delete-account-password-label">
          Enter Your Current Password
        </label>
        <div className="delete-account-password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Current Password"
            className="delete-account-password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="delete-account-password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff style={{ width: '20px', height: '20px', color: '#8E8E93' }} />
            ) : (
              <Eye style={{ width: '20px', height: '20px', color: '#8E8E93' }} />
            )}
          </button>
        </div>
        {onForgetPassword && (
          <button
            type="button"
            onClick={onForgetPassword}
            className="delete-account-forget-password"
          >
            Forget Password?
          </button>
        )}
      </div>

      <div className="delete-account-actions">
        <button
          type="button"
          onClick={onCancel}
          className="delete-account-btn delete-account-btn-cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="delete-account-btn delete-account-btn-delete"
          disabled={!selectedReason || !password}
        >
          Delete
        </button>
      </div>
    </div>
  );
}