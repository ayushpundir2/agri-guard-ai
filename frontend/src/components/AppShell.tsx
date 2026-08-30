'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import TopHeader from '@/components/TopHeader';
import { useAuth } from '@/context/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  disasterStatus?: 'NORMAL' | 'ACTIVE_FLOOD';
  activeEventName?: string | null;
}

export default function AppShell({
  children,
  disasterStatus = 'NORMAL',
  activeEventName
}: AppShellProps) {
  const { user, loading } = useAuth();

  // While checking stored JWT / auth state or when unauthenticated before router redirect fires
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-civic-ivory text-civic-charcoal flex flex-col items-center justify-center p-6 font-sans select-none">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-civic-card border border-civic-neutral shadow-lg max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-civic-forest/10 border border-civic-forest/20 text-civic-forest flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-civic-forest tracking-tight uppercase">
              Verifying Security Credentials
            </h3>
            <p className="text-xs text-civic-charcoal/70 font-mono">
              Restoring AgriGuard session state...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-civic-ivory text-civic-charcoal flex font-sans antialiased select-none">
      {/* Shared Navigation Sidebar */}
      <Sidebar
        systemStatus={disasterStatus === 'ACTIVE_FLOOD' ? 'Disaster Active' : 'All Systems Operational'}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Center Header */}
        <TopHeader
          disasterStatus={disasterStatus}
          activeEventName={activeEventName}
        />

        {/* Page Content Container */}
        <main className="p-6 md:p-8 flex flex-col gap-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
          {children}

          {/* Data Honesty Footer */}
          <footer className="mt-auto border-t border-civic-neutral pt-6 text-xs text-civic-charcoal/70 flex flex-col md:flex-row justify-between items-center gap-2 font-mono">
            <p className="text-civic-saffron font-medium">
              <strong>Data Honesty Disclaimer:</strong> Illustrative dataset & risk models — not official government predictions, legal land ownership, or market forecasts.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
