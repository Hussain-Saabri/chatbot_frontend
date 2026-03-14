"use client";

import { useState } from "react";
import { Copy, Check, Share2, Globe, Lock } from "lucide-react";
import Modal from "./Modal";
import { toast } from "sonner";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversationId: string;
    isShared: boolean;
    onShareToggle: (isShared: boolean) => void;
}

export default function ShareModal({
    isOpen,
    onClose,
    conversationId,
    isShared,
    onShareToggle
}: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const API = process.env.NEXT_PUBLIC_API_URL;
    
    // Construct the share URL
    const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/share/${conversationId}`
        : '';

    const handleCopy = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!", {
            className: "premium-toast success",
            duration: 2000
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/chat/conversations/${conversationId}/share`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ isShared: !isShared })
            });

            if (res.ok) {
                onShareToggle(!isShared);
                toast.success(isShared ? "Sharing disabled" : "Sharing enabled", {
                    className: "premium-toast success",
                    duration: 3000
                });
            } else {
                toast.error("Failed to toggle sharing");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onClose}
            title="Share Conversation"
            showFooter={false}
        >
            <div className="share-modal-content">
                <p className="share-subtitle">
                    Share this conversation with others. They can view the chat history in read-only mode.
                </p>

                <div className="share-link-container">
                    <div className="share-link-field">
                        <Globe size={16} className="share-link-icon" />
                        <span className="share-link-text">{shareUrl}</span>
                    </div>
                    
                    <button 
                        className={`share-copy-button ${copied ? 'copied' : ''}`}
                        onClick={handleCopy}
                        disabled={isLoading}
                    >
                        {copied ? (
                            <>
                                <Check size={16} strokeWidth={3} />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                <span>Copy Link</span>
                            </>
                        )}
                    </button>
                </div>

               

                <div className="share-footer-hint mt-4">
                    Anyone with the link can view this conversation
                </div>
            </div>
        </Modal>
    );
}
