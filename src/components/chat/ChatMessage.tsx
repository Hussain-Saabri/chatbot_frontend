import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

interface ChatMessageProps {
    content: string;
    sender: "ai" | "user";
    timestamp: string;
    isStreaming?: boolean;
}

const ChatMessage = React.memo(({ content, sender, timestamp, isStreaming }: ChatMessageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bubble ${sender === "ai" ? "bubble-ai" : "bubble-user"}`}
        >
            <div className="flex flex-col gap-1">
                <div className="markdown-content font-medium leading-relaxed">
                    {sender === "ai" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content + (isStreaming ? " ●" : "")}
                        </ReactMarkdown>
                    ) : (
                        <p>{content}</p>
                    )}
                </div>
                <span className={`timestamp ${sender === "user" ? "text-white/70" : "text-text-dim"}`}>
                    {timestamp}
                </span>
            </div>
        </motion.div>
    );
});

ChatMessage.displayName = "ChatMessage";
export default ChatMessage;
