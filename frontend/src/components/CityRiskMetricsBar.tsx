'use client';

import React from 'react';
import { FoodRiskOverview } from '@/lib/api';
import RiskGauge from '@/components/RiskGauge';
import { Cpu, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface CityRiskMetricsBarProps {
  riskOverview: FoodRiskOverview | null;
  onAnalyze: () => void;
  analyzing: boolean;
  lastAnalyzedAt?: string | null;
  hasActiveFlood: boolean;
}

export default function CityRiskMetricsBar({
  riskOverview,
  onAnalyze,
  analyzing,
  lastAnalyzedAt,
  hasActiveFlood
}: CityRiskMetricsBarProps) {
  if (!hasActiveFlood) return null;

  const isAnalyzed = riskOverview && riskOverview.status === 'ANALYSIS_ACTIVE';

  const formatTimestamp = (isoStr?: string | null) => {
    if (!isoStr) return null;
    try {
      const date = new Date(isoStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return null;
    }
  };

  const formattedTime = formatTimestamp(lastAnalyzedAt || riskOverview?.calculated_at);

  return (
    <div className="bg-civic-card border border-civic-neutral p-6 rounded-2xl shadow-sm flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-civic-neutral pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-civic-forest flex items-center gap-2 font-mono">
              <ShieldAlert className="w-4.5 h-4.5 text-civic-terracotta" />
              CITY FOOD-SUPPLY RISK ASSESSMENT
            </h2>
            {isAnalyzed && formattedTime && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-civic-leaf/10 border border-civic-leaf/30 text-civic-forest text-[10px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3 text-civic-leaf" />
                Updated at {formattedTime}
              </span>
            )}
          </div>
          <p className="text-xs text-civic-charcoal/70 mt-1 font-sans">
            Cascading impact analysis from agricultural production loss to urban market availability.
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-civic-terracotta hover:bg-civic-red text-white font-bold tracking-wider transition cursor-pointer font-mono text-xs shadow-md disabled:opacity-50"
        >
          <Cpu className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'ANALYZING RISK MODEL...' : 'ANALYZE FOOD RISK'}
        </button>
      </div>

      {isAnalyzed ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* Gauge Column */}
          <div className="md:col-span-2 flex items-center gap-6 p-4 bg-civic-ivory/60 rounded-xl border border-civic-neutral">
            <RiskGauge
              score={riskOverview.overall_risk_score}
              level={riskOverview.risk_level}
            />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-civic-charcoal/60 block mb-1">
                Risk Classification
              </span>
              <span className={`inline-block px-2.5 py-1 rounded-md text-xs uppercase font-bold font-mono ${
                riskOverview.risk_level === 'CRITICAL' ? 'bg-civic-red/10 text-civic-red border border-civic-red/30' :
                riskOverview.risk_level === 'HIGH' ? 'bg-civic-terracotta/10 text-civic-terracotta border border-civic-terracotta/30' :
                riskOverview.risk_level === 'MODERATE' ? 'bg-civic-saffron/10 text-civic-saffron border border-civic-saffron/30' :
                'bg-civic-forest/10 text-civic-forest border border-civic-forest/30'
              }`}>
                {riskOverview.risk_level} RISK LEVEL
              </span>
              <div className="flex items-center gap-1 text-[10px] text-civic-charcoal/70 mt-2 font-mono">
                <Clock className="w-3 h-3 text-civic-leaf" />
                <span>Model calculated: {formattedTime || 'Just now'}</span>
              </div>
            </div>
          </div>

          {/* Secondary Metric Cards */}
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="p-4 bg-civic-ivory/60 rounded-xl border border-civic-neutral font-mono">
              <span className="text-[10px] text-civic-charcoal/60 uppercase block mb-1">
                Crop Production Loss
              </span>
              <span className="text-2xl font-bold text-civic-red">
                {riskOverview.affected_production_tons} <span className="text-xs font-normal text-civic-charcoal/60">Tons</span>
              </span>
            </div>

            <div className="p-4 bg-civic-ivory/60 rounded-xl border border-civic-neutral font-mono">
              <span className="text-[10px] text-civic-charcoal/60 uppercase block mb-1">
                Exposed Wholesale Markets
              </span>
              <span className="text-2xl font-bold text-civic-saffron">
                {riskOverview.affected_market_count} <span className="text-xs font-normal text-civic-charcoal/60">Hubs</span>
              </span>
            </div>

            <div className="p-4 bg-civic-ivory/60 rounded-xl border border-civic-neutral font-mono">
              <span className="text-[10px] text-civic-charcoal/60 uppercase block mb-1">
                High/Critical Priority Farms
              </span>
              <span className="text-2xl font-bold text-civic-terracotta">
                {riskOverview.critical_priority_parcels_count} <span className="text-xs font-normal text-civic-charcoal/60">Parcels</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-civic-ivory/50 rounded-xl border border-civic-neutral text-civic-charcoal/70 text-center text-xs font-sans">
          Click <strong className="text-civic-terracotta font-mono">ANALYZE FOOD RISK</strong> to execute the city supply risk model and generate market exposure rankings.
        </div>
      )}
    </div>
  );
}
