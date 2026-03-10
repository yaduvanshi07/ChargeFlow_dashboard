import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "@/components/support_ticket/payment-issue-modal.css";
import PaymentIssueOtherModal from "@/components/support_ticket/payment-issue-other-modal";

/* ── Props ─────────────────────────────────────────────────────────── */

interface PaymentIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack?: () => void;
}

/* ── Options ───────────────────────────────────────────────────────── */

interface PaymentOption {
    id: string;
    label: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
    { id: "transaction_failed", label: "Transaction failed" },
    { id: "amount_deducted_no_charge", label: "Amount deducted but charger not activated" },
    { id: "double_payment", label: "Double payment deducted" },
    { id: "refund_not_received", label: "Refund not received" },
    { id: "need_invoice", label: "Need payment invoice" },
    { id: "other", label: "Other" },
];

/* ── Component ─────────────────────────────────────────────────────── */

export default function PaymentIssueModal({
    isOpen,
    onClose,
    onBack,
}: PaymentIssueModalProps) {
    const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);
    const [step, setStep] = useState<"selection" | "confirmation" | "success">("selection");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);

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
            setStep("selection");
            setSelectedOption(null);
            setIsConfirmed(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /* ── Handlers ── */

    const handleOptionClick = (option: PaymentOption) => {
        if (option.id === "other") {
            setIsOtherModalOpen(true);
            return;
        }
        setSelectedOption(option);
        setStep("confirmation");
    };

    const handleOtherModalClose = () => {
        setIsOtherModalOpen(false);
        onClose();
    };

    const handleOtherModalBack = () => {
        setIsOtherModalOpen(false);
    };

    const handleBack = () => {
        if (step === "confirmation") {
            setStep("selection");
            setSelectedOption(null);
            setIsConfirmed(false);
        } else if (step === "success") {
            onClose();
        } else {
            onBack?.();
        }
    };

    const handleConfirmYes = () => {
        setIsConfirmed(true);
    };

    const handleConfirmNo = () => {
        setIsConfirmed(false);
        setSelectedOption(null);
        setStep("selection");
    };

    const handleSubmitRequest = () => {
        setStep("success");
    };

    /* ── Render ── */

    return (
        <>
            <div
                className="pim-overlay"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-label="Payment Issue"
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

                        {/* ── Step: Selection ── */}
                        {step === "selection" && (
                            <>
                                <h3 className="pim-heading">Payment Issue</h3>
                                <p className="pim-subtext">
                                    Please select the type of payment problem
                                </p>

                                {/* ── Options List ── */}
                                <ul className="pim-options-list" role="list">
                                    {PAYMENT_OPTIONS.map((option) => (
                                        <li key={option.id} role="listitem">
                                            <button
                                                className="pim-option-btn"
                                                type="button"
                                                onClick={() => handleOptionClick(option)}
                                            >
                                                <span className="pim-option-icon" aria-hidden="true" />
                                                <span className="pim-option-label">{option.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* ── Step: Confirmation ── */}
                        {step === "confirmation" && (
                            <div className="pim-confirm">

                                {/* Green Badge */}
                                <div
                                    className="pim-confirm-badge"
                                    aria-label={`Payment Issue → ${selectedOption?.label}`}
                                >
                                    {/* Tick box */}
                                    <span className="pim-confirm-badge-icon" aria-hidden="true">
                                        <Icon icon="mdi:check" width={14} height={14} />
                                    </span>
                                    <span className="pim-confirm-badge-text">
                                        Payment Issue &rarr; {selectedOption?.label}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="pim-confirm-title">Confirm Support Call</h3>

                                {/* Description */}
                                <p className="pim-confirm-desc">
                                    Our support team will contact you within 24 hours regarding
                                    your transaction issue. Please confirm to proceed.
                                </p>

                                {/* Phone Number Display */}
                                <div className="pim-confirm-phone" aria-label="Phone number">
                                    +91 XXXXXXX432
                                </div>

                                {/* Action Buttons */}
                                <div className="pim-confirm-actions">
                                    {/* Yes */}
                                    <button
                                        type="button"
                                        className="pim-confirm-btn pim-confirm-btn--yes"
                                        onClick={handleConfirmYes}
                                        aria-label="Confirm support call"
                                    >
                                        <span className="pim-btn-icon" aria-hidden="true">
                                            <Icon icon="iconamoon:check-bold" width={14} height={14} />
                                        </span>
                                        Yes
                                    </button>

                                    {/* No */}
                                    <button
                                        type="button"
                                        className="pim-confirm-btn pim-confirm-btn--no"
                                        onClick={handleConfirmNo}
                                        aria-label="Cancel and go back"
                                    >
                                        <span className="pim-btn-icon" aria-hidden="true">
                                            <Icon icon="iconoir:cancel" width={16} height={16} />
                                        </span>
                                        No
                                    </button>
                                </div>

                                {/* Submit Section (shown after Yes) */}
                                {isConfirmed && (
                                    <>
                                        <div className="pim-divider" aria-hidden="true" />
                                        <button
                                            type="button"
                                            className="pim-submit-btn"
                                            onClick={handleSubmitRequest}
                                            aria-label="Submit support request"
                                        >
                                            Submit Request
                                        </button>
                                    </>
                                )}
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

            {/* ── Payment Issue → Other Sub-Modal ── */}
            <PaymentIssueOtherModal
                isOpen={isOtherModalOpen}
                onClose={handleOtherModalClose}
                onBack={handleOtherModalBack}
            />
        </>
    );
}