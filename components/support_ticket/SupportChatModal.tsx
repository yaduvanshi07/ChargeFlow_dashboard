import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
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

interface OptionItem {
    id: string;
    label: string;
    icon: string;
}

interface ChatMessage {
    id: string;
    sender: "bot" | "user";
    type: "text" | "issue-card" | "option-card";
    content?: string;
    timestamp: string;
    options?: OptionItem[];
    optionTitle?: string;
    flowKey?: string;
}

interface SubFlowEntry {
    botText: string;
    options?: OptionItem[];
    optionTitle?: string;
}

interface FlowDefinition {
    botText: string;
    optionTitle: string;
    options: OptionItem[];
    subFlows: Record<string, SubFlowEntry>;
}

/* ── Constants ─────────────────────────────────────────────────── */

const ISSUE_OPTIONS: IssueOption[] = [
    {
        id: "payment",
        label: "Payment Issue",
        description: "Payment debited but not reflected in your account.",
        icon: "streamline-ultimate:cash-payment-bill-bold",
    },
    {
        id: "charging",
        label: "Charging Issue",
        description: "Unable to start or complete your charging session.",
        icon: "fa6-solid:charging-station",
    },
    {
        id: "booking",
        label: "Booking Issue",
        description: "Unable to book a charger or booking not confirmed.",
        icon: "zondicons:calendar",
    },
    {
        id: "account",
        label: "Account Problem",
        description: "Login issues, wallet balance errors, or profile update problems.",
        icon: "mdi:account",
    },
    {
        id: "refund",
        label: "Refund Request",
        description: "Refund not received for a cancelled or failed session.",
        icon: "gridicons:refund",
    },
    {
        id: "other",
        label: "Other",
        description: "Any other issue not listed above.",
        icon: "basil:other-1-outline",
    },
];

const BACK_OPTION: OptionItem = {
    id: "back_to_main",
    label: "Back to main menu",
    icon: "emojione-monotone:back-arrow",
};

