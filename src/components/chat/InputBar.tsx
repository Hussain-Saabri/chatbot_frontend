"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

interface InputBarProps {
    onSendMessage: (content: string) => void;
}

export default function InputBar({ onSendMessage }: InputBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <footer className="chat-footer">
            <form onSubmit={handleSubmit} className={`input-container ${isFocused ? 'focused' : ''}`}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Describe your symptoms or ask a medical question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                <div className="flex items-center gap-3">
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
