import React from 'react';
import { FloodOverview } from '@/lib/api';

interface DisasterMetricsBarProps {
  overview: FloodOverview | null;
}

export default function DisasterMetricsBar({ overview }: DisasterMetricsBarProps) {
  if (!overview || overview.status !== 'ACTIVE_FLOOD') return null;

  const exp = overview.exposure_distribution;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-civic-terracotta/10 border border-civic-terracotta/30 p-4 rounded-2xl shadow-sm font-mono text-xs">
      <div className="p-3 bg-civic-card rounded-xl border border-civic-terracotta/20">
        <span className="text-[10px] uppercase tracking-wider text-civic-charcoal/60 block mb-1">
          Affected Parcels
        </span>
        <span className="text-2xl font-bold text-civic-terracotta">
          {overview.affected_parcel_count}
        </span>
      </div>

      <div className="p-3 bg-civic-card rounded-xl border border-civic-terracotta/20">
        <span className="text-[10px] uppercase tracking-wider text-civic-charcoal/60 block mb-1">
          Affected Cultivated Area
        </span>
        <span className="text-2xl font-bold text-civic-saffron">
          {overview.affected_cultivated_acres} Acres
        </span>
      </div>

      <div className="p-3 bg-civic-card rounded-xl border border-civic-terracotta/20">
        <span className="text-[10px] uppercase tracking-wider text-civic-charcoal/60 block mb-1">
          High/Severe Exposure
        </span>
        <span className="text-2xl font-bold text-civic-red">
          {(exp['HIGH'] || 0) + (exp['SEVERE'] || 0)} Parcels
        </span>
      </div>

      <div className="p-3 bg-civic-card rounded-xl border border-civic-terracotta/20">
        <span className="text-[10px] uppercase tracking-wider text-civic-charcoal/60 block mb-1">
          Avg Estimated Crop Damage
        </span>
        <span className="text-2xl font-bold text-civic-terracotta">
          {overview.average_crop_damage} / 100
        </span>
      </div>
    </div>
  );
}
