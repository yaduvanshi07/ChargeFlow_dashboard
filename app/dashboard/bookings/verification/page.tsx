"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import DashboardHeader from "@/components/common/DashboardHeader";
import BookingStats from "@/components/bookings/BookingStats";
import Footer from "@/components/common/Footer";
import { useUser } from "@/contexts/UserContext";
import { bookingsAPI } from "@/lib/api";
import "./verification.css";

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
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  const verificationInProgress = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch booking data when component mounts or bookingId changes
  useEffect(() => {
    const fetchBookingData = async () => {
      if (bookingId && bookingId.length === 24) {
        try {
          setLoading(true);
          console.log('Fetching booking data for ID:', bookingId);
          const data = await bookingsAPI.getBooking(bookingId);
          console.log('Booking data fetched:', data);
          setBookingData(data);

          // Auto-generate OTP for ACCEPTED bookings (development only)
          if (data.status === 'ACCEPTED') {
            try {
              console.log('Auto-generating OTP for ACCEPTED booking...');
              const otpResult = await bookingsAPI.autoGenerateOTP(bookingId);
              console.log('OTP auto-generation result:', otpResult);
            } catch (otpError) {
              console.error('Auto OTP generation failed:', otpError);
              // Don't fail the page load if OTP generation fails
            }
          }
        } catch (error) {
          console.error('Error fetching booking data:', error);
          console.log('Available booking IDs for testing:');
          console.log('- 507f1f77bcf86cd799439011 (ACCEPTED - Rahul Sharma)');
          console.log('- 507f1f77bcf86cd799439012 (ACCEPTED - Priya Patel)');
          console.log('- 507f1f77bcf86cd799439013 (PENDING - Amit Kumar)');
          console.log('- 507f1f77bcf86cd799439014 (ACCEPTED - Test User)');
          // Keep mock data as fallback
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Invalid or missing bookingId:', bookingId);
        console.log('Please use a valid 24-character MongoDB ObjectId');
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  // Mock booking data (keep UI as before)
  const mockBookingData = {
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
    
    // Skip if verification is already completed, loading, OTP is not 6 digits, or verification is in progress
    if (verificationCompleted || loading || otpString.length !== 6 || verificationInProgress.current) {
      if (verificationInProgress.current) {
        console.log('Skipping verification - already in progress');
      }
      return;
    }
    
    const verifyOTP = async () => {
      console.log('Starting OTP verification for:', bookingId);
      verificationInProgress.current = true; // Mark as in progress
      
      try {
        setLoading(true);
        
        // If bookingId is provided and valid, verify via backend API
        if (bookingId && bookingId.length === 24) {
          try {
            console.log('📡 Calling verifyOTP API...');
            await bookingsAPI.verifyOTP(bookingId, otpString);
            console.log('✅ OTP verification successful!');
            
            // Success - OTP verified, database updated
            setVerificationStatus("success");
            setShowModal(true);
            setVerificationCompleted(true); // Mark as completed
            
            // Dispatch events for dashboard updates
            window.dispatchEvent(new Event('booking-verified'));
            
            // Dispatch session completion event
            window.dispatchEvent(new CustomEvent('session-completed', {
              detail: {
                bookingId,
                timestamp: new Date().toISOString(),
                message: 'Session completed - charger should go offline'
              }
            }));
            
            // Dispatch charger status change event (charger goes offline after session)
            window.dispatchEvent(new CustomEvent('charger-status-changed', {
              detail: {
                bookingId,
                status: 'OFFLINE',
                timestamp: new Date().toISOString(),
                message: 'Charger status changed to offline after session completion'
              }
            }));
            
          } catch (err: any) {
            console.log('OTP verification failed:', err.message);
            // Failed - wrong OTP or error
            setVerificationStatus("failed");
            setShowModal(true);
            // Don't set verificationCompleted on failure to allow retries
          }
        } else {
          console.log('No valid bookingId provided');
          // No valid bookingId - show error but allow testing
          setVerificationStatus("failed");
          setShowModal(true);
        }
      } catch (err: any) {
        console.log('Unexpected error during verification:', err);
        setVerificationStatus("failed");
        setShowModal(true);
      } finally {
        setLoading(false);
        verificationInProgress.current = false; // Reset the ref
      }
    };

    // Add delay for better UX
    const timeoutId = setTimeout(verifyOTP, 500);
    return () => {
      console.log('Cleaning up verification timeout');
      clearTimeout(timeoutId);
      verificationInProgress.current = false; // Reset on cleanup
    };
  }, [otp, bookingId, loading, verificationCompleted]);

  const handleTryAgain = () => {
    setShowModal(false);
    setVerificationStatus(null);
    setVerificationCompleted(false); // Reset verification completed flag
    verificationInProgress.current = false; // Reset the ref
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
    
    // Dispatch event to refresh dashboard stats
    console.log('🚀 Dispatching booking-verified event...');
    window.dispatchEvent(new CustomEvent('booking-verified', {
      detail: {
        bookingId,
        timestamp: new Date().toISOString(),
        message: 'OTP verification completed - refresh dashboard stats'
      }
    }));
    console.log('✅ Event dispatched successfully');
    
    // Auto-redirect to dashboard after successful verification
    console.log('🔄 Auto-redirecting to dashboard...');
    setTimeout(() => {
      router.push('/dashboard/bookings');
    }, 2000); // 2 second delay to show success message
  };

  // Auto-redirect on success modal show
  useEffect(() => {
    if (verificationStatus === "success" && showModal) {
      const redirectTimer = setTimeout(() => {
        handleCloseSuccessModal();
      }, 3000); // 3 seconds to read success message
      
      return () => clearTimeout(redirectTimer);
    }
  }, [verificationStatus, showModal, bookingId]);

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
                <img src={bookingData?.vehicleImage || mockBookingData.vehicleImage} alt={bookingData?.vehicleModel || mockBookingData.vehicleModel} />
              </div>
              <div className="tracking-vehicle-model">{bookingData?.vehicleModel || mockBookingData.vehicleModel}</div>
              
              <h2 className="tracking-station-name">{bookingData?.chargerName || mockBookingData.stationName}</h2>
              
              {/* Show booking status and helpful info */}
              {bookingData ? (
                <div style={{ 
                  padding: "8px 12px", 
                  backgroundColor: "#e8f5e8", 
                  borderRadius: "6px", 
                  marginBottom: "12px",
                  fontSize: "12px",
                  color: "#2d5a2d"
                }}>
                  ✅ Booking Found - Status: {bookingData.status}
                </div>
              ) : (
                <div style={{ 
                  padding: "8px 12px", 
                  backgroundColor: "#fff3cd", 
                  borderRadius: "6px", 
                  marginBottom: "12px",
                  fontSize: "12px",
                  color: "#856404"
                }}>
                  ⚠️ Using Mock Data - Check console for available booking IDs
                </div>
              )}
              
              <div className="booking-request-info">
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16m11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5M5 11l1.5-4.5h11L19 11z"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Vehicle Number:</span>
                  <span className="booking-info-value">{bookingData?.vehicleNumber || mockBookingData.vehicleNumber}</span>
                </div>
                
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>
                      <path fill="currentColor" d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2M19 8l.001 12H5V8z"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Connector Gun1:</span>
                  <span className="booking-info-value">{bookingData?.connectorType || mockBookingData.connector}</span>
                </div>
                
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66c.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Charger Type:</span>
                  <span className="booking-info-value">{bookingData?.chargerId?.type || mockBookingData.chargerType}</span>
                </div>
                
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M15 11V5l-3-3l-3 3v2H3v14h8v-4c0-1.1.9-2 2-2s2 .9 2 2v4h8V11z"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Total Unit:</span>
                  <span className="booking-info-value">{bookingData?.unitPrice || mockBookingData.unitPrice}</span>
                </div>
                
                <div className="booking-info-item">
                  <span className="booking-info-icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15"/>
                    </svg>
                  </span>
                  <span className="booking-info-label">Amount:</span>
                  <span className="booking-info-value">₹{bookingData?.amount || mockBookingData.amount.replace('₹', '')}</span>
                </div>
              </div>
              {/* Separator Line */}
              <div className="tracking-separator-line"></div>
              {/* OTP Section */}
              <div className="tracking-otp-section">
                <div className="tracking-otp-label">OTP</div>
                {!bookingId || bookingId.length !== 24 ? (
                  <div style={{ padding: "10px", textAlign: "center", fontSize: "12px", color: "#666" }}>
                    Note: Enter a valid booking ID in URL to verify OTP and update database
                  </div>
                ) : null}
                {loading && otp.join("").length === 6 && (
                  <div style={{ padding: "10px", textAlign: "center", fontSize: "14px" }}>
                    Verifying...
                  </div>
                )}
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
                      disabled={loading || verificationCompleted}
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
                  OTP verified! Revenue, sessions, and charger status have been updated in the database.
                </p>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                  Redirecting to dashboard...
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