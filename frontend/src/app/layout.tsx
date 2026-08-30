import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriGuard-AI | City Food-Resilience Platform",
  description: "AI-powered City Food-Resilience Intelligence Platform targeting Pune, Maharashtra, India.",
  icons: {
    icon: "/agriguard-emblem.png",
    shortcut: "/agriguard-emblem.png",
    apple: "/agriguard-emblem.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-civic-ivory text-civic-charcoal">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
