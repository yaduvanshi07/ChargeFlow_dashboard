import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import "@/components/support_ticket/support-chat-modal.css";

/* ── Types ─────────────────────────────────────────────────────── */

interface SupportChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IssueOption {
    id: string;
    label: string;
    description: string;
    icon: string;
}

interface ChatMessage {
    id: string;
    sender: "bot" | "user";
    type: "text" | "issue-card";
    content?: string;
    timestamp: string;
}

/* ── Constants ─────────────────────────────────────────────────── */

const ISSUE_OPTIONS: IssueOption[] = [
    {
        id: "payment",
        label: "Payment Issue",
        description: "Payment debited but not reflected in your account.",
        icon: "mdi:cash-multiple",
    },
    {
        id: "charging",
        label: "Charging Issue",
        description: "Unable to start or complete your charging session.",
        icon: "mdi:battery-charging-60",
    },
    {
        id: "booking",
        label: "Booking Issue",
        description: "Unable to book a charger or booking not confirmed.",
        icon: "mdi:calendar-alert",
    },
    {
        id: "account",
        label: "Account Problem",
        description: "Login issues, wallet balance errors, or profile update problems.",
        icon: "mdi:account-alert",
    },
    {
        id: "refund",
        label: "Refund Request",
        description: "Refund not received for a cancelled or failed session.",
        icon: "mdi:cash-refund",
    },
    {
        id: "other",
        label: "Other",
        description: "Any other issue not listed above.",
        icon: "mdi:dots-horizontal-circle",
    },
];

/* ── Helpers ───────────────────────────────────────────────────── */

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function formatDateFull(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
    });
}

/* ── Component ─────────────────────────────────────────────────── */

export default function SupportChatModal({ isOpen, onClose }: SupportChatModalProps) {
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState("");

    const now = new Date();
    const botTimestamp = `${formatDateFull(now)} at ${formatTime(now)}`;

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "greeting",
            sender: "bot",
            type: "text",
            content: "Hi Rajesh Kumar 👋\nWelcome back to ChargeFlow support.",
            timestamp: botTimestamp,
        },
        {
            id: "issue-card",
            sender: "bot",
            type: "issue-card",
            timestamp: botTimestamp,
        },
    ]);

    /* Lock body scroll */
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

    /* Scroll to bottom on new messages */
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({
                top: chatBodyRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    /* Reset state when modal opens */
    useEffect(() => {
        if (isOpen) {
            const openTime = new Date();
            const ts = `${formatDateFull(openTime)} at ${formatTime(openTime)}`;
            setMessages([
                {
                    id: "greeting",
                    sender: "bot",
                    type: "text",
                    content: "Hi Rajesh Kumar 👋\nWelcome back to ChargeFlow support.",
                    timestamp: ts,
                },
                {
                    id: "issue-card",
                    sender: "bot",
                    type: "issue-card",
                    timestamp: ts,
                },
            ]);
            setInputValue("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /* ── Event Handlers ──────────────────────────────────────────── */

    const handleIssueClick = (issue: IssueOption) => {
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: "user",
            type: "text",
            content: `${issue.label}\n${issue.description.charAt(0).toLowerCase()}${issue.description.slice(1)}`,
            timestamp: formatTime(new Date()),
        };
        setMessages((prev) => [...prev, userMsg]);
    };

    const handleSend = () => {
        const text = inputValue.trim();
        if (!text) return;
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: "user",
            type: "text",
            content: text,
            timestamp: formatTime(new Date()),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    /* ── Render Helpers ──────────────────────────────────────────── */

    const renderBotAvatar = () => (
        <div className="chat-avatar chat-avatar--bot">
            <Icon icon="mdi:face-agent" width={24} height={24} color="#16a34a" />
        </div>
    );

    const renderUserAvatar = () => (
        <div className="chat-avatar chat-avatar--user">
            <Icon icon="mdi:account" width={22} height={22} color="#a16207" />
        </div>
    );

    const renderMessage = (msg: ChatMessage) => {
        if (msg.type === "issue-card") {
            return (
                <div key={msg.id}>
                    <div className="chat-issue-card-wrapper">
                        {renderBotAvatar()}
                        <div className="chat-issue-card">
                            <p className="chat-issue-card-title">How can we assist you today?</p>
                            <div className="chat-issue-list">
                                {ISSUE_OPTIONS.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="chat-issue-item"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleIssueClick(issue)}
                                        onKeyDown={(e) => e.key === "Enter" && handleIssueClick(issue)}
                                    >
                                        <div className="chat-issue-item-icon">
                                            <Icon icon={issue.icon} width={16} height={16} />
                                        </div>
                                        <div className="chat-issue-item-content">
                                            <p className="chat-issue-item-label">{issue.label}</p>
                                            <p className="chat-issue-item-desc">{issue.description}</p>
                                        </div>
                                        <div className="chat-issue-item-arrow">
                                            <Icon icon="mdi:chevron-right" width={18} height={18} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="chat-timestamp chat-timestamp--left">{msg.timestamp}</div>
                </div>
            );
        }

        const isBot = msg.sender === "bot";
        return (
            <div key={msg.id}>
                <div className={`chat-message-row ${isBot ? "chat-message-row--bot" : "chat-message-row--user"}`}>
                    {isBot && renderBotAvatar()}
                    <div className={`chat-bubble ${isBot ? "chat-bubble--bot" : "chat-bubble--user"}`}>
                        {msg.content?.split("\n").map((line, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <br />}
                                {line}
                            </React.Fragment>
                        ))}
                    </div>
                    {!isBot && renderUserAvatar()}
                </div>
                <div className={`chat-timestamp ${isBot ? "chat-timestamp--left" : "chat-timestamp--right"}`}>
                    {msg.timestamp}
                </div>
            </div>
        );
    };

    /* ── Render ───────────────────────────────────────────────────── */

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal-container" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="chat-modal-header">
                    <h2 className="chat-modal-header-title">ChargeFlow Support</h2>
                    <button
                        className="chat-modal-header-close"
                        onClick={onClose}
                        aria-label="Close chat"
                    >
                        <Icon icon="mdi:close" width={24} height={24} />
                    </button>
                </div>

                {/* Chat Body */}
                <div className="chat-modal-body" ref={chatBodyRef}>
                    {messages.map(renderMessage)}
                </div>

                {/* Input Bar */}
                <div className="chat-modal-input-bar">
                    <div className="chat-input-wrapper">
                        <button className="chat-input-mic" aria-label="Voice input">
                            <Icon icon="mdi:microphone" width={22} height={22} />
                        </button>
                        <input
                            type="text"
                            className="chat-input-field"
                            placeholder="Type your question here....."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button
                        className="chat-send-button"
                        onClick={handleSend}
                        aria-label="Send message"
                    >
                        <Icon icon="mdi:send" width={22} height={22} />
                    </button>
                </div>
            </div>
        </div>
    );
}
