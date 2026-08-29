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
    <header className="h-16 bg-civic-card/90 backdrop-blur border-b border-civic-neutral px-6 flex items-center justify-between z-30 select-none shadow-xs">
      {/* Left Title & Tagline */}
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-sm font-bold text-civic-forest tracking-wide font-sans">
            AgriGuard Civic Operations
          </h2>
          <p className="text-[11px] text-civic-charcoal/70 font-sans">
            Know what feeds your city. Know what happens when it fails.
          </p>
        </div>
      </div>

      {/* Center Prototype Region Badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-ivory border border-civic-neutral text-xs text-civic-charcoal font-mono">
        <MapPin className="w-3.5 h-3.5 text-civic-leaf" />
        <span>PUNE, MAHARASHTRA, INDIA</span>
      </div>

      {/* Right Live Status Pill */}
      <div className="flex items-center gap-3">
        {isFloodActive ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-civic-terracotta/10 border border-civic-terracotta text-civic-terracotta text-xs font-mono font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>ACTIVE DISASTER: {activeEventName || 'DISRUPTION DETECTED'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-civic-forest/10 border border-civic-forest/30 text-civic-forest text-xs font-mono font-semibold">
            <CheckCircle2 className="w-4 h-4 text-civic-leaf" />
            <span>SYSTEM STATE: NORMAL CONDITIONS</span>
          </div>
        )}
        <HealthBadge />
      </div>
    </header>
  );
}
