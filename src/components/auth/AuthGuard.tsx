"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const isAuth = !!token;
            setIsAuthenticated(isAuth);

            const isPublicRoute = pathname === "/login" || pathname === "/signup";

            if (!isAuth && !isPublicRoute) {
                // Not logged in and trying to access protected route
                router.push("/login");
            } else if (isAuth && isPublicRoute) {
                // Logged in and trying to access login/signup
                router.push("/");
            }
        };

        checkAuth();

        // Listen for storage changes (optional but good for multi-tab logout)
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, [pathname, router]);

    // Prevent flash of unauthenticated content for protected routes
    // But allow public routes to show immediately
    const isPublicRoute = pathname === "/login" || pathname === "/signup";

    if (isAuthenticated === null && !isPublicRoute) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}
