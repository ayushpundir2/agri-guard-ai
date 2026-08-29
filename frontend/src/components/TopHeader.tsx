import React from 'react';
import HealthBadge from '@/components/HealthBadge';
import { ShieldAlert, CheckCircle2, MapPin } from 'lucide-react';

interface TopHeaderProps {
  disasterStatus: 'NORMAL' | 'ACTIVE_FLOOD';
  activeEventName?: string | null;
}

export default function TopHeader({ disasterStatus, activeEventName }: TopHeaderProps) {
  const isFloodActive = disasterStatus === 'ACTIVE_FLOOD';

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800/80 px-6 flex items-center justify-between z-30 select-none">
      {/* Left Title & Tagline */}
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            AgriGuard Command Center
          </h2>
          <p className="text-[11px] text-slate-400 font-sans">
            Know what feeds your city. Know what happens when it fails.
          </p>
        </div>
      </div>

      {/* Center Prototype Region Badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <span>PUNE, MAHARASHTRA, INDIA</span>
      </div>

      {/* Right Live Status Pill */}
      <div className="flex items-center gap-3">
        {isFloodActive ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold animate-pulse">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>ACTIVE DISASTER: {activeEventName || 'DISRUPTION DETECTED'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SYSTEM STATE: NORMAL CONDITIONS</span>
          </div>
        )}
        <HealthBadge />
      </div>
    </header>
  );
}
