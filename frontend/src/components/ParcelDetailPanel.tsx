import React from 'react';
import { ParcelDetail } from '@/lib/api';
import { X, AlertTriangle, CloudRain } from 'lucide-react';

interface ParcelDetailPanelProps {
  parcel: ParcelDetail | null;
  onClose: () => void;
}

export default function ParcelDetailPanel({ parcel, onClose }: ParcelDetailPanelProps) {
  if (!parcel) return null;

  const ev = parcel.evidence;
  const flood = parcel.active_flood_impact;

  return (
    <div className="w-full md:w-96 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-5 text-sm">
      {/* Title Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              Parcel
            </span>
            <h3 className="text-lg font-bold text-white font-mono">{parcel.parcel_id}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Pune Agricultural Belt, Maharashtra</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Flood Impact Section (if affected) */}
      {flood && (
        <div className="bg-cyan-950/40 border border-cyan-800/80 rounded-lg p-3.5 space-y-2.5 font-mono">
          <div className="flex items-center gap-2 text-cyan-300 border-b border-cyan-800/60 pb-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Flood Event Impact</span>
          </div>

          <div className="text-xs space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Event:</span>
              <span className="font-semibold text-cyan-200 truncate max-w-[180px]">{flood.flood_event_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Flood Exposure:</span>
              <span className="font-bold text-cyan-300">{flood.overlap_percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Affected Area:</span>
              <span>{flood.affected_area_acres} Acres</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Exposure Level:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ${
                flood.exposure_level === 'SEVERE' ? 'bg-red-950 text-red-300 border border-red-800' :
                flood.exposure_level === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                flood.exposure_level === 'MODERATE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                {flood.exposure_level}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-cyan-900/60">
              <span className="text-slate-400">Est. Crop Damage:</span>
              <span className="text-base font-bold text-orange-400">{flood.estimated_crop_damage} / 100</span>
            </div>
          </div>
        </div>
      )}

      {/* Primary Crop & Specs */}
      <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Crop Type</span>
          <span className="text-slate-200 font-semibold text-base">{parcel.crop_type}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Area</span>
          <span className="text-slate-200 font-semibold text-base">{parcel.area_acres} Acres</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Status</span>
          <span className={`inline-block text-xs font-bold uppercase mt-0.5 ${
            parcel.cultivation_status === 'active' ? 'text-emerald-400' :
            parcel.cultivation_status === 'inactive' ? 'text-red-400' : 'text-amber-400'
          }`}>
            {parcel.cultivation_status}
          </span>
        </div>
      </div>

      {/* AI Cultivation Evidence Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Cultivation Evidence
          </span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-lg font-bold text-emerald-400">
              {ev ? ev.evidence_score : parcel.evidence_score ?? 'N/A'}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>

        {/* Evidence Component Scores */}
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Crop Activity Score</span>
            <span className="text-slate-200">{parcel.crop_activity_score}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${parcel.crop_activity_score}%` }} />
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-400">Historical Activity Score</span>
            <span className="text-slate-200">{parcel.historical_activity_score}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{ width: `${parcel.historical_activity_score}%` }} />
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-400">Market Linkage Score</span>
            <span className="text-slate-200">{parcel.market_linkage_score}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${parcel.market_linkage_score}%` }} />
          </div>
        </div>

        {/* Mandatory Evidence Disclaimer */}
        <div className="pt-2 text-[11px] text-amber-300/80 bg-amber-950/30 border border-amber-900/40 p-2.5 rounded text-left">
          <p className="leading-snug">
            <strong>AI-assisted cultivation evidence</strong> — requires administrative verification. Not legal proof of tenancy or land ownership.
          </p>
        </div>
      </div>

      {/* Connected Markets */}
      {parcel.connected_markets && parcel.connected_markets.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
            Connected Wholesale Markets
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {parcel.connected_markets.map((m) => (
              <div key={m.id} className="flex justify-between items-center p-2 bg-slate-950/50 rounded border border-slate-800/80 text-xs">
                <span className="text-slate-300 truncate max-w-[180px]">{m.market_name || `Market #${m.id}`}</span>
                <span className="font-mono text-amber-400 font-semibold">{m.dependency_score}% flow</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
