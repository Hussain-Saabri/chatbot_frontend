"use client";

import React, { createContext, useContext, useState } from "react";

interface LayoutContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    // Start with true for desktop-first feel, or false if you prefer mobile-first
    // Here we initialize to true, but we'll refine it in useEffect to be responsive
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Synchronize with screen size on mount
    React.useEffect(() => {
        if (window.innerWidth <= 1024) {
            setIsSidebarOpen(false);
        }
    }, []);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <LayoutContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        return { isSidebarOpen: false, toggleSidebar: () => { }, closeSidebar: () => { } };
    }
    return context;
}
