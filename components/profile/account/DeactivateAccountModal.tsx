import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import "./account.css";

interface DeactivateAccountModalProps {
  email: string;
  phone: string;
  onCancel: () => void;
  onConfirm: () => void;
  onForgetPassword?: () => void;
}

export default function DeactivateAccountModal({ 
  email, 
  phone, 
  onCancel, 
  onConfirm,
  onForgetPassword 
}: DeactivateAccountModalProps) {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleResendOTP = () => {
    // Handle resend OTP
    console.log('OTP resent to your email/phone');
  };

  return (
    <div className="deactivate-account-modal">
      <div className="deactivate-account-header">
        <button
          type="button"
          onClick={onCancel}
          className="deactivate-account-back-btn"
          aria-label="Go back"
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <h2 className="deactivate-account-title">Deactivate Account</h2>
      </div>

      {/* Two-column layout for Email and Phone */}
      <div className="deactivate-account-row">
        <div className="deactivate-account-field deactivate-account-field-half">
          <label className="deactivate-account-label">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="deactivate-account-input"
          />
        </div>

        <div className="deactivate-account-field deactivate-account-field-half">
          <label className="deactivate-account-label">Phone Number</label>
          <input
            type="tel"
            value={phone}
            readOnly
            className="deactivate-account-input"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="deactivate-account-password-section">
        <label className="deactivate-account-label">
          Enter Your Current Password
        </label>
        <div className="deactivate-account-password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Current Password"
            className="deactivate-account-password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="deactivate-account-password-toggle"
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
            className="deactivate-account-forget-password"
          >
            Forget Password?
          </button>
        )}
      </div>

      {/* OTP Section */}
      <div className="deactivate-account-otp-section">
        <label className="deactivate-account-otp-label">
          Enter The 6-Digit Code Sent To Your Mobile/Email
        </label>
        <div className="deactivate-account-otp-container">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="deactivate-account-otp-input"
          />
          <button
            type="button"
            onClick={handleResendOTP}
            className="deactivate-account-resend-btn"
          >
            Resend OTP
          </button>
        </div>
      </div>

      {/* Centered Confirm Button */}
      <div className="deactivate-account-button-container">
        <button
          type="button"
          onClick={onConfirm}
          className="deactivate-account-confirm-btn"
          disabled={!password || !otp}
        >
          Confirm Deactivation
        </button>
      </div>

      {/* Info Section */}
      <div className="deactivate-account-info-section">
        <h3 className="deactivate-account-info-title">
          When You Deactivate Your Charge Flow Account
        </h3>
        <ul className="deactivate-account-info-list">
          <li className="deactivate-account-info-item">
            You will temporarily lose access to your dashboard.
          </li>
          <li className="deactivate-account-info-item">
            You will not receive notifications.
          </li>
          <li className="deactivate-account-info-item">
            You will not receive important updates or promotional offers.
          </li>
          <li className="deactivate-account-info-item">
            Your profile and data will not be visible to others.
          </li>
        </ul>
      </div>
    </div>
  );
}