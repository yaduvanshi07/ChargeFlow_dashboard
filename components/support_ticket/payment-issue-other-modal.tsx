import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "@/components/support_ticket/payment-issue-modal.css";

/* ── Props ─────────────────────────────────────────────────────────── */

interface PaymentIssueOtherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack?: () => void;
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function PaymentIssueOtherModal({
    isOpen,
    onClose,
    onBack,
}: PaymentIssueOtherModalProps) {
    const [issueText, setIssueText] = useState("");
    const [step, setStep] = useState<"describe" | "success">("describe");

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

    /* Reset state when modal closes */
    useEffect(() => {
        if (!isOpen) {
            setIssueText("");
            setStep("describe");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /* ── Handlers ── */

    const handleBack = () => {
        if (step === "success") {
            onClose();
        } else {
            onBack?.();
        }
    };

    const handleSubmit = () => {
        if (!issueText.trim()) return;
        setStep("success");
    };

    /* ── Render ── */

    return (
        <div
            className="pim-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Describe Payment Issue"
        >
            <div
                className="pim-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="pim-header">
                    <button
                        className="pim-header-btn"
                        onClick={handleBack}
                        aria-label="Go back"
                        type="button"
                    >
                        <Icon icon="mdi:arrow-left" width={24} height={24} aria-hidden="true" />
                    </button>

                    <h2 className="pim-header-title">ChargeFlow Support</h2>

                    <button
                        className="pim-header-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                        type="button"
                    >
                        <Icon icon="mdi:close" width={24} height={24} aria-hidden="true" />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="pim-body">

                    {/* ── Step: Describe ── */}
                    {step === "describe" && (
                        <div className="piom-describe">
                            <h3 className="piom-describe-title">Describe Your Payment Issue</h3>
                            <p className="piom-describe-subtext">
                                Please briefly describe your payment problem.
                            </p>

                            <textarea
                                className="piom-textarea"
                                placeholder="Describe your issue......"
                                value={issueText}
                                onChange={(e) => setIssueText(e.target.value)}
                                aria-label="Describe your payment issue"
                                rows={5}
                            />

                            <button
                                type="button"
                                className="piom-submit-btn"
                                onClick={handleSubmit}
                                disabled={!issueText.trim()}
                                aria-label="Submit support request"
                            >
                                Submit Request
                            </button>
                        </div>
                    )}

                    {/* ── Step: Success ── */}
                    {step === "success" && (
                        <div className="pim-success" role="status" aria-live="polite">
                            {/* Green Circle Icon */}
                            <div className="pim-success-icon" aria-hidden="true">
                                <Icon icon="mdi:check" width={52} height={52} />
                            </div>

                            {/* Title */}
                            <h3 className="pim-success-title">Request Submitted Successfully!</h3>

                            {/* Description */}
                            <p className="pim-success-desc">
                                Your call request has been submitted successfully. Our support
                                team will contact you shortly.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
