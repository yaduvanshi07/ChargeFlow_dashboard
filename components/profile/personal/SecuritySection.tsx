"use client";

import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import DeleteAccountModal from "../account/DeleteAccountModal";
import DeactivateAccountModal from "../account/DeactivateAccountModal";
import { useUser } from "@/contexts/UserContext";
import "./personal.css"; // Import the CSS file

export default function SecuritySection() {
  const { userData } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeactivateCancel = () => {
    setShowDeactivateModal(false);
  };

  const handleDelete = () => {
    // Handle delete account
    alert('Account deleted');
    setShowDeleteModal(false);
  };

  const handleDeactivate = () => {
    // Handle deactivate account
    alert('Account deactivated');
    setShowDeactivateModal(false);
  };

  // Show modals when clicked
  if (showDeleteModal) {
    return (
      <DeleteAccountModal
        onCancel={handleDeleteCancel}
        onDelete={handleDelete}
      />
    );
  }

  if (showDeactivateModal) {
    return (
      <DeactivateAccountModal
        email={userData.email}
        phone={userData.phone}
        onCancel={handleDeactivateCancel}
        onConfirm={handleDeactivate}
      />
    );
  }

  return (
    <>
      <h2 className="security-title">Password & Security</h2>
      <p className="security-subtitle">
        Manage your account security settings and protect data
      </p>

      {/* Password Card */}
      <div className="security-password-card">
        <div className="security-password-card-content">
          <div className="security-icon-container">
            <Lock style={{ width: '24px', height: '24px', color: '#34C759' }} />
          </div>
          <div className="security-password-info">
            <div className="security-password-title">Password</div>
            <div className="security-password-description">
              Last changed 1 month ago. use a strong password
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            // Handle change password
            alert('Change password functionality');
          }}
          className="security-change-password-button"
        >
          Changes Password
        </button>
      </div>

      {/* Account Actions */}
      <div className="security-account-actions">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDeactivateClick();
          }}
          className="security-account-link"
        >
          De-activate my account
          <ArrowRight style={{ width: '20px', height: '20px'}} />
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDeleteClick();
          }}
          className="security-account-link"
        >
          Delete my account
          <ArrowRight style={{ width: '20px', height: '20px' }} />
        </a>
      </div>
    </>
  );
}