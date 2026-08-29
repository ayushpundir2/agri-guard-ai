import React from 'react';
import { MarketDetail } from '@/lib/api';
import { X, Store } from 'lucide-react';

interface MarketDetailPanelProps {
  market: MarketDetail | null;
  onClose: () => void;
}

export default function MarketDetailPanel({ market, onClose }: MarketDetailPanelProps) {
  if (!market) return null;

  return (
    <div className="w-full md:w-96 bg-civic-card border border-civic-neutral rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-sm font-mono select-none">
      <div className="flex items-start justify-between border-b border-civic-neutral pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase px-2 py-0.5 rounded bg-civic-saffron/10 text-civic-saffron border border-civic-saffron/30 font-bold">
              Wholesale Market
            </span>
            <h3 className="text-base font-bold text-civic-forest leading-tight">{market.name}</h3>
          </div>
          <p className="text-xs text-civic-charcoal/70 mt-1 font-mono">{market.market_id} • Pune District</p>
        </div>
        <button
          onClick={onClose}
          className="text-civic-charcoal/60 hover:text-civic-charcoal p-1 rounded-lg hover:bg-civic-ivory transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-civic-ivory/60 p-3 rounded-xl border border-civic-neutral text-xs">
        <div>
          <span className="text-[10px] text-civic-charcoal/60 uppercase block">Market Type</span>
          <span className="text-civic-forest font-medium truncate block">{market.market_type}</span>
        </div>
        <div>
          <span className="text-[10px] text-civic-charcoal/60 uppercase block">Normal Supply Index</span>
          <span className="text-civic-leaf font-bold text-sm">{market.normal_supply_index} / 100</span>
        </div>
        <div>
          <span className="text-[10px] text-civic-charcoal/60 uppercase block">Connected Farms</span>
          <span className="text-civic-charcoal font-semibold">{market.connected_parcels_count} Parcels</span>
        </div>
        <div>
          <span className="text-[10px] text-civic-charcoal/60 uppercase block">Location</span>
          <span className="text-civic-charcoal/80">{market.latitude.toFixed(2)}, {market.longitude.toFixed(2)}</span>
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-civic-forest font-semibold mb-2">
          Handled Crop Categories
        </h4>
        <div className="flex flex-wrap gap-1.5 font-sans">
          {market.crop_categories.map((c) => (
            <span key={c} className="px-2 py-0.5 bg-civic-ivory border border-civic-neutral text-civic-charcoal text-xs rounded-md">
              {c}
            </span>
          ))}
        </div>
      </div>

      {market.top_crops && market.top_crops.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-civic-forest font-semibold mb-2">
            Top Connected Inbound Crops
          </h4>
          <div className="space-y-1 font-mono text-xs">
            {market.top_crops.map((item) => (
              <div key={item.crop} className="flex justify-between items-center p-1.5 bg-civic-ivory/60 rounded-md border border-civic-neutral">
                <span className="text-civic-charcoal font-medium">{item.crop}</span>
                <span className="text-civic-charcoal/70">{item.count} farm links</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[11px] text-civic-charcoal/80 bg-civic-ivory/80 p-2.5 rounded-xl border border-civic-neutral font-sans leading-relaxed">
        <strong>Prototype Supply Relationships:</strong> Market connections calculated based on geospatial distance decay and crop category compatibility.
      </div>
    </div>
  );
}
