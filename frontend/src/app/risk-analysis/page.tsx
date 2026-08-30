'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import CityRiskMetricsBar from '@/components/CityRiskMetricsBar';
import MarketRiskTable from '@/components/MarketRiskTable';
import {
  fetchRiskOverview,
  analyzeFoodRisk,
  fetchMarketRisks,
  fetchMarketDetail,
  fetchFloodOverview,
  FoodRiskOverview,
  MarketRisk,
  MarketDetail,
  FloodOverview
} from '@/lib/api';

export default function RiskAnalysisPage() {
  const [riskOverview, setRiskOverview] = useState<FoodRiskOverview | null>(null);
  const [marketRisks, setMarketRisks] = useState<MarketRisk[]>([]);
  const [floodOverview, setFloodOverview] = useState<FloodOverview | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      const [riskRes, mRisks, floodRes] = await Promise.all([
        fetchRiskOverview(),
        fetchMarketRisks(),
        fetchFloodOverview()
      ]);
      setRiskOverview(riskRes);
      setMarketRisks(mRisks);
      setFloodOverview(floodRes);
    }
    loadData();
  }, []);

  const handleAnalyzeFoodRisk = async () => {
    setAnalyzing(true);
    const riskOv = await analyzeFoodRisk();
    setRiskOverview(riskOv);
    const mRisks = await fetchMarketRisks();
    setMarketRisks(mRisks);
    setAnalyzing(false);
  };

  return (
    <AppShell
      disasterStatus={floodOverview?.status || 'NORMAL'}
      activeEventName={floodOverview?.active_event?.name}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold font-sans text-civic-forest">Risk Analysis — City Food-Supply Risk</h2>
        <p className="text-xs text-civic-charcoal/80 font-sans">
          Evaluating multi-factor risk scores combining affected production loss, crop vulnerability, and wholesale market exposure.
        </p>
      </div>

      <CityRiskMetricsBar
        riskOverview={riskOverview}
        onAnalyze={handleAnalyzeFoodRisk}
        analyzing={analyzing}
        hasActiveFlood={floodOverview?.status === 'ACTIVE_FLOOD'}
      />

      <MarketRiskTable markets={marketRisks} onSelectMarket={() => {}} />
    </AppShell>
  );
}
