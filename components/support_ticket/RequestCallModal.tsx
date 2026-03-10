import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "@/components/support_ticket/request-call-modal.css";
import PaymentIssueModal from "@/components/support_ticket/PaymentIssueModal";
import OtherIssueModal from "@/components/support_ticket/other-issue-modal";

/* ── Props ─────────────────────────────────────────────────────────── */

interface RequestCallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/* ── Issue Options ─────────────────────────────────────────────────── */

interface IssueOption {
    id: string;
    label: string;
    icon: string;
}

const ISSUE_OPTIONS: IssueOption[] = [
    {
        id: "payment",
        label: "Payment Issue",
        icon: "streamline-ultimate:cash-payment-bill-bold",
    },
    {
        id: "charging",
        label: "Charging Issue",
        icon: "fa6-solid:charging-station",
    },
    {
        id: "booking",
        label: "Booking Issue",
        icon: "zondicons:calendar",
    },
    {
        id: "account",
        label: "Account Issue",
        icon: "mdi:account",
    },
    {
        id: "refund",
        label: "Refund Issue",
        icon: "gridicons:refund",
    },
    {
        id: "other",
        label: "Other",
        icon: "mdi:dots-horizontal",
    },
];

/* ── Component ─────────────────────────────────────────────────────── */

export default function RequestCallModal({ isOpen, onClose }: RequestCallModalProps) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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

    if (!isOpen) return null;

    const handleIssueClick = (issue: IssueOption) => {
        if (issue.id === "payment") {
            setIsPaymentModalOpen(true);
        } else if (issue.id === "other") {
            setIsOtherModalOpen(true);
        }
    };

    const handlePaymentModalClose = () => {
        setIsPaymentModalOpen(false);
        onClose();
    };

    const handlePaymentModalBack = () => {
        setIsPaymentModalOpen(false);
    };

    const handleOtherModalClose = () => {
        setIsOtherModalOpen(false);
        onClose();
    };

    const handleOtherModalBack = () => {
        setIsOtherModalOpen(false);
    };

    return (
        <>
            <div
                className="rcm-overlay"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-label="Request a Call"
            >
                <div
                    className="rcm-container"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ── Header ── */}
                    <div className="rcm-header">
                        <h2 className="rcm-header-title">ChargeFlow Support</h2>
                        <button
                            className="rcm-header-close"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <Icon icon="mdi:close" width={24} height={24} />
                        </button>
                    </div>

                    {/* ── Body ── */}
                    <div className="rcm-body">
                        <h3 className="rcm-heading">Request a Call</h3>
                        <p className="rcm-subtext">
                            Please select the type of issue you're facing:
                        </p>

                        {/* ── Issue Grid ── */}
                        <div className="rcm-issue-grid">
                            {ISSUE_OPTIONS.map((issue) => (
                                <button
                                    key={issue.id}
                                    className="rcm-issue-btn"
                                    onClick={() => handleIssueClick(issue)}
                                    type="button"
                                >
                                    <span className="rcm-issue-icon">
                                        <Icon icon={issue.icon} width={22} height={22} />
                                    </span>
                                    <span className="rcm-issue-label">{issue.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Payment Issue Sub-Modal ── */}
            <PaymentIssueModal
                isOpen={isPaymentModalOpen}
                onClose={handlePaymentModalClose}
                onBack={handlePaymentModalBack}
            />

            {/* ── Other Issue Sub-Modal ── */}
            <OtherIssueModal
                isOpen={isOtherModalOpen}
                onClose={handleOtherModalClose}
                onBack={handleOtherModalBack}
            />
        </>
    );
}