const CONVERSATION_FLOWS: Record<string, FlowDefinition> = {
    payment: {
        botText: "Understand you're facing a payment issue. Please choose your problem type:",
        optionTitle: "Select your payment issue:",
        options: [
            { id: "payment_not_started", label: "Payment deducted but session not started", icon: "streamline:bag-rupee-solid" },
            { id: "payment_pending", label: "Payment pending", icon: "game-icons:sands-of-time" },
            { id: "transaction_failed", label: "Transaction failed but amount debited", icon: "ep:failed" },
            { id: "refund_not_received", label: "Refund not received", icon: "mdi:cash-refund" },
            { id: "need_invoice", label: "Need invoice / payment receipt", icon: "bx:file" },
        ],
        subFlows: {
            payment_not_started: {
                botText: "We're sorry for the inconvenience. To resolve this, please provide the following details:\n\n• Transaction ID\n• Date & Time of payment\n• Charger ID\n\nPlease type these details below and our team will look into it.",
            },
            payment_pending: {
                botText: "Payment pending issues usually resolve within 24–48 hours. If it's been longer, please share:\n\n• Transaction ID\n• Payment method used\n• Amount\n\nType the details below and we'll escalate this.",
            },
            transaction_failed: {
                botText: "⚠️ It looks like your transaction failed, but the amount was deducted.\nPlease share the following details so we can check:\n• Charging station name / ID\n• Date & time of transaction\n• Amount deducted\n• Payment method (UPI/Card/Wallet)\n• Screenshot (if available)",
            },
            refund_not_received: {
                botText: "Let us check your refund status. Please provide:\n\n• Booking ID\n• Registered mobile number\n\nType the details below and we'll track your refund.",
            },
            need_invoice: {
                botText: "Sure! To generate your invoice, please share:\n\n• Booking ID or Transaction ID\n• Date of transaction\n\nWe'll send the receipt to your registered email.",
            },
        },
    },
    charging: {
        botText: "We see you're having a charging issue. Let us help you troubleshoot:",
        optionTitle: "Select your charging issue:",
        options: [
            { id: "charger_not_starting", label: "Charger not starting", icon: "mdi:power-plug-off-outline" },
            { id: "charging_stopped_midway", label: "Charging stopped midway", icon: "mdi:battery-alert-variant-outline" },
            { id: "wrong_unit_consumed", label: "Wrong units consumed shown", icon: "mdi:counter" },
            { id: "charger_offline", label: "Charger showing offline", icon: "mdi:wifi-off" },
            { id: "connector_issue", label: "Connector / cable issue", icon: "mdi:cable-data" },
        ],
        subFlows: {
            charger_not_starting: {
                botText: "Please try the following steps:\n\n1. Ensure your vehicle is properly connected\n2. Check if the charger LED is green\n3. Try restarting the session from the app\n\nIf the issue persists, share your Charger ID and we'll check remotely.",
            },
            charging_stopped_midway: {
                botText: "This could be due to a power fluctuation or vehicle-side issue. Please share:\n\n• Charger ID\n• Booking ID\n• Approximate time of disconnection\n\nWe'll investigate the logs.",
            },
            wrong_unit_consumed: {
                botText: "We'll verify the meter readings. Please provide:\n\n• Booking ID\n• Charger ID\n• Expected vs. shown units\n\nOur team will review the data.",
            },
            charger_offline: {
                botText: "The charger may be under maintenance. Please share:\n\n• Charger ID\n• Location\n\nWe'll check the status and update you.",
            },
            connector_issue: {
                botText: "We're sorry for the inconvenience. Please share:\n\n• Charger ID\n• Type of connector issue (loose, damaged, etc.)\n• Photo if possible\n\nOur maintenance team will be notified.",
            },
        },
    },
    booking: {
        botText: "Let's resolve your booking issue. What happened?",
        optionTitle: "Select your booking issue:",
        options: [
            { id: "booking_not_confirmed", label: "Booking not confirmed", icon: "mdi:calendar-remove-outline" },
            { id: "unable_to_book", label: "Unable to book a slot", icon: "mdi:calendar-lock-outline" },
            { id: "wrong_time_slot", label: "Wrong time slot assigned", icon: "mdi:clock-alert-outline" },
            { id: "cancel_booking", label: "Need to cancel booking", icon: "mdi:calendar-minus" },
            { id: "booking_disappeared", label: "Booking disappeared from app", icon: "mdi:calendar-question" },
        ],
        subFlows: {
            booking_not_confirmed: {
                botText: "Booking confirmation may take a few minutes. Please check:\n\n• Your email for a confirmation\n• The 'My Bookings' section in the app\n\nIf still not confirmed, share your Booking ID and we'll check.",
            },
            unable_to_book: {
                botText: "This could be due to slot unavailability or a technical issue. Please share:\n\n• Charger / Location you tried\n• Date & Time attempted\n• Any error message shown\n\nWe'll look into it.",
            },
            wrong_time_slot: {
                botText: "We apologize for the inconvenience. Please provide:\n\n• Booking ID\n• Requested time slot\n• Assigned time slot\n\nWe'll correct this for you.",
            },
            cancel_booking: {
                botText: "To cancel your booking, go to My Bookings → Select booking → Cancel.\n\nIf you're unable to cancel from the app, share your Booking ID and we'll assist you.\n\nNote: Cancellation policy applies as per terms.",
            },
            booking_disappeared: {
                botText: "This might be a sync issue. Please try:\n\n1. Pull to refresh on My Bookings\n2. Log out and log back in\n\nIf the booking is still missing, share your registered mobile number and approximate booking date.",
            },
        },
    },
    account: {
        botText: "Let's fix your account issue. What are you experiencing?",
        optionTitle: "Select your account issue:",
        options: [
            { id: "login_issue", label: "Unable to login", icon: "mdi:login-variant" },
            { id: "wallet_error", label: "Wallet balance error", icon: "mdi:wallet-outline" },
            { id: "profile_update", label: "Unable to update profile", icon: "mdi:account-edit-outline" },
            { id: "otp_not_received", label: "OTP not received", icon: "mdi:message-lock-outline" },
            { id: "delete_account", label: "Request account deletion", icon: "mdi:account-remove-outline" },
        ],
        subFlows: {
            login_issue: {
                botText: "Please try the following:\n\n1. Check your internet connection\n2. Clear app cache and retry\n3. Try with OTP login\n\nIf still unable to login, share your registered mobile number or email.",
            },
            wallet_error: {
                botText: "We'll check your wallet balance. Please share:\n\n• Registered mobile number\n• Expected balance\n• Last transaction amount\n\nOur team will verify and correct it.",
            },
            profile_update: {
                botText: "Some profile fields may require verification. Please share:\n\n• What field you're trying to update\n• Any error message shown\n\nWe'll assist you with the update.",
            },
            otp_not_received: {
                botText: "Please try:\n\n1. Check if your number has DND enabled\n2. Wait 60 seconds and retry\n3. Try voice OTP option\n\nIf the issue persists, share your mobile number for investigation.",
            },
            delete_account: {
                botText: "Account deletion is permanent and cannot be undone. All your data, wallet balance, and booking history will be removed.\n\nTo proceed, please confirm:\n\n• Registered mobile number\n• Reason for deletion\n\nOur team will process the request within 48 hours.",
            },
        },
    },
    refund: {
        botText: "We'll help you with your refund. What's the status?",
        optionTitle: "Select your refund issue:",
        options: [
            { id: "refund_delayed", label: "Refund delayed beyond 7 days", icon: "mdi:timer-sand" },
            { id: "partial_refund", label: "Received partial refund", icon: "mdi:cash-minus" },
            { id: "refund_wrong_account", label: "Refund credited to wrong account", icon: "mdi:bank-transfer" },
            { id: "refund_status", label: "Check refund status", icon: "mdi:magnify" },
            { id: "initiate_refund", label: "Request new refund", icon: "mdi:cash-plus" },
        ],
        subFlows: {
            refund_delayed: {
                botText: "Refunds typically take 5-7 business days. If it's been longer, please share:\n\n• Booking ID\n• Refund request date\n• Payment method used\n\nWe'll escalate this immediately.",
            },
            partial_refund: {
                botText: "The partial refund may be due to cancellation charges. Please share:\n\n• Booking ID\n• Expected refund amount\n• Received amount\n\nWe'll review the breakdown.",
            },
            refund_wrong_account: {
                botText: "We apologize for the error. Please provide:\n\n• Booking ID\n• Correct account details\n• Screenshot of refund received\n\nOur finance team will investigate.",
            },
            refund_status: {
                botText: "To check your refund status, please provide:\n\n• Booking ID or Transaction ID\n\nWe'll share the current status and expected timeline.",
            },
            initiate_refund: {
                botText: "To initiate a new refund request, please provide:\n\n• Booking ID\n• Reason for refund\n• Amount to be refunded\n\nOur team will review and process within 24 hours.",
            },
        },
    },
    other: {
        botText: "We're here to help! Please describe your issue:",
        optionTitle: "Or select from common topics:",
        options: [
            { id: "app_bug", label: "App bug / crash", icon: "mdi:bug-outline" },
            { id: "feature_request", label: "Feature request / suggestion", icon: "mdi:lightbulb-outline" },
            { id: "partnership", label: "Partnership inquiry", icon: "mdi:handshake-outline" },
            { id: "feedback", label: "General feedback", icon: "mdi:comment-text-outline" },
        ],
        subFlows: {
            app_bug: {
                botText: "We're sorry about the bug! Please share:\n\n• Device model & OS version\n• App version\n• Steps to reproduce\n• Screenshot or screen recording\n\nOur dev team will investigate.",
            },
            feature_request: {
                botText: "We love hearing your ideas! 💡 Please describe:\n\n• Feature you'd like to see\n• How it would help you\n\nWe'll share this with our product team.",
            },
            partnership: {
                botText: "Thank you for your interest! Please share:\n\n• Your name & company\n• Nature of partnership\n• Contact email\n\nOur business team will reach out within 2 business days.",
            },
            feedback: {
                botText: "We appreciate your feedback! Please share your thoughts below.\n\nYour input helps us improve ChargeFlow for everyone. 🙏",
            },
        },
    },
};

