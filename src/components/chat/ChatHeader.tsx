"use client";

import { Menu, ShieldCheck, User } from "lucide-react";
import { useLayout } from "../layout/LayoutContext";
import Logo from "../common/Logo";

export default function ChatHeader() {
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



            </div>
        </header>
    );
}
