"use client";

import { Bell, Search, Sun, Moon, User } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useTheme } from "@/components/ThemeContext";

export default function TopHeader() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="top-header">
            <div className="header-left">
                <div className="assistant-profile">
                    <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center border border-primary/20 overflow-hidden">
                        <Logo size="sm" iconOnly />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">Dr. Nura AI</span>
                            <div className="status-badge">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span>Verified</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-text-muted font-medium">Online • HIPAA Compliant</p>
                    </div>
                </div>
            </div>

            <div className="header-right">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-app rounded-md border border-sidebar-border mr-4">
                    <Search size={14} className="text-text-dim" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="bg-transparent border-none outline-none text-xs w-48 text-text-main"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="icon-btn transition-standard"
                    >
                        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <button className="icon-btn relative">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-bg-surface" />
                    </button>

                    <div className="w-8 h-8 rounded-full bg-bg-app border border-sidebar-border flex items-center justify-center text-text-muted ml-2 cursor-pointer hover:border-primary transition-standard">
                        <User size={16} />
                    </div>
                </div>
            </div>
        </header>
    );
}
