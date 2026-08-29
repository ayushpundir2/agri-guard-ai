import React from 'react';
import { FoodRiskOverview } from '@/lib/api';
import { AlertCircle, TrendingDown, Store, ShieldAlert, Cpu } from 'lucide-react';

interface CityRiskMetricsBarProps {
  riskOverview: FoodRiskOverview | null;
  onAnalyze: () => void;
  analyzing: boolean;
  hasActiveFlood: boolean;
}

export default function CityRiskMetricsBar({
  riskOverview,
  onAnalyze,
  analyzing,
  hasActiveFlood
}: CityRiskMetricsBarProps) {
  if (!hasActiveFlood) return null;

  const isAnalyzed = riskOverview && riskOverview.status === 'ANALYSIS_ACTIVE';

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-xl flex flex-col gap-4 font-mono text-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            City Food-Supply Risk Assessment
          </h2>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Cascading impact analysis from agricultural production loss to urban market availability
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tracking-wider transition cursor-pointer disabled:opacity-50"
        >
          <Cpu className="w-4 h-4" />
          {analyzing ? 'CALCULATING RISK...' : 'ANALYZE FOOD RISK'}
        </button>
      </div>

      {isAnalyzed ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">
              Overall City Food-Supply Risk
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-400">
                {riskOverview.overall_risk_score} / 100
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                riskOverview.risk_level === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                riskOverview.risk_level === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                riskOverview.risk_level === 'MODERATE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {riskOverview.risk_level}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">
              Affected Crop Production Loss
            </span>
            <span className="text-2xl font-bold text-red-400">
              {riskOverview.affected_production_tons} Tons
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">
              Exposed Wholesale Markets
            </span>
            <span className="text-2xl font-bold text-amber-300">
              {riskOverview.affected_market_count} Markets
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">
              High/Critical Priority Farms
            </span>
            <span className="text-2xl font-bold text-orange-400">
              {riskOverview.critical_priority_parcels_count} Parcels
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 text-slate-400 text-center text-xs">
          Click <strong className="text-amber-400">ANALYZE FOOD RISK</strong> to run the city supply risk and recovery prioritization engines for the active disaster scenario.
        </div>
      )}
    </div>
  );
}
