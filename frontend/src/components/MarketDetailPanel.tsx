import React from 'react';
import { MarketDetail } from '@/lib/api';
import { X, Store, ArrowRight } from 'lucide-react';

interface MarketDetailPanelProps {
  market: MarketDetail | null;
  onClose: () => void;
}

export default function MarketDetailPanel({ market, onClose }: MarketDetailPanelProps) {
  if (!market) return null;

  return (
    <div className="w-full md:w-96 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-5 text-sm">
      {/* Title Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase px-2 py-0.5 rounded font-mono bg-amber-950 text-amber-300 border border-amber-800">
              Wholesale Market
            </span>
            <h3 className="text-base font-bold text-white leading-tight">{market.name}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">{market.market_id} • Pune District</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Market Attributes */}
      <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Market Type</span>
          <span className="text-slate-200 font-medium truncate block">{market.market_type}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Normal Supply Index</span>
          <span className="text-emerald-400 font-bold text-sm">{market.normal_supply_index} / 100</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Connected Farms</span>
          <span className="text-slate-200 font-semibold">{market.connected_parcels_count} Parcels</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Location</span>
          <span className="text-slate-300">{market.latitude.toFixed(2)}, {market.longitude.toFixed(2)}</span>
        </div>
      </div>

      {/* Handled Crop Categories */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono mb-2">
          Handled Crop Categories
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {market.crop_categories.map((c) => (
            <span key={c} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Top Connected Crops */}
      {market.top_crops && market.top_crops.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono mb-2">
            Top Connected Inbound Crops
          </h4>
          <div className="space-y-1 font-mono text-xs">
            {market.top_crops.map((item) => (
              <div key={item.crop} className="flex justify-between items-center p-1.5 bg-slate-950/40 rounded border border-slate-800/60">
                <span className="text-slate-300">{item.crop}</span>
                <span className="text-slate-400">{item.count} farm links</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prototype Relationship Notice */}
      <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded border border-slate-800">
        <p>
          <strong>Prototype Supply Relationships:</strong> Market connections calculated based on geospatial distance decay and crop category compatibility.
        </p>
      </div>
    </div>
  );
}
