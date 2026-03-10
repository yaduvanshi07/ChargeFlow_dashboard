import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "@/components/support_ticket/get-help-modal.css";

interface GetHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRequestChat?: () => void;
    onRequestCall?: () => void;
}

export default function GetHelpModal({ isOpen, onClose, onRequestChat, onRequestCall }: GetHelpModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("profile-image");
        if (saved) setProfileImage(saved);
    }, []);

    if (!isOpen) return null;

    const handleChatClick = () => {
        onClose();
        if (onRequestChat) {
            onRequestChat();
        }
    };

    const handleCallClick = () => {
        onClose();
        if (onRequestCall) {
            onRequestCall();
        }
    };

    return (
        <div className="help-modal-overlay" onClick={onClose}>
            <div
                className="help-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="help-modal-header">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="help-modal-user-avatar"
                        />
                    ) : (
                        <img
                            src="/user.jpg"
                            alt="Profile placeholder"
                            className="help-modal-user-avatar"
                        />
                    )}
                    <h2>How Would You Like To Get Help?</h2>
                    <button className="help-modal-close" onClick={onClose}>
                        <Icon icon="mdi:close" width={24} height={24} color="#757575" />
                    </button>
                </div>

                <div className="help-modal-body">
                    <button className="help-option-card" onClick={handleChatClick}>
                        <div className="help-option-icon-wrapper">
                            <Icon
                                icon="token:chat"
                                className="help-option-icon help-option-icon--chat"
                            />
                        </div>
                        <div className="help-option-text">
                            <h3>Request Chat</h3>
                            <p>Chat With Our Support Team For Quick Assistance.</p>
                        </div>
                    </button>

                    <button className="help-option-card" onClick={handleCallClick}>
                        <div className="help-option-icon-wrapper">
                            <Icon
                                icon="mage:phone-call-fill"
                                className="help-option-icon help-option-icon--call"
                            />
                        </div>
                        <div className="help-option-text">
                            <h3>Request Call</h3>
                            <p>Request A Call From Our Support Team.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}