const TYPING_DELAY_MS = 600;

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

function makeBotTimestamp(): string {
    const d = new Date();
    return formatTime(d);
}

function makeIssueCardTimestamp(): string {
    const d = new Date();
    return `${formatDateFull(d)} at ${formatTime(d)}`;
}

function createTypingMessage(): ChatMessage {
    return {
        id: "typing",
        sender: "bot",
        type: "text",
        content: "typing...",
        timestamp: "",
    };
}

function createBotTextMessage(content: string): ChatMessage {
    return {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: "bot",
        type: "text",
        content,
        timestamp: makeBotTimestamp(),
    };
}

function createBotOptionCard(
    title: string,
    options: OptionItem[],
    flowKey: string
): ChatMessage {
    return {
        id: `bot-options-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: "bot",
        type: "option-card",
        timestamp: makeIssueCardTimestamp(),
        options: [...options, BACK_OPTION],
        optionTitle: title,
        flowKey,
    };
}

function createUserMessage(content: string): ChatMessage {
    return {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: "user",
        type: "text",
        content,
        timestamp: formatTime(new Date()),
    };
}

/* ── Component ─────────────────────────────────────────────────── */

export default function SupportChatModal({ isOpen, onClose }: SupportChatModalProps) {
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState("");
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const now = new Date();
    const botTimestamp = makeIssueCardTimestamp();

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "greeting",
            sender: "bot",
            type: "text",
            content: "Hi Rajesh Kumar 👋\nWelcome back to ChargeFlow Support.",
            timestamp: "",
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
            const ts = makeIssueCardTimestamp();
            setMessages([
                {
                    id: "greeting",
                    sender: "bot",
                    type: "text",
                    content: "Hi Rajesh Kumar 👋\nWelcome back to ChargeFlow Support.",
                    timestamp: "",
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

    /* Cleanup typing timer on unmount */
    useEffect(() => {
        return () => {
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        };
    }, []);

    if (!isOpen) return null;

    /* ── Bot Response Engine ─────────────────────────────────────── */

    const appendTypingThenReply = (replyMessages: ChatMessage[]) => {
        setMessages((prev) => [...prev, createTypingMessage()]);
        typingTimerRef.current = setTimeout(() => {
            setMessages((prev) => {
                const withoutTyping = prev.filter((m) => m.id !== "typing");
                return [...withoutTyping, ...replyMessages];
            });
        }, TYPING_DELAY_MS);
    };

    const handleBotResponseForIssue = (issueId: string) => {
        const flow = CONVERSATION_FLOWS[issueId];
        if (!flow) {
            appendTypingThenReply([
                createBotTextMessage("Thank you for reaching out. Please describe your issue in detail and our support team will assist you."),
            ]);
            return;
        }
        const optionMsg = createBotOptionCard(flow.optionTitle, flow.options, issueId);
        optionMsg.content = flow.botText;
        appendTypingThenReply([optionMsg]);
    };

    const handleBotResponseForSubOption = (flowKey: string, optionId: string) => {
        const flow = CONVERSATION_FLOWS[flowKey];
        if (!flow) return;

        const subFlow = flow.subFlows[optionId];
        if (!subFlow) {
            appendTypingThenReply([
                createBotTextMessage("Thank you. Please describe your issue in detail below and our team will get back to you shortly."),
            ]);
            return;
        }

        const replies: ChatMessage[] = [];
        if (subFlow.options) {
            const optionCard = createBotOptionCard(subFlow.optionTitle || "Choose an option:", subFlow.options, flowKey);
            optionCard.content = subFlow.botText;
            replies.push(optionCard);
        } else {
            replies.push(createBotTextMessage(subFlow.botText));
        }
        appendTypingThenReply(replies);
    };

    const handleBotResponseForText = (userText: string) => {
        const lower = userText.toLowerCase();
        let response: string;

        if (lower.includes("thank") || lower.includes("thanks")) {
            response = "You're welcome! 😊 Is there anything else I can help you with?";
        } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
            response = "Hello! 👋 How can I assist you today? You can select an issue from the menu or type your question.";
        } else if (lower.includes("help")) {
            response = "I'm here to help! Please select an issue category from the menu above, or describe your problem in detail.";
        } else if (
            (lower.includes("station") || lower.includes("date") || lower.includes("amount")) &&
            (lower.includes("upi") || lower.includes("card") || lower.includes("wallet"))
        ) {
            response = "✅ Thank you for the details.\nWe are verifying your transaction.\n⏳ Please wait while we check your payment status...";
            appendTypingThenReply([createBotTextMessage(response)]);
            return;
        } else {
            response = "✅ Thank you for your message.\nOur support team has been notified and will review your query.\n⏳ In the meantime, you can select an issue category above for instant help, or continue describing your problem here.";
        }

        appendTypingThenReply([createBotTextMessage(response)]);
    };

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
        setTimeout(() => {
            handleBotResponseForIssue(issue.id);
        }, 100);
    };

    const handleOptionClick = (option: OptionItem, flowKey?: string) => {
        if (option.id === "back_to_main") {
            const userMsg = createUserMessage("Back to main menu");
            setMessages((prev) => [...prev, userMsg]);
            appendTypingThenReply([
                createBotTextMessage("Sure! Let's start over. How can we help you?"),
                {
                    id: `issue-card-${Date.now()}`,
                    sender: "bot",
                    type: "issue-card",
                    timestamp: makeIssueCardTimestamp(),
                },
            ]);
            return;
        }

        const userMsg = createUserMessage(option.label);
        setMessages((prev) => [...prev, userMsg]);

        if (flowKey) {
            setTimeout(() => {
                handleBotResponseForSubOption(flowKey, option.id);
            }, 100);
        }
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
        setTimeout(() => {
            handleBotResponseForText(text);
        }, 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            if (e.shiftKey) {
                return;
            } else {
                e.preventDefault();
                handleSend();
            }
        }
    };

    /* ── Render Helpers ──────────────────────────────────────────── */

    const renderBotAvatar = () => (
        <div className="chat-avatar chat-avatar--bot">
            <Image
                src="/agent.png"
                alt="Support Agent"
                width={32}
                height={32}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
        </div>
    );

    const renderUserAvatar = () => (
        <div className="chat-avatar chat-avatar--user">
            <Image
                src="/user.jpg"
                alt="User"
                width={32}
                height={32}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
        </div>
    );

    // ── UPDATED: renderOptionCard with new layout ─────────────────
    const renderOptionCard = (msg: ChatMessage) => {
        const options = msg.options || [];
        return (
            <div key={msg.id}>
                <div className="chat-issue-card-wrapper">
                    {renderBotAvatar()}
                    {/* Sub option card uses new class: chat-sub-option-card */}
                    <div className="chat-sub-option-card">
                        {msg.content && (
                            <p className="chat-sub-option-card-title">{msg.content}</p>
                        )}
                        <div className="chat-sub-option-list">
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className="chat-sub-option-item"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleOptionClick(option, msg.flowKey)}
                                    onKeyDown={(e) => e.key === "Enter" && handleOptionClick(option, msg.flowKey)}
                                >
                                    <div className="chat-sub-option-item-icon">
                                        <Icon icon={option.icon} width={12} height={12} />
                                    </div>
                                    <div className="chat-sub-option-item-content">
                                        <p className="chat-sub-option-item-label">{option.label}</p>
                                    </div>
                                    <div className="chat-sub-option-item-arrow">
                                        <Icon icon="mdi:chevron-right" width={12} height={12} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Timestamp inside the box, centered */}
                        <div className="chat-sub-option-timestamp">{msg.timestamp}</div>
                    </div>
                </div>
            </div>
        );
    };

    /* ── Structured Bot Bubble ───────────────────────────────────────
       Renders messages that have a header line + bullet-point lines
       (lines starting with "•") in the styled spec layout.
       Also handles the ✅/⏳ thank-you response with same bubble spec.
    ─────────────────────────────────────────────────────────────── */
    const isStructuredBotMessage = (content: string): boolean => {
        return content.includes("•") || content.startsWith("✅");
    };

    const renderStructuredBotBubble = (msg: ChatMessage) => {
        const lines = (msg.content || "").split("\n");
        // Separate header lines (non-bullet) from bullet lines
        const headerLines: string[] = [];
        const bulletLines: string[] = [];
        let inBullets = false;

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("•")) {
                inBullets = true;
                bulletLines.push(trimmed.replace(/^•\s*/, ""));
            } else if (inBullets && trimmed === "") {
                // skip blank lines after bullets start
            } else if (!inBullets) {
                if (trimmed !== "") headerLines.push(trimmed);
            }
        });

        // For ✅ thank-you style — no bullets, just lines
        const isThankYou = (msg.content || "").startsWith("✅");

        return (
            <div key={msg.id}>
                <div className="chat-message-row chat-message-row--bot">
                    {renderBotAvatar()}
                    <div className="chat-bubble-structured">
                        {isThankYou ? (
                            // Render each line with inline emoji icons preserved
                            lines.filter(l => l.trim() !== "").map((line, i) => (
                                <p key={i} className="chat-bubble-structured-line">{line}</p>
                            ))
                        ) : (
                            <>
                                {/* Header paragraph */}
                                <p className="chat-bubble-structured-header">
                                    {headerLines.join(" ")}
                                </p>
                                {/* Bullet list */}
                                {bulletLines.length > 0 && (
                                    <ul className="chat-bubble-structured-list">
                                        {bulletLines.map((item, i) => (
                                            <li key={i} className="chat-bubble-structured-item">{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {msg.timestamp && (
                    <div className="chat-timestamp chat-timestamp--structured-right">
                        {msg.timestamp}
                    </div>
                )}
            </div>
        );
    };

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
                                            <Icon icon="mdi:chevron-right" width={14} height={14} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-timestamp chat-timestamp--left">{msg.timestamp}</div>
                        </div>
                    </div>
                </div>
            );
        }

        if (msg.type === "option-card") {
            return renderOptionCard(msg);
        }

        const isBot = msg.sender === "bot";

        // Use structured bubble for bot messages with bullets or thank-you format
        if (isBot && msg.content && isStructuredBotMessage(msg.content)) {
            return renderStructuredBotBubble(msg);
        }

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
                {msg.id !== "typing" && msg.timestamp && (
                    <div className={`chat-timestamp ${isBot ? "chat-timestamp--left" : "chat-timestamp--right"}`}>
                        {msg.timestamp}
                    </div>
                )}
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
                            <Icon icon="bx:microphone" width={18} height={18} />
                        </button>
                        <textarea
                            className="chat-input-field"
                            placeholder="Type your question here....."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                    </div>
                    <button
                        className="chat-send-button"
                        onClick={handleSend}
                        aria-label="Send message"
                    >
                        <Icon icon="teenyicons:send-outline" width={28} height={28} />
                    </button>
                </div>
            </div>
        </div>
    );
}