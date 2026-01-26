"use client";

import { useState } from "react";
import "./notifications-section.css";

interface NotificationsState {
  pushNotifications: boolean;
  email: boolean;
  phoneNumber: boolean;
  whatsapp: boolean;
}

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState<NotificationsState>({
    pushNotifications: true,
    email: true,
    phoneNumber: true,
    whatsapp: true,
  });

  const ToggleSwitch = ({ 
    checked, 
    onChange 
  }: { 
    checked: boolean; 
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      style={{
        position: 'relative',
        display: 'inline-flex',
        height: '24px',
        width: '44px',
        alignItems: 'center',
        borderRadius: '9999px',
        backgroundColor: checked ? '#38EF0A' : '#E5E5EA',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          height: '18px',
          width: '18px',
          borderRadius: '50%',
          backgroundColor: 'white',
          transform: checked ? 'translateX(22px)' : 'translateX(4px)',
          transition: 'transform 0.2s',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      />
    </button>
  );

  return (
    <>
      <div className="notifications-section notifications-section__block">
        <h2 className="notifications-section__title">Charging Status & Alerts</h2>
        <p className="notifications-section__desc">
          Enable these settings to receive instant notifications on your desktop or via whatsapp regarding your electric vehicle's charging progress. we will notify you when the session starts, provide regular battery level updates, and alert you the moment your vehicle is fully charged and ready for your next journey.
        </p>

        <div className="notifications-section__row">
          <label className="notifications-section__label">Push Notifications</label>
          <ToggleSwitch
            checked={notifications.pushNotifications}
            onChange={() => setNotifications(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
          />
        </div>
      </div>

      <div className="notifications-section__divider" />

      <div className="notifications-section__block">
        <h2 className="notifications-section__title">Offers & Station Updates</h2>
        <p className="notifications-section__desc">
          Never Miss A Chance To Save! Get Notified About Exclusive Discount Coupons, Loyalty Rewards, And New Charge Flow Stations Opening Near You. Stay Updated And Get The Best Charging Deals First.
        </p>

        <div className="notifications-section__column">
          <div className="notifications-section__row--space">
            <label className="notifications-section__label">Email</label>
            <ToggleSwitch
              checked={notifications.email}
              onChange={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
            />
          </div>

          <div className="notifications-section__row--space">
            <label className="notifications-section__label">Phone Number</label>
            <ToggleSwitch
              checked={notifications.phoneNumber}
              onChange={() => setNotifications(prev => ({ ...prev, phoneNumber: !prev.phoneNumber }))}
            />
          </div>

          <div className="notifications-section__row--space">
            <label className="notifications-section__label">WhatsApp</label>
            <ToggleSwitch
              checked={notifications.whatsapp}
              onChange={() => setNotifications(prev => ({ ...prev, whatsapp: !prev.whatsapp }))}
            />
          </div>
        </div>
      </div>
    </>
  );
}