import React from 'react';

interface MetricsBarProps {
  metrics: {
    parcels_monitored: number;
    active_cultivation_count: number;
    markets_connected: number;
    crops_represented: number;
  } | null;
}

export default function MetricsBar({ metrics }: MetricsBarProps) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
        <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
          Parcels Monitored
        </span>
        <span className="text-2xl font-bold text-slate-100 font-mono">
          {metrics.parcels_monitored}
        </span>
      </div>

      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
        <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
          Active Cultivation
        </span>
        <span className="text-2xl font-bold text-emerald-400 font-mono">
          {metrics.active_cultivation_count}
        </span>
      </div>

      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
        <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
          Markets Connected
        </span>
        <span className="text-2xl font-bold text-amber-400 font-mono">
          {metrics.markets_connected}
        </span>
      </div>

      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
        <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
          Crops Represented
        </span>
        <span className="text-2xl font-bold text-indigo-400 font-mono">
          {metrics.crops_represented}
        </span>
      </div>
    </div>
  );
}
