"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import "@/styles/auth-guard.css";

interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = useRelativePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    // Normalize pathname (remove trailing slash and handle null)
    function useRelativePathname() {
        const path = usePathname();
        return (path || "").replace(/\/$/, "") || "/";
    }

    const normalizedPath = pathname === "" ? "/" : pathname;
    const isPublicRoute = normalizedPath === "/login" || normalizedPath === "/signup";

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            // Check for presence and avoid common falsey string values
            const isAuth = !!token && token !== "null" && token !== "undefined" && token !== "";

            console.log("[AuthGuard] Checking auth...", { pathname, normalizedPath, isAuth, isPublicRoute });

            setIsAuthenticated(isAuth);

            if (!isAuth && !isPublicRoute) {
                console.log("[AuthGuard] Not authenticated on protected route, redirecting to /login");
                router.replace("/login");
            } else if (isAuth && isPublicRoute) {
                console.log("[AuthGuard] Authenticated on public route, redirecting to /");
                router.replace("/");
            }
        };

        checkAuth();

        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, [pathname, router, isPublicRoute, normalizedPath]);

    // CRITICAL FIX: If we are on a public route, ALWAYS render children immediately.
    // This prevents the infinite loader if pathname is slow to hydrate or if checkAuth takes a frame.
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Show loading splash while checking auth for protected routes
    if (isAuthenticated === null || isAuthenticated === false) {
        return (
            <div className="auth-guard-loading">
                <div className="auth-guard-spinner"></div>
            </div>
        );
    }

    return <>{children}</>;
}
