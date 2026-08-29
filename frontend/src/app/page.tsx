'use client';

import { useState, useEffect } from 'react';
import HealthBadge from '@/components/HealthBadge';
import MapView from '@/components/MapView';
import MetricsBar from '@/components/MetricsBar';
import ParcelDetailPanel from '@/components/ParcelDetailPanel';
import MarketDetailPanel from '@/components/MarketDetailPanel';
import {
  fetchSystemMetrics,
  fetchMapOverview,
  fetchParcelDetail,
  fetchMarketDetail,
  SystemMetrics,
  ParcelDetail,
  MarketDetail
} from '@/lib/api';

export default function Home() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [mapGeoJson, setMapGeoJson] = useState<any>(null);
  
  const [selectedParcel, setSelectedParcel] = useState<ParcelDetail | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      const [mRes, geoRes] = await Promise.all([
        fetchSystemMetrics(),
        fetchMapOverview()
      ]);
      setMetrics(mRes);
      setMapGeoJson(geoRes);
    }
    loadData();
  }, []);

  const handleSelectParcel = async (parcelId: string) => {
    setSelectedMarket(null); // dismiss market panel
    const detail = await fetchParcelDetail(parcelId);
    setSelectedParcel(detail);
  };

  const handleSelectMarket = async (marketId: string) => {
    setSelectedParcel(null); // dismiss parcel panel
    const detail = await fetchMarketDetail(marketId);
    setSelectedMarket(detail);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾🛡️</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono">
              AgriGuard-AI
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Food-System Geospatial Intelligence Platform • Prototype Region: Pune, Maharashtra
          </p>
        </div>
        <div>
          <HealthBadge />
        </div>
      </header>

      {/* Dynamic Metrics Header */}
      <MetricsBar metrics={metrics} />

      {/* Main Map + Inspection Panels Area */}
      <div className="relative flex flex-col lg:flex-row gap-6 h-[650px]">
        {/* Map Container */}
        <div className="flex-1 relative h-full">
          <MapView
            geoJsonData={mapGeoJson}
            onSelectParcel={handleSelectParcel}
            onSelectMarket={handleSelectMarket}
          />
        </div>

        {/* Floating / Side Inspection Panels */}
        {(selectedParcel || selectedMarket) && (
          <div className="absolute top-4 right-4 z-20 max-h-[600px] overflow-y-auto">
            {selectedParcel && (
              <ParcelDetailPanel
                parcel={selectedParcel}
                onClose={() => setSelectedParcel(null)}
              />
            )}
            {selectedMarket && (
              <MarketDetailPanel
                market={selectedMarket}
                onClose={() => setSelectedMarket(null)}
              />
            )}
          </div>
        )}
      </div>

      {/* Mandatory Data Honesty Disclaimer Footer */}
      <footer className="mt-auto border-t border-slate-800 pt-4 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2 font-mono">
        <p className="text-amber-400/90">
          <strong>Data Honesty Disclaimer:</strong> Illustrative prototype dataset — not official cadastral boundaries or verified ownership.
        </p>
        <p>Fund My Crazy — &ldquo;Surprise Us!&rdquo; Competition Project</p>
      </footer>
    </main>
  );
}
