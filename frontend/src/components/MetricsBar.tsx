import React from 'react';

interface MetricsBarProps {
  metrics: {
    parcels_monitored: number;
    active_cultivation_count: number;
    markets_connected: number;
    crops_represented: number;
  } | null;
  onSimulateClick?: () => void;
}

export default function MetricsBar({ metrics }: MetricsBarProps) {
  if (!metrics) return null;

  return (
    <div className="bg-slate-950/80 border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
            PUNE'S AGRICULTURAL FOOD NETWORK
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5 font-sans">
            WHAT FEEDS YOUR CITY?
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time geospatial monitoring connecting rural production parcels to city wholesale supply hubs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
            Agricultural Parcels
          </span>
          <span className="text-2xl font-bold text-slate-100">
            {metrics.parcels_monitored}
          </span>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
            Active Cultivation
          </span>
          <span className="text-2xl font-bold text-emerald-400">
            {metrics.active_cultivation_count}
          </span>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
            Connected Markets
          </span>
          <span className="text-2xl font-bold text-amber-400">
            {metrics.markets_connected}
          </span>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
            Crops Represented
          </span>
          <span className="text-2xl font-bold text-indigo-400">
            {metrics.crops_represented}
          </span>
        </div>
      </div>
    </div>
  );
}
