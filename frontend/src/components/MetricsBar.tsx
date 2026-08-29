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
    <div className="bg-civic-card border border-civic-neutral p-6 rounded-2xl shadow-sm flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between border-b border-civic-neutral pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-civic-leaf">
            PUNE&apos;S AGRICULTURAL FOOD NETWORK
          </span>
          <h2 className="text-xl font-bold text-civic-forest tracking-tight mt-0.5 font-sans">
            WHAT FEEDS YOUR CITY?
          </h2>
          <p className="text-xs text-civic-charcoal/70 font-sans mt-0.5">
            Real-time geospatial monitoring connecting rural production parcels to city wholesale supply hubs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-civic-ivory/60 rounded-xl border border-civic-neutral">
          <span className="text-[10px] uppercase tracking-wider text-civic-charcoal/60 block mb-1">
            Agricultural Parcels
          </span>
          <span className="text-2xl font-bold text-civic-forest">
            {metrics.parcels_monitored}
          </span>
        </div>

        <div className="p-4 bg-civic-ivory/60 rounded-xl border border-civic-neutral">
          <span className="text-[10px] uppercase tracking-wider text-civic-charcoal/60 block mb-1">
            Active Cultivation
          </span>
          <span className="text-2xl font-bold text-civic-leaf">
            {metrics.active_cultivation_count}
          </span>
        </div>

        <div className="p-4 bg-civic-ivory/60 rounded-xl border border-civic-neutral">
          <span className="text-[10px] uppercase tracking-wider text-civic-charcoal/60 block mb-1">
            Connected Markets
          </span>
          <span className="text-2xl font-bold text-civic-saffron">
            {metrics.markets_connected}
          </span>
        </div>

        <div className="p-4 bg-civic-ivory/60 rounded-xl border border-civic-neutral">
          <span className="text-[10px] uppercase tracking-wider text-civic-charcoal/60 block mb-1">
            Crops Represented
          </span>
          <span className="text-2xl font-bold text-civic-forest">
            {metrics.crops_represented}
          </span>
        </div>
      </div>
    </div>
  );
}
