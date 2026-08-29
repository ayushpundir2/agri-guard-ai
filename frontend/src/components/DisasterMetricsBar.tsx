import React from 'react';
import { FloodOverview } from '@/lib/api';
import { AlertTriangle, ShieldAlert, Waves, Flame } from 'lucide-react';

interface DisasterMetricsBarProps {
  overview: FloodOverview | null;
}

export default function DisasterMetricsBar({ overview }: DisasterMetricsBarProps) {
  if (!overview || overview.status !== 'ACTIVE_FLOOD') return null;

  const exp = overview.exposure_distribution;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-cyan-950/30 border border-cyan-800/60 p-4 rounded-xl shadow-xl font-mono">
      <div className="p-3 bg-slate-950/70 rounded-lg border border-cyan-900/50">
        <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
          Affected Parcels
        </span>
        <span className="text-2xl font-bold text-cyan-300">
          {overview.affected_parcel_count}
        </span>
      </div>

      <div className="p-3 bg-slate-950/70 rounded-lg border border-cyan-900/50">
        <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
          Affected Cultivated Area
        </span>
        <span className="text-2xl font-bold text-amber-300">
          {overview.affected_cultivated_acres} Acres
        </span>
      </div>

      <div className="p-3 bg-slate-950/70 rounded-lg border border-cyan-900/50">
        <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
          High/Severe Exposure
        </span>
        <span className="text-2xl font-bold text-red-400">
          {(exp['HIGH'] || 0) + (exp['SEVERE'] || 0)} Parcels
        </span>
      </div>

      <div className="p-3 bg-slate-950/70 rounded-lg border border-cyan-900/50">
        <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
          Avg Estimated Crop Damage
        </span>
        <span className="text-2xl font-bold text-orange-400">
          {overview.average_crop_damage} / 100
        </span>
      </div>
    </div>
  );
}
