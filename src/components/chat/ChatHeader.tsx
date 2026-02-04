"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { useLayout } from "../layout/LayoutContext";

export default function ChatHeader() {
    const { toggleSidebar } = useLayout();

    return (
        <header className="chat-header">
            <div className="assistant-info">
                <button className="menu-btn" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="dr-avatar relative">
                    <Image
                        src="/avatar.png"
                        alt="Nura AI"
                        width={44}
                        height={44}
                        className="object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-white rounded-full" />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className="dr-name">Dr. Nura AI</span>
                    </div>
                    <span className="dr-description text-[12px] text-text-muted font-medium">Professional Healthcare Assistant</span>
                </div>
            </div>

        </header>
    );
}
