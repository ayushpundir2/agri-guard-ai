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
    <div className="bg-slate-950/90 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Store className="w-4 h-4 text-amber-400" />
          MOST EXPOSED WHOLESALE MARKETS
        </h3>
        <span className="text-[10px] text-slate-500">Ranked by Exposure Score</span>
      </div>

      <div className="overflow-x-auto max-h-72 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
              <th className="p-2.5">Wholesale Market</th>
              <th className="p-2.5 text-center">Exposure Score</th>
              <th className="p-2.5 text-center">Risk Level</th>
              <th className="p-2.5 text-right">Estimated Supply Loss</th>
              <th className="p-2.5 text-right">Connected Farms</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {markets.map((m) => (
              <tr
                key={m.id}
                onClick={() => onSelectMarket(m.market_id)}
                className="hover:bg-slate-900/80 cursor-pointer transition"
              >
                <td className="p-2.5 font-bold text-slate-200">{m.market_name}</td>
                <td className="p-2.5 text-center font-bold text-amber-400">{m.exposure_score} / 100</td>
                <td className="p-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                    m.exposure_level === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                    m.exposure_level === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                    m.exposure_level === 'MODERATE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {m.exposure_level}
                  </span>
                </td>
                <td className="p-2.5 text-right text-red-300 font-semibold">{m.affected_supply_tons} Tons</td>
                <td className="p-2.5 text-right text-slate-400">{m.affected_parcels_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
