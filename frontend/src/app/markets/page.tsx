'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import MarketRiskTable from '@/components/MarketRiskTable';
import MarketDetailPanel from '@/components/MarketDetailPanel';
import {
  fetchMarketRisks,
  fetchMarketDetail,
  fetchFloodOverview,
  MarketRisk,
  MarketDetail,
  FloodOverview
} from '@/lib/api';

export default function MarketsPage() {
  const [marketRisks, setMarketRisks] = useState<MarketRisk[]>([]);
  const [floodOverview, setFloodOverview] = useState<FloodOverview | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      const [mRisks, floodRes] = await Promise.all([
        fetchMarketRisks(),
        fetchFloodOverview()
      ]);
      setMarketRisks(mRisks);
      setFloodOverview(floodRes);
    }
    loadData();
  }, []);

  const handleSelectMarket = async (marketId: string) => {
    const detail = await fetchMarketDetail(marketId);
    setSelectedMarket(detail);
  };

  return (
    <AppShell
      disasterStatus={floodOverview?.status || 'NORMAL'}
      activeEventName={floodOverview?.active_event?.name}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold font-sans text-civic-forest">Markets — Market Exposure</h2>
        <p className="text-xs text-civic-charcoal/80 font-sans">
          Monitoring wholesale APMC hubs, regional yards, handled crop categories, and exposure metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {marketRisks.length > 0 ? (
            <MarketRiskTable markets={marketRisks} onSelectMarket={handleSelectMarket} />
          ) : (
            <div className="bg-slate-950/90 border border-slate-800/80 p-8 rounded-2xl text-center text-xs text-slate-400 font-mono space-y-2">
              <p className="text-amber-400 font-bold">Baseline Market Conditions Active</p>
              <p className="font-sans">
                No active disaster scenario is simulated. All 5 wholesale markets in Pune are operating at baseline normal supply capacity.
              </p>
            </div>
          )}
        </div>

        <div>
          {selectedMarket ? (
            <MarketDetailPanel market={selectedMarket} onClose={() => setSelectedMarket(null)} />
          ) : (
            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl text-center text-xs text-slate-500 font-mono">
              Click any wholesale market row to inspect connected agricultural sources and crop category breakdown.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
