import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriGuard-AI | City Food-Resilience Platform",
  description: "AI-powered City Food-Resilience Intelligence Platform targeting Pune, Maharashtra, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-civic-ivory text-civic-charcoal">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
