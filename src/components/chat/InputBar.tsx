"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface InputBarProps {
    onSendMessage: (content: string) => void;
}

export default function InputBar({ onSendMessage }: InputBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <footer className="chat-footer" style={{ marginBottom: '-0.5rem' }}>
            <form onSubmit={handleSubmit} className={`input-container ${isFocused ? 'focused' : ''}`}>
                <textarea
                    ref={textareaRef}
                    className="chat-input"
                    placeholder="Ask anything about your health..."
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                <div className="flex items-center gap-3 self-end pb-1">
                    <motion.button
                        type="submit"
                        className="btn-send"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!message.trim()}
                    >
                        <Send size={20} strokeWidth={2.5} />
                    </motion.button>
                </div>
            </form>
        </footer>
    );
}
