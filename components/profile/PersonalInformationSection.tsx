"use client";

import "@/components/profile/personal/personal.css";
import React from "react";

interface PersonalInformationSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function PersonalInformationSection({
  formData,
  onInputChange,
  onCancel,
  onSave,
}: PersonalInformationSectionProps) {
  return (
    <>
      <h2 className="profile-form-title">Personal Information</h2>
      
      <div className="profile-form-grid">
        <div className="profile-form-field">
          <label className="profile-form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">Date Of Birth</label>
          <input
            type="text"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={onInputChange}
            placeholder="MM/DD/YYYY"
            className="profile-form-input"
          />
        </div>

        <div className="profile-form-field">
          <label className="profile-form-label">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onInputChange}
            className="profile-form-input"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className="profile-form-field full-width">
          <label className="profile-form-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onInputChange}
            className="profile-form-input"
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>

      <div className="profile-form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="profile-button profile-button-cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="profile-button profile-button-save"
        >
          Save Changes
        </button>
      </div>
    </>
  );
}
