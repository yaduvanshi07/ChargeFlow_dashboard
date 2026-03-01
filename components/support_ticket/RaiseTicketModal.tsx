import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import "@/components/support_ticket/raise-ticket-modal.css";

interface RaiseTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RaiseTicketModal({ isOpen, onClose }: RaiseTicketModalProps) {
    const [category, setCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [orderTransactionId, setOrderTransactionId] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleClose = () => {
        setCategory("");
        setSubject("");
        setDescription("");
        setOrderTransactionId("");
        setSelectedFile(null);
        setErrors({});
        onClose();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                setSelectedFile(file);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type.startsWith("image/")) {
                setSelectedFile(file);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!category) newErrors.category = "Category is required.";
        if (!subject) newErrors.subject = "Subject is required.";
        if (!description) {
            newErrors.description = "Description is required.";
        } else if (description.length < 20) {
            newErrors.description = "Description must be at least 20 characters.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        console.log("Form submitted:", {
            category,
            subject,
            description,
            orderTransactionId,
            file: selectedFile?.name || null,
        });
        handleClose();
    };

    return (
        <div className="ticket-modal-overlay" onClick={handleClose}>
            <div
                className="ticket-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="ticket-modal-header">
                    <h2>Raise A New Ticket</h2>
                    <button className="ticket-modal-close" onClick={handleClose} aria-label="Close modal">
                        <Icon icon="mdi:close" width={24} height={24} color="#757575" />
                    </button>
                </div>

                <form className="ticket-modal-body" onSubmit={handleSubmit} noValidate>
                    {/* Category */}
                    <div className="ticket-form-group">
                        <label htmlFor="ticket-category">Category</label>
                        <div className="ticket-select-wrapper">
                            <select
                                id="ticket-category"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    if (errors.category) setErrors({ ...errors, category: "" });
                                }}
                                className={`ticket-input ticket-select ${!category ? "ticket-placeholder" : ""}`}
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="Payment Issue">Payment Issue</option>
                                <option value="Technical Issue">Technical Issue</option>
                                <option value="Account Problem">Account Problem</option>
                                <option value="Service Not Working">Service Not Working</option>
                                <option value="Refund Request">Refund Request</option>
                                <option value="Other">Other</option>
                            </select>
                            <Icon icon="mdi:chevron-down" className="select-icon" />
                        </div>
                        {errors.category && <span className="ticket-error" role="alert">{errors.category}</span>}
                    </div>

                    {/* Subject / Title */}
                    <div className="ticket-form-group">
                        <label htmlFor="ticket-subject">Subject / Title</label>
                        <input
                            id="ticket-subject"
                            type="text"
                            className="ticket-input"
                            placeholder="Enter short problem title (e.g Payment Failed)"
                            value={subject}
                            onChange={(e) => {
                                setSubject(e.target.value);
                                if (errors.subject) setErrors({ ...errors, subject: "" });
                            }}
                        />
                        {errors.subject && <span className="ticket-error" role="alert">{errors.subject}</span>}
                    </div>

                    {/* Description */}
                    <div className="ticket-form-group">
                        <label htmlFor="ticket-description">Description</label>
                        <p className="ticket-helper-text">
                            Please describe your issue clearly and mention any actions you have taken in 50–150 words.
                        </p>
                        <textarea
                            id="ticket-description"
                            className="ticket-textarea"
                            placeholder="Describe your issue in detail..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) setErrors({ ...errors, description: "" });
                            }}
                        />
                        {errors.description && <span className="ticket-error" role="alert">{errors.description}</span>}
                    </div>

                    {/* Upload Screenshot */}
                    <div className="ticket-form-group">
                        <label>Upload Screenshot</label>
                        <p className="ticket-helper-text">
                            Please upload a clear screenshot that shows the exact issue you are facing to help us resolve it quickly.
                        </p>
                        <div
                            className="ticket-upload-box"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            aria-label="Upload screenshot"
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                        >
                            <Icon icon="lucide:upload" width={25.5} height={25.5} color="#757575" />
                            <p className="upload-main-text">Upload Screenshot / Invoice / Error Image</p>
                            <p className="upload-sub-text">Drag And Drop Or Click To Browse</p>
                            <button
                                type="button"
                                className="upload-browse-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                Browse Files
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>
                        {selectedFile && (
                            <p className="ticket-file-name">✓ Selected: {selectedFile.name}</p>
                        )}
                    </div>

                    {/* Order ID / Transaction ID — combined */}
                    <div className="ticket-form-group">
                        <label htmlFor="ticket-order-transaction-id">Order ID / Transaction ID</label>
                        <input
                            id="ticket-order-transaction-id"
                            type="text"
                            className="ticket-input"
                            placeholder="Enter Order ID / Transaction ID (if applicable)"
                            value={orderTransactionId}
                            onChange={(e) => setOrderTransactionId(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="ticket-submit-btn">
                        Submit Tickets
                    </button>
                </form>
            </div>
        </div>
    );
}