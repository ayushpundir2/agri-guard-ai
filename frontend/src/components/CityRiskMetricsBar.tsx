import React from 'react';
import { FoodRiskOverview } from '@/lib/api';
import RiskGauge from '@/components/RiskGauge';
import { Cpu, ShieldAlert, ArrowRight } from 'lucide-react';

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
    <div className="bg-slate-950/90 border border-slate-800/80 p-6 rounded-2xl shadow-2xl flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-400" />
            CITY FOOD-SUPPLY RISK ASSESSMENT
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Cascading impact analysis from agricultural production loss to urban market availability.
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tracking-wider transition cursor-pointer font-mono text-xs shadow-lg shadow-amber-500/10 disabled:opacity-50"
        >
          <Cpu className="w-4 h-4" />
          {analyzing ? 'CALCULATING RISK...' : 'ANALYZE FOOD RISK'}
        </button>
      </div>

      {isAnalyzed ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* Gauge Column */}
          <div className="md:col-span-2 flex items-center gap-6 p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <RiskGauge
              score={riskOverview.overall_risk_score}
              level={riskOverview.risk_level}
            />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Risk Classification
              </span>
              <span className={`inline-block px-2.5 py-1 rounded-md text-xs uppercase font-bold font-mono ${
                riskOverview.risk_level === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                riskOverview.risk_level === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                riskOverview.risk_level === 'MODERATE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {riskOverview.risk_level} RISK LEVEL
              </span>
              <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                Calculated from production loss, wholesale market exposure, crop vulnerability & flood severity.
              </p>
            </div>
          </div>

          {/* Secondary Metric Cards */}
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">
                Estimated Crop Production Loss
              </span>
              <span className="text-2xl font-bold text-red-400">
                {riskOverview.affected_production_tons} <span className="text-xs font-normal text-slate-400">Tons</span>
              </span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">
                Exposed Wholesale Markets
              </span>
              <span className="text-2xl font-bold text-amber-300">
                {riskOverview.affected_market_count} <span className="text-xs font-normal text-slate-400">Hubs</span>
              </span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">
                High/Critical Recovery Farms
              </span>
              <span className="text-2xl font-bold text-orange-400">
                {riskOverview.critical_priority_parcels_count} <span className="text-xs font-normal text-slate-400">Parcels</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 text-slate-400 text-center text-xs font-sans">
          Click <strong className="text-amber-400 font-mono">ANALYZE FOOD RISK</strong> to execute the city supply risk model and generate market exposure rankings.
        </div>
      )}
    </div>
  );
}
