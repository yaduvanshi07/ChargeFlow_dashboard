"use client";

import "@/components/profile/personal/personal.css";
import React from "react";

export default function KYCVerificationSection() {
  return (
    <>
      <h2 className="profile-form-title">KYC Verification</h2>
      
      <div className="profile-form-grid">
        <div className="profile-form-field">
          <label className="profile-form-label">Aadhaar Card Number</label>
          <input
            type="text"
            placeholder="0000 1111 2222"
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">PAN Card Number</label>
          <input
            type="text"
            placeholder="AFZPK7190K"
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">Driving License Number</label>
          <input
            type="text"
            placeholder="DL1320230045678"
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">EV Plate Number</label>
          <input
            type="text"
            placeholder="HM 12 AB 1234"
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">RC (Registration Certificate)</label>
          <input
            type="text"
            placeholder="KA 01 MJ 5678"
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">Bank Name</label>
          <input
            type="text"
            placeholder="ICICI Bank"
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">Account Number</label>
          <input
            type="text"
            placeholder="000401567890"
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">IFSC Code</label>
          <input
            type="text"
            placeholder="ICIC0000001"
            className="profile-form-input"
          />
        </div>
      </div>

      <div className="profile-form-actions">
        <button
          type="button"
          className="profile-button profile-button-save"
          style={{ width: 'auto', paddingLeft: '2rem', paddingRight: '2rem' }}
        >
          Request Update
        </button>
      </div>
    </>
  );
}
