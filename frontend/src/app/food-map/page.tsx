'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import MapView from '@/components/MapView';
import ParcelDetailPanel from '@/components/ParcelDetailPanel';
import MarketDetailPanel from '@/components/MarketDetailPanel';
import FloodScenarioControl from '@/components/FloodScenarioControl';
import {
  fetchMapOverview,
  fetchParcelDetail,
  fetchMarketDetail,
  fetchFloodEvents,
  simulateFloodEvent,
  resetFloodScenario,
  fetchFloodOverview,
  analyzeFoodRisk,
  ParcelDetail,
  MarketDetail,
  FloodEvent,
  FloodOverview
} from '@/lib/api';

export default function FoodMapPage() {
  const [mapGeoJson, setMapGeoJson] = useState<any>(null);
  const [scenarios, setScenarios] = useState<FloodEvent[]>([]);
  const [floodOverview, setFloodOverview] = useState<FloodOverview | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

  const [selectedParcel, setSelectedParcel] = useState<ParcelDetail | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      const [geoRes, floodScenarios, floodOverviewRes] = await Promise.all([
        fetchMapOverview(),
        fetchFloodEvents(),
        fetchFloodOverview()
      ]);
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
    await analyzeFoodRisk();
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
    <AppShell
      disasterStatus={floodOverview?.status || 'NORMAL'}
      activeEventName={floodOverview?.active_event?.name}
    >
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Food-System Geospatial Intelligence Map</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Interactive GIS canvas rendering Pune&apos;s agricultural parcels, wholesale markets, supply links, and disaster inundation zones.
          </p>
        </div>

        <FloodScenarioControl
          scenarios={scenarios}
          activeOverview={floodOverview}
          onSimulate={handleSimulateScenario}
          onReset={handleResetScenario}
          loading={simulating}
        />
      </div>

      <div className="relative h-[720px]">
        <MapView
          geoJsonData={mapGeoJson}
          onSelectParcel={handleSelectParcel}
          onSelectMarket={handleSelectMarket}
        />

        {(selectedParcel || selectedMarket) && (
          <div className="absolute top-4 right-4 z-20 max-h-[650px] overflow-y-auto">
            {selectedParcel && (
              <ParcelDetailPanel parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
            )}
            {selectedMarket && (
              <MarketDetailPanel market={selectedMarket} onClose={() => setSelectedMarket(null)} />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
