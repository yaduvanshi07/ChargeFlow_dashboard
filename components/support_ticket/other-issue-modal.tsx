import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "@/components/support_ticket/other-issue-modal.css";

/* ── Props ─────────────────────────────────────────────────────────── */

interface OtherIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack?: () => void;
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function OtherIssueModal({
    isOpen,
    onClose,
    onBack,
}: OtherIssueModalProps) {
    const [issueText, setIssueText] = useState("");

    /* Lock body scroll when open */
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

    /* Reset textarea when modal closes */
    useEffect(() => {
        if (!isOpen) {
            setIssueText("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /* ── Handlers ── */

    const handleBack = () => {
        onBack?.();
    };

    const handleSubmit = () => {
        if (!issueText.trim()) return;
        onClose();
    };

    /* ── Render ── */

    return (
        <div
            className="oim-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Other Issue"
        >
            <div
                className="oim-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="oim-header">
                    <button
                        className="oim-header-btn"
                        onClick={handleBack}
                        aria-label="Go back"
                        type="button"
                    >
                        <Icon icon="mdi:arrow-left" width={24} height={24} aria-hidden="true" />
                    </button>

                    <h2 className="oim-header-title">ChargeFlow Support</h2>

                    <button
                        className="oim-header-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                        type="button"
                    >
                        <Icon icon="mdi:close" width={24} height={24} aria-hidden="true" />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="oim-body">
                    <h3 className="oim-title">Other Issue</h3>
                    <p className="oim-subtext">Please briefly describe your issue.</p>

                    <textarea
                        className="oim-textarea"
                        placeholder="Describe your issue......"
                        value={issueText}
                        onChange={(e) => setIssueText(e.target.value)}
                        aria-label="Describe your issue"
                        rows={5}
                    />

                    <button
                        type="button"
                        className="oim-submit-btn"
                        onClick={handleSubmit}
                        disabled={!issueText.trim()}
                        aria-label="Submit support request"
                    >
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
}