'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import MetricsBar from '@/components/MetricsBar';
import DisasterMetricsBar from '@/components/DisasterMetricsBar';
import FloodScenarioControl from '@/components/FloodScenarioControl';
import CityRiskMetricsBar from '@/components/CityRiskMetricsBar';
import MapView from '@/components/MapView';
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
  analyzeFoodRisk,
  fetchRiskOverview,
  SystemMetrics,
  ParcelDetail,
  MarketDetail,
  FloodEvent,
  FloodOverview,
  FoodRiskOverview
} from '@/lib/api';
import { MapPin, Store, ShieldAlert, ListOrdered, Bot, Activity, ArrowRight } from 'lucide-react';

export default function CommandCenterPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [mapGeoJson, setMapGeoJson] = useState<any>(null);
  const [scenarios, setScenarios] = useState<FloodEvent[]>([]);
  const [floodOverview, setFloodOverview] = useState<FloodOverview | null>(null);
  const [riskOverview, setRiskOverview] = useState<FoodRiskOverview | null>(null);

  const [simulating, setSimulating] = useState<boolean>(false);
  const [analyzingRisk, setAnalyzingRisk] = useState<boolean>(false);

  const [selectedParcel, setSelectedParcel] = useState<ParcelDetail | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      const [mRes, geoRes, floodScenarios, floodOverviewRes, riskOverviewRes] = await Promise.all([
        fetchSystemMetrics(),
        fetchMapOverview(),
        fetchFloodEvents(),
        fetchFloodOverview(),
        fetchRiskOverview()
      ]);
      setMetrics(mRes);
      setMapGeoJson(geoRes);
      setScenarios(floodScenarios);
      setFloodOverview(floodOverviewRes);
      setRiskOverview(riskOverviewRes);
    }
    loadData();
  }, []);

  const handleSimulateScenario = async (eventId: string) => {
    setSimulating(true);
    const ov = await simulateFloodEvent(eventId);
    setFloodOverview(ov);
    
    const riskOv = await analyzeFoodRisk();
    setRiskOverview(riskOv);

    const updatedGeoJson = await fetchMapOverview();
    setMapGeoJson(updatedGeoJson);
    setSimulating(false);
  };

  const handleResetScenario = async () => {
    setSimulating(true);
    const ov = await resetFloodScenario();
    setFloodOverview(ov);
    
    const riskOv = await fetchRiskOverview();
    setRiskOverview(riskOv);

    const updatedGeoJson = await fetchMapOverview();
    setMapGeoJson(updatedGeoJson);
    setSimulating(false);
  };

  const handleAnalyzeFoodRisk = async () => {
    setAnalyzingRisk(true);
    try {
      const riskOv = await analyzeFoodRisk();
      if (riskOv) {
        setRiskOverview(riskOv);
      }
      const updatedGeoJson = await fetchMapOverview();
      setMapGeoJson(updatedGeoJson);
    } catch (err) {
      console.error('Error analyzing food risk:', err);
    } finally {
      setAnalyzingRisk(false);
    }
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
      {/* Overview Header */}
      {floodOverview?.status === 'ACTIVE_FLOOD' ? (
        <DisasterMetricsBar overview={floodOverview} />
      ) : (
        <MetricsBar metrics={metrics} />
      )}

      {/* Disaster Simulation Controller */}
      <FloodScenarioControl
        scenarios={scenarios}
        activeOverview={floodOverview}
        onSimulate={handleSimulateScenario}
        onReset={handleResetScenario}
        loading={simulating || analyzingRisk}
      />

      {/* City Risk Bar */}
      <CityRiskMetricsBar
        riskOverview={riskOverview}
        onAnalyze={handleAnalyzeFoodRisk}
        analyzing={analyzingRisk}
        hasActiveFlood={floodOverview?.status === 'ACTIVE_FLOOD'}
      />

      {/* Map Preview Hero Workspace */}
      <div className="relative h-[550px]">
        <MapView
          geoJsonData={mapGeoJson}
          onSelectParcel={handleSelectParcel}
          onSelectMarket={handleSelectMarket}
        />

        {(selectedParcel || selectedMarket) && (
          <div className="absolute top-4 right-4 z-20 max-h-[500px] overflow-y-auto">
            {selectedParcel && (
              <ParcelDetailPanel parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
            )}
            {selectedMarket && (
              <MarketDetailPanel market={selectedMarket} onClose={() => setSelectedMarket(null)} />
            )}
          </div>
        )}
      </div>

      {/* Quick Module Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
        <Link
          href="/food-map"
          className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <MapPin className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-0.5">Food Map</h4>
            <p className="text-[10px] text-slate-400 font-sans">Full screen GIS spatial workspace</p>
          </div>
        </Link>

        <Link
          href="/markets"
          className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-amber-500/50 transition flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-amber-400">
            <Store className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-0.5">Markets</h4>
            <p className="text-[10px] text-slate-400 font-sans">Wholesale market exposures</p>
          </div>
        </Link>

        <Link
          href="/risk-analysis"
          className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-orange-500/50 transition flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-orange-400">
            <ShieldAlert className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-0.5">Risk Analysis</h4>
            <p className="text-[10px] text-slate-400 font-sans">City food-supply vulnerability</p>
          </div>
        </Link>

        <Link
          href="/recovery"
          className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-indigo-400">
            <ListOrdered className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-0.5">Recovery</h4>
            <p className="text-[10px] text-slate-400 font-sans">Ranked parcel interventions</p>
          </div>
        </Link>

        <Link
          href="/ai-analyst"
          className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-purple-500/50 transition flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-purple-400">
            <Bot className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-0.5">AI Analyst</h4>
            <p className="text-[10px] text-slate-400 font-sans">Gemini decision reasoning</p>
          </div>
        </Link>

        <Link
          href="/city-action"
          className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-cyan-400">
            <Activity className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-0.5">City Action</h4>
            <p className="text-[10px] text-slate-400 font-sans">Response framework</p>
          </div>
        </Link>
      </div>
    </AppShell>
  );
}
