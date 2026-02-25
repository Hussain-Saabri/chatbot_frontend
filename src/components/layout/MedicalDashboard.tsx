"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import HealthWidgets from "./HealthWidgets";
import MessageCard from "../chat/MessageCard";
import { Send, Mic, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicalDashboard() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm Dr. Nura, your AI cognitive health assistant. I've analyzed your recent biometric data from your wearables. How can I assist you today?", timestamp: "09:41 AM" },
        { role: "user", content: "I've been feeling a bit more tired than usual in the mornings. Can you check my sleep data?", timestamp: "09:42 AM" },
        { role: "assistant", content: "I've reviewed your sleep cycles from the last 7 days. Your REM sleep has decreased by 18%, and your heart rate variability (HRV) shows signs of mild physiological stress. Would you like me to suggest a recovery protocol or schedule a consultation?", timestamp: "09:43 AM" },
    ]);
    const [input, setInput] = useState("");

    return (
        <div className="app-container">
            {/* Sidebar - Minimal & Icon Based */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex flex-col gap-6 h-full min-w-0">
                {/* Top Navigation */}
                <TopBar />

                {/* Conversation Zone */}
                <div className="flex-1 glass-card p-8 flex flex-col relative overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-4 custom-scroll">
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <MessageCard
                                    key={i}
                                    role={msg.role as "user" | "assistant"}
                                    content={msg.content}
                                    timestamp={msg.timestamp}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Floating Input Bar */}
                    <div className="mt-6 relative">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 glass-pill px-4 py-1 flex items-center gap-2 text-[10px] font-bold text-primary-teal animate-bounce">
                            <Sparkles size={12} />
                            DR NURA IS THINKING...
                        </div>

                        <div className="glass-card !rounded-full p-2 flex items-center gap-2 border-primary-teal/20 shadow-xl shadow-teal-900/5">
                            <button className="p-3 text-text-muted hover:text-primary-teal transition-colors">
                                <Mic size={20} />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Dr. Nura about your health..."
                                className="flex-1 bg-transparent border-none outline-none px-2 text-sm"
                            />
                            <button
                                className="bg-primary-teal text-white p-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-teal-900/20 hover-pulse"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Right Panel - Widgets */}
            <HealthWidgets />
        </div>
    );
}
