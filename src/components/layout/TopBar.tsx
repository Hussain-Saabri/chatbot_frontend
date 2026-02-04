"use client";

import { Activity, Bell, Search } from "lucide-react";
import Logo from "@/components/common/Logo";

export default function TopBar() {
    return (
        <header className="glass-card px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-teal ring-offset-2 glow-ring flex items-center justify-center bg-white dark:bg-gray-800">
                        <Logo size="md" iconOnly />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h1 className="text-lg font-bold">Dr. Nura AI</h1>
                    <p className="text-xs text-text-muted">Cognitive Health Assistant • Online</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="glass-pill px-4 py-2 flex items-center gap-3 w-64">
                    <Search size={18} className="text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search medical records..."
                        className="bg-transparent border-none outline-none text-sm w-full"
                    />
                </div>

                <button className="glass-pill p-2 text-text-muted hover:text-primary-teal transition-colors">
                    <Bell size={20} />
                </button>

                <div className="flex items-center gap-2 border-l border-glass-border pl-4">
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                        SYSTEM HEALTH: OPTIMAL
                    </div>
                </div>
            </div>
        </header>
    );
}
