import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "../styles/components.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { LayoutProvider } from "@/components/layout/LayoutContext";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nova AI | Next-Gen AI Healthcare",
  description: "Futuristic, vibrant AI medical chatbot interface.",
};

import AuthGuard from "@/components/auth/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ThemeProvider>
          <AuthGuard>
            <LayoutProvider>
              {children}
              <Toaster position="top-right" richColors />
            </LayoutProvider>
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
