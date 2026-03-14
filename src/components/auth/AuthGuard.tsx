"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import LogoFull3D from "@/components/common/LogoFull3D";
import "@/styles/auth-guard.css";

interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    
    // Initialize splash state consistently for hydration
    const [showSplash, setShowSplash] = useState(true);

    // Synchronously check for token on initialization
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    // Normalize pathname
    const normalizedPath = (pathname || "").replace(/\/$/, "") || "/";
    const isPublicRoute = normalizedPath === "/login" || normalizedPath === "/signup" || normalizedPath === "/verify-otp";
    const isShareRoute = normalizedPath.startsWith("/share");

    // 1. Hydration & Initial State Sync
    useEffect(() => {
        setIsMounted(true);
        
        let timer: NodeJS.Timeout | null = null;

        // Skip splash on share routes
        if (isShareRoute) {
            setShowSplash(false);
        } else {
            // Show splash timer (2 seconds) for other routes
            timer = setTimeout(() => {
                setShowSplash(false);
            }, 2000);
        }

        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const isAuth = !!token && token !== "null" && token !== "undefined" && token !== "";
            setIsAuthenticated(isAuth);
        };
        checkAuth();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isShareRoute]);

    // 2. Authentication Sync (Events & Path changes)
    useEffect(() => {
        if (!isMounted) return;

        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const isAuth = !!token && token !== "null" && token !== "undefined" && token !== "";
            setIsAuthenticated(isAuth);
        };

        // Listen for updates
        window.addEventListener("storage", checkAuth);
        window.addEventListener("nura-auth-update", checkAuth);
        
        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("nura-auth-update", checkAuth);
        };
    }, [isMounted, pathname]);

    // 3. Redirection Logic (Blocked by Splash)
    useEffect(() => {
        if (!isMounted || showSplash || isAuthenticated === null) return;

        // Perform a synchronous check to ensure we don't redirect with stale state
        const token = localStorage.getItem("token");
        const currentAuth = !!token && token !== "null" && token !== "undefined" && token !== "";

        if (!currentAuth && !isPublicRoute && !isShareRoute) {
            router.replace("/login");
        } else if (currentAuth && isPublicRoute) {
            // Check if we should skip the immediate redirect (for success animations)
            const skipRedirect = sessionStorage.getItem("skip_auth_redirect") === "true";
            if (!skipRedirect) {
                router.replace("/");
            }
        }
    }, [isMounted, showSplash, isAuthenticated, isPublicRoute, router]);

    // Prevent hydration mismatch: don't render until mounted
    if (!isMounted) {
        return (
            <div className="auth-guard-loading bg-white">
                <LogoFull3D width={400} />
            </div>
        );
    }

    // Stage 1: Initial Premium Splash (Once per session)
    if (showSplash) {
        return (
            <div className="auth-guard-loading bg-white">
                <LogoFull3D width={400} />
            </div>
        );
    }

    // Stage 2: Public/Share Route Bypass
    // If we're on a public route or share route, just show it
    if (isPublicRoute || isShareRoute) {
        return <>{children}</>;
    }

    // Stage 3: Protected Route Loading
    if (isAuthenticated === null || isAuthenticated === false) {
        return (
            <div className="auth-guard-loading bg-white">
                <div className="auth-guard-spinner"></div>
            </div>
        );
    }

    // Stage 4: Authorized Content or Valid Redirect Target
    return <>{children}</>;
}
