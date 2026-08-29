'use client';

import { useState, useEffect } from 'react';
import HealthBadge from '@/components/HealthBadge';
import MapView from '@/components/MapView';
import MetricsBar from '@/components/MetricsBar';
import DisasterMetricsBar from '@/components/DisasterMetricsBar';
import FloodScenarioControl from '@/components/FloodScenarioControl';
import ParcelDetailPanel from '@/components/ParcelDetailPanel';
import MarketDetailPanel from '@/components/MarketDetailPanel';
import {
  fetchSystemMetrics,
  fetchMapOverview,
  fetchParcelDetail,
  fetchMarketDetail,
  fetchFloodEvents,
  simulateFloodEvent,
  resetFloodScenario,
  fetchFloodOverview,
  SystemMetrics,
  ParcelDetail,
  MarketDetail,
  FloodEvent,
  FloodOverview
} from '@/lib/api';

export default function Home() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [mapGeoJson, setMapGeoJson] = useState<any>(null);
  const [scenarios, setScenarios] = useState<FloodEvent[]>([]);
  const [floodOverview, setFloodOverview] = useState<FloodOverview | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

  const [selectedParcel, setSelectedParcel] = useState<ParcelDetail | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      const [mRes, geoRes, floodScenarios, floodOverviewRes] = await Promise.all([
        fetchSystemMetrics(),
        fetchMapOverview(),
        fetchFloodEvents(),
        fetchFloodOverview()
      ]);
      setMetrics(mRes);
      setMapGeoJson(geoRes);
      setScenarios(floodScenarios);
      setFloodOverview(floodOverviewRes);
    }
    loadData();
  }, []);

  const handleSimulateScenario = async (eventId: string) => {
    setSimulating(true);
    const ov = await simulateFloodEvent(eventId);
    setFloodOverview(ov);
    const updatedGeoJson = await fetchMapOverview();
    setMapGeoJson(updatedGeoJson);
    setSimulating(false);
  };

  const handleResetScenario = async () => {
    setSimulating(true);
    const ov = await resetFloodScenario();
    setFloodOverview(ov);
    const updatedGeoJson = await fetchMapOverview();
    setMapGeoJson(updatedGeoJson);
    setSimulating(false);
  };

  const handleSelectParcel = async (parcelId: string) => {
    setSelectedMarket(null);
    const detail = await fetchParcelDetail(parcelId);
    setSelectedParcel(detail);
  };

  const handleSelectMarket = async (marketId: string) => {
    setSelectedParcel(null);
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

      {/* Flood Simulation Controller */}
      <FloodScenarioControl
        scenarios={scenarios}
        activeOverview={floodOverview}
        onSimulate={handleSimulateScenario}
        onReset={handleResetScenario}
        loading={simulating}
      />

      {/* Dynamic Metrics Headers */}
      {floodOverview?.status === 'ACTIVE_FLOOD' ? (
        <DisasterMetricsBar overview={floodOverview} />
      ) : (
        <MetricsBar metrics={metrics} />
      )}

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
          <strong>Data Honesty Disclaimer:</strong> Illustrative prototype dataset & simulations — not official cadastral boundaries, historical predictions, or legal ownership proof.
        </p>
        <p>Fund My Crazy — &ldquo;Surprise Us!&rdquo; Competition Project</p>
      </footer>
    </main>
  );
}
