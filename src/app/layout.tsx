import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../styles/globals.css";
import "../styles/components.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { LayoutProvider } from "@/components/layout/LayoutContext";
import { Toaster } from "sonner";
import AuthGuard from "@/components/auth/AuthGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "NuraAI",
  description: "Futuristic, vibrant AI medical chatbot interface.",
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
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
