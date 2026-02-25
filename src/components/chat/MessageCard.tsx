"use client";

import { motion } from "framer-motion";

interface MessageCardProps {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

export default function MessageCard({ role, content, timestamp }: MessageCardProps) {
    const isAssistant = role === "assistant";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex ${isAssistant ? "justify-start" : "justify-end"} mb-6 bubble-fade-in`}
        >
            <div
                className={`max-w-[80%] glass-card p-6 relative group ${isAssistant
                    ? "rounded-bl-none border-l-4 border-l-primary-teal"
                    : "rounded-br-none bg-primary-teal/5 border-primary-teal/20"
                    }`}
            >
                {isAssistant && (
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-primary-teal flex items-center justify-center text-[10px] text-white font-bold">
                            DR
                        </div>
                        <span className="text-[10px] font-bold text-primary-teal uppercase tracking-widest">NURA ANALYSIS</span>
                    </div>
                )}

                <div className="text-sm leading-relaxed text-text-primary">
                    {content}
                </div>

                <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] text-text-muted font-medium">{timestamp}</span>
                    {isAssistant && (
                        <div className="flex gap-2">
                            <button className="text-[10px] font-bold text-primary-teal hover:underline">COPY</button>
                            <button className="text-[10px] font-bold text-primary-teal hover:underline">FEEDBACK</button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
