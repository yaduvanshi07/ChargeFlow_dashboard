"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import "./ticket-conversation-view.css";

/* ── Props ─────────────────────────────────────────────────────────── */

interface TicketConversationViewProps {
    isOpen: boolean;
    onClose: () => void;
}

/* ── Message Type ───────────────────────────────────────────────────── */

type Message = {
    id: string;
    sender: "user" | "agent";
    text: string;
    timestamp: string;
};

/* ── Initial Messages ────────────────────────────────────────────────── */

const INITIAL_MESSAGES: Message[] = [
    {
        id: "msg_1",
        sender: "user",
        text: "Hello, a payment of ₹450 was deducted from my bank account for a charging session, but the app is still showing the session as unpaid, please check.",
        timestamp: "2:17 PM",
    },
    {
        id: "msg_2",
        sender: "agent",
        text: "Hi Rajesh Kumar, thank you for informing us. could you please share the transaction id or a screenshot of the payment confirmation?",
        timestamp: "2:17 PM",
    },
    {
        id: "msg_3",
        sender: "user",
        text: "Sure, The Transaction ID is TXN-78456321. I have also uploaded the payment screenshot.",
        timestamp: "2:18 PM",
    },
    {
        id: "msg_4",
        sender: "agent",
        text: "Thank you for the details. we are verifying the transaction with our payment gateway. please allow us 10–15 minutes.",
        timestamp: "2:18 PM",
    },
    {
        id: "msg_5",
        sender: "agent",
        text: "The payment has been successfully verified. we have updated the session status in the system.\nkindly refresh your app and check again.",
        timestamp: "2:19 PM",
    },
    {
        id: "msg_6",
        sender: "user",
        text: "Yes, it is showing as paid now. thank you for the quick support.",
        timestamp: "2:20 PM",
    },
    {
        id: "msg_7",
        sender: "agent",
        text: "You're Welcome 😊\nif you need any further assistance, feel free to reach out.",
        timestamp: "2:20 PM",
    },
];

/* ── Helper ─────────────────────────────────────────────────────────── */

function getTimestamp(): string {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ── Component ──────────────────────────────────────────────────────── */

export default function TicketConversationView({
    isOpen,
    onClose,
}: TicketConversationViewProps) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

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

    /* Auto-scroll to bottom whenever messages change */
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    /* Reset messages when closed */
    useEffect(() => {
        if (!isOpen) {
            setMessages(INITIAL_MESSAGES);
            setInputValue("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /* ── Send Handler ── */
    const handleSend = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        const newMsg: Message = {
            id: `msg_${Date.now()}`,
            sender: "agent",
            text: trimmed,
            timestamp: getTimestamp(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    /* ── Render ── */

    return (
        <div
            className="tcv-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Ticket Conversation"
        >
            <div
                className="tcv-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <header className="tcv-header">
                    <div className="tcv-logo-wrapper">
                        <img
                            src="/no-bg.png"
                            alt="ChargeFlow Logo"
                            className="tcv-logo"
                        />
                        <h2 className="tcv-header-title">ChargeFlow Support</h2>
                    </div>
                    <button
                        className="tcv-header-btn"
                        onClick={onClose}
                        aria-label="Close conversation"
                        type="button"
                    >
                        <Icon icon="mdi:close" width={24} height={24} aria-hidden="true" />
                    </button>
                </header>

                {/* ── Ticket Info Block ── */}
                <div className="tcv-info-block">
                    <div className="tcv-info-details">
                        <h3 className="tcv-ticket-id">TKT-2401</h3>
                        <p className="tcv-ticket-row">
                            <span className="tcv-ticket-label">Description: </span>
                            Payment Deducted But Not Reflected
                        </p>
                        <p className="tcv-ticket-row">
                            <span className="tcv-ticket-label">Category: </span>
                            Payment Issue
                        </p>
                    </div>
                    <div className="tcv-status-badge" aria-label="Status: In Progress">
                        <Icon icon="mdi:hourglass-empty" width={14} height={14} aria-hidden="true" />
                        In Progress
                    </div>
                </div>

                {/* ── Chat Area ── */}
                <div className="tcv-chat-area" ref={chatContainerRef}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`tcv-msg-wrapper tcv-msg-wrapper--${msg.sender}`}
                        >
                            <div className="tcv-msg-bubble">
                                {msg.text}
                            </div>
                            <div className="tcv-msg-timestamp">
                                {msg.timestamp}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Input Area ── */}
                <div className="tcv-input-area">
                    <div className="tcv-input-wrapper">
                        <button className="tcv-input-mic" aria-label="Voice input" type="button">
                            <Icon icon="bx:microphone" width={18} height={18} aria-hidden="true" />
                        </button>
                        <input
                            id="tcv-message-input"
                            type="text"
                            className="tcv-input-field"
                            placeholder="Type your question here....."
                            aria-label="Type your message"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                        />
                    </div>
                    <button
                        className="tcv-send-btn"
                        onClick={handleSend}
                        aria-label="Send message"
                        type="button"
                        disabled={!inputValue.trim()}
                    >
                        <Icon icon="teenyicons:send-outline" width={22} height={22} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}
