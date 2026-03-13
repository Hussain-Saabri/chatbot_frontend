"use client";

import { useEffect, useRef } from "react";
import { X, AlertTriangle, Activity } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: "default" | "warning" | "danger";
    children?: React.ReactNode;
    showFooter?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "default",
    children,
    showFooter = true
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden"; // Prevent scrolling
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-container menu-fade-in" ref={modalRef}>
                <div className="modal-header">
                    
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <h3 className="modal-title">{title}</h3>
                    {message && <p className="modal-message">{message}</p>}
                    {children}
                </div>

                {showFooter && (
                    <div className="modal-footer">
                        <button className="btn-modal-cancel" onClick={onClose}>
                            {cancelText}
                        </button>
                        <button 
                            className={`btn-modal-confirm ${type}`} 
                            onClick={(e) => {
                                e.stopPropagation();
                                onConfirm();
                            }}
                        >
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
