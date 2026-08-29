import React from 'react';
import { MarketRisk } from '@/lib/api';
import { Store } from 'lucide-react';

interface MarketRiskTableProps {
  markets: MarketRisk[];
  onSelectMarket: (marketId: string) => void;
}

export default function MarketRiskTable({ markets, onSelectMarket }: MarketRiskTableProps) {
  if (!markets || markets.length === 0) return null;

  return (
    <div className="bg-civic-card border border-civic-neutral p-5 rounded-2xl shadow-sm flex flex-col gap-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-civic-neutral pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-civic-forest flex items-center gap-2">
          <Store className="w-4 h-4 text-civic-saffron" />
          MOST EXPOSED WHOLESALE MARKETS
        </h3>
        <span className="text-[10px] text-civic-charcoal/60">Ranked by Exposure Score</span>
      </div>

      <div className="overflow-x-auto max-h-72 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-civic-neutral text-civic-charcoal/60 text-[10px] uppercase">
              <th className="p-2.5">Wholesale Market</th>
              <th className="p-2.5 text-center">Exposure Score</th>
              <th className="p-2.5 text-center">Risk Level</th>
              <th className="p-2.5 text-right">Estimated Supply Loss</th>
              <th className="p-2.5 text-right">Connected Farms</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-civic-neutral/60">
            {markets.map((m) => (
              <tr
                key={m.id}
                onClick={() => onSelectMarket(m.market_id)}
                className="hover:bg-civic-ivory cursor-pointer transition"
              >
                <td className="p-2.5 font-bold text-civic-forest">{m.market_name}</td>
                <td className="p-2.5 text-center font-bold text-civic-saffron">{m.exposure_score} / 100</td>
                <td className="p-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                    m.exposure_level === 'CRITICAL' ? 'bg-civic-red/10 text-civic-red border border-civic-red/30' :
                    m.exposure_level === 'HIGH' ? 'bg-civic-terracotta/10 text-civic-terracotta border border-civic-terracotta/30' :
                    m.exposure_level === 'MODERATE' ? 'bg-civic-saffron/10 text-civic-saffron border border-civic-saffron/30' :
                    'bg-civic-forest/10 text-civic-forest border border-civic-forest/30'
                  }`}>
                    {m.exposure_level}
                  </span>
                </td>
                <td className="p-2.5 text-right text-civic-red font-semibold">{m.affected_supply_tons} Tons</td>
                <td className="p-2.5 text-right text-civic-charcoal/70">{m.affected_parcels_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
