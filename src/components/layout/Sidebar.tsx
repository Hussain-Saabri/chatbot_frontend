"use client";

import {
    Plus,
    Activity,
    Settings,
    Moon,
    Sun,
    X,
    MessageSquare,
    LogOut
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Logo from "@/components/common/Logo";
import { useTheme } from "@/components/ThemeContext";
import { useLayout } from "./LayoutContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
    onConversationSelect?: (id: string) => void;
    currentId?: string | null;
}

export default function Sidebar({ onConversationSelect, currentId }: SidebarProps) {
    const [conversations, setConversations] = useState<any[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useLayout();
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL;
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    // Close settings if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };

        if (isSettingsOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSettingsOpen]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}/api/chat/conversations`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data);
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            }
        };
        fetchConversations();
    }, [currentId]);

    const handleNavClick = (id: string) => {
        if (onConversationSelect) {
            onConversationSelect(id);
        }
        if (window.innerWidth <= 1024) {
            closeSidebar();
        }
    };

    return (
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            <div className="sidebar-logo flex items-center justify-between">
                <div className="flex items-center">
                    <Logo size="md" />
                </div>
                <button
                    className="sidebar-close-btn"
                    onClick={closeSidebar}
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="nav-list custom-scroll">
                <div
                    className={`nav-link ${!currentId ? "active" : ""}`}
                    onClick={() => handleNavClick("new")}
                >
                    <Plus size={20} strokeWidth={2} />
                    <span>New Chat</span>
                </div>

                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        className={`nav-link ${currentId === conv.id ? "active" : ""}`}
                        onClick={() => handleNavClick(conv.id)}
                    >
                        <MessageSquare size={18} strokeWidth={2} className="text-text-dim" />
                        <span className="truncate">{conv.title || "Untitled Chat"}</span>
                    </div>
                ))}
            </nav>

            <div className="mt-auto pt-2 flex flex-col gap-1">
                <hr className="sidebar-divider" />

                <div className="nav-link" onClick={toggleTheme}>
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </div>

                <div className="settings-container" ref={settingsRef}>
                    <div
                        className={`nav-link ${isSettingsOpen ? "active" : ""}`}
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>

                    {isSettingsOpen && (
                        <div className="settings-menu menu-fade-in shadow-xl">
                            <div className="menu-item logout" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
