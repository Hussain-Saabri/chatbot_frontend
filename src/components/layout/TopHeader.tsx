"use client";

import { Bell, ShieldCheck, Sun, Moon, User, Menu } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useTheme } from "@/components/ThemeContext";
import { useLayout } from "./LayoutContext";

export default function TopHeader() {
    const { theme, toggleTheme } = useTheme();
    const { toggleSidebar } = useLayout();

    return (
        <header className="chat-header">
            <div className="header-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <Logo width={130} />
            </div>

            <div className="flex flex-row items-center gap-6">
                <div className="flex items-center gap-1.5 text-text-dim/60 uppercase">
                    <ShieldCheck size={14} className="text-primary/70" />
                    <span className="text-[10px] font-bold tracking-widest opacity-70">Secure Session</span>
                </div>

                <div className="flex items-center gap-3 border-l border-divider pl-6">
                    <button
                        onClick={toggleTheme}
                        className="text-text-dim/50 hover:text-primary transition-standard"
                    >
                        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <button className="text-text-dim/50 hover:text-primary transition-standard relative">
                        <Bell size={18} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </button>

                    <div className="w-9 h-9 rounded-full bg-bg-app border border-sidebar-border flex items-center justify-center text-text-dim/40 ml-1 shadow-sm">
                        <User size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
}
