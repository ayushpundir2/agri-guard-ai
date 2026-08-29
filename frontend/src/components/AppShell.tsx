'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import TopHeader from '@/components/TopHeader';

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
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased select-none">
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
          <footer className="mt-auto border-t border-slate-800/80 pt-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2 font-mono">
            <p className="text-amber-400/90">
              <strong>Data Honesty Disclaimer:</strong> Illustrative prototype dataset & risk models — not official government predictions, legal land ownership, or market forecasts.
            </p>
            <p>Fund My Crazy — &ldquo;Surprise Us!&rdquo; Competition Project</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
