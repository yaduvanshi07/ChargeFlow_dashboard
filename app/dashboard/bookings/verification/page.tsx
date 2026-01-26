"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import DashboardHeader from "@/components/common/DashboardHeader";
import BookingStats from "@/components/bookings/BookingStats";
import Footer from "@/components/common/Footer";
import { useUser } from "@/contexts/UserContext";
import "./verification.css";

// Mock OTP for verification
const CORRECT_OTP = "123456";

function BookingTrackingContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Bookings");
  const { userData, getUserFullName, updateUserData } = useUser();
  const [isOnline, setIsOnline] = useState(userData.isOnline);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [showModal, setShowModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"success" | "failed" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bookingData = {
    stationName: "Premium Mall Charging Hub",
    vehicleModel: "Tata Nexon EV",
    vehicleNumber: "DLxxxxxx34",
    vehicleImage: "/ev.avif",
    connector: "Type2",
    chargerType: "Premium DC Fast-50kWh",
    unitPrice: "₹18/KWh",
    amount: "₹320.00",
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify OTP when all 6 digits are entered
  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      // Verify OTP after a short delay for better UX
      setTimeout(() => {
        if (otpString === CORRECT_OTP) {
          setVerificationStatus("success");
          setShowModal(true);
        } else {
          setVerificationStatus("failed");
          setShowModal(true);
        }
      }, 500);
    }
  }, [otp]);

  const handleTryAgain = () => {
    setShowModal(false);
    setVerificationStatus(null);
    setOtp(["", "", "", "", "", ""]);
    // Focus first input
    setTimeout(() => {
      const firstInput = document.getElementById("otp-0");
      firstInput?.focus();
    }, 100);
  };

  const handleCloseSuccessModal = () => {
    setShowModal(false);
    setVerificationStatus(null);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto booking-tracking-main">
          {/* Dashboard Header */}
          <DashboardHeader
            userName={getUserFullName()}
            userEmail={userData.email}
            isOnline={isOnline}
            onToggleStatus={() => {
              const newStatus = !isOnline;
              setIsOnline(newStatus);
              updateUserData({ isOnline: newStatus });
            }}
          />
          
          {/* Tabs Section (same as other bookings pages) */}
          <div className="bookings-tabs" style={{marginTop: '1rem'}}>
            {['Overview', 'My Chargers', 'Bookings', 'Earnings', 'Wallet', 'Reviews'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    // Navigate or set active tab like main bookings page
                    if (tab === 'Overview') {
                      router.push('/dashboard');
                    } else if (tab === 'My Chargers') {
                      router.push('/dashboard/my-chargers');
                    } else if (tab === 'Bookings') {
                      setActiveTab(tab);
                    } else if (tab === 'Earnings') {
                      router.push('/dashboard/earnings');
                    } else if (tab === 'Wallet') {
                      router.push('/dashboard/wallet');
                    } else if (tab === 'Reviews') {
                      router.push('/dashboard/reviews');
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                  className="bookings-tab"
                  style={{
                    backgroundColor: isActive ? 'rgba(56, 239, 10, 1)' : 'white',
                    color: isActive ? 'white' : '#374151',
                  }}
                  suppressHydrationWarning
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Booking Management Title */}
          <h2 className="booking-management-title">Booking Management</h2>

          {/* Booking Stats Cards */}
          <BookingStats />

          {/* Tracking Content */}
          <div className="booking-tracking-container">
            {/* Left Panel - Map */}
            <div className="booking-tracking-map">
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="map-location-pin">📍</div>
                  <div className="map-labels">
                    <div className="map-label">Delhi</div>
                    <div className="map-label">New Delhi</div>
                    <div className="map-area">Kamla Nagar</div>
                    <div className="map-area">Preet Vihar</div>
                    <div className="map-area">Mayur Vihar</div>
                    <div className="map-area">Sarojini Nagar</div>
                    <div className="map-area">Lajpat Nagar</div>
                    <div className="map-area">Hauz Khas</div>
                    <div className="map-area">Chittaranjan Park</div>
                    <div className="map-area">Noida</div>
                  </div>
                  <div className="map-pins">
                    <div className="map-pin">📍</div>
                    <div className="map-pin">📍</div>
                    <div className="map-pin">📍</div>
                    <div className="map-cluster">44</div>
                    <div className="map-cluster">44</div>
                    <div className="map-charger-icon">🔌</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Charging Hub Details */}
            <div className="booking-tracking-details">
              <div className="tracking-vehicle-image">
                <img src={bookingData.vehicleImage} alt={bookingData.vehicleModel} />
              </div>
              <div className="tracking-vehicle-model">{bookingData.vehicleModel}</div>
              
              <h2 className="tracking-station-name">{bookingData.stationName}</h2>
              
              <div className="booking-request-info">
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16m11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5M5 11l1.5-4.5h11L19 11z"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Vehicle Number:</span>
                  <span className="booking-info-value">{bookingData.vehicleNumber}</span>
                </div>
                
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>
                      <path fill="currentColor" d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2M19 8l.001 12H5V8z"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Connector Gun1:</span>
                  <span className="booking-info-value">{bookingData.connector}</span>
                </div>
                
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66c.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Charger Type:</span>
                  <span className="booking-info-value">{bookingData.chargerType}</span>
                </div>
                
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M15 11V5l-3-3l-3 3v2H3v14h8v-4c0-1.1.9-2 2-2s2 .9 2 2v4h8V11z"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Total Unit:</span>
                  <span className="booking-info-value">{bookingData.unitPrice}</span>
                </div>
                
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Amount:</span>
                  <span className="booking-info-value">{bookingData.amount}</span>
                </div>
              </div>
{/* Separator Line */}
              <div className="tracking-separator-line"></div>
              {/* OTP Section */}
              <div className="tracking-otp-section">
                <div className="tracking-otp-label">OTP</div>
                <div className="tracking-otp-inputs">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="tracking-otp-input"
                      suppressHydrationWarning
                    />
                  ))}
                  <div className="tracking-qr-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2 2h2v2H2z"/>
                      <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
                      <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
                      <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
                      <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="verification-modal-overlay" onClick={verificationStatus === "success" ? handleCloseSuccessModal : undefined}>
          <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
            {verificationStatus === "failed" ? (
              <>
                <div className="verification-icon-container verification-icon-failed">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 14L34 34M34 14L14 34" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="verification-title">Verification Failed</h2>
                <p className="verification-message">
                  The OTP is incorrect please check and try again
                </p>
                <button className="verification-btn" onClick={handleTryAgain} suppressHydrationWarning>
                  Try Again
                </button>
              </>
            ) : (
              <>
                <div className="verification-icon-container verification-icon-success">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 24L20 34L38 14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="verification-title">Verification Successfully!</h2>
                <p className="verification-message">
                  The OTP is verified the payment link been sent to user
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function BookingTrackingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingTrackingContent />
    </Suspense>
  );
}