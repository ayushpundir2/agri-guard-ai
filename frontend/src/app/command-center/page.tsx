'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopHeader from '@/components/TopHeader';
import MapView from '@/components/MapView';
import MetricsBar from '@/components/MetricsBar';
import DisasterMetricsBar from '@/components/DisasterMetricsBar';
import FloodScenarioControl from '@/components/FloodScenarioControl';
import CityRiskMetricsBar from '@/components/CityRiskMetricsBar';
import MarketRiskTable from '@/components/MarketRiskTable';
import RecoveryPriorityList from '@/components/RecoveryPriorityList';
import ParcelDetailPanel from '@/components/ParcelDetailPanel';
import MarketDetailPanel from '@/components/MarketDetailPanel';
import GeminiAnalystPanel from '@/components/GeminiAnalystPanel';
import CityActionSection from '@/components/CityActionSection';
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
  fetchMarketRisks,
  fetchRecoveryPriorities,
  SystemMetrics,
  ParcelDetail,
  MarketDetail,
  FloodEvent,
  FloodOverview,
  FoodRiskOverview,
  MarketRisk,
  RecoveryPriority
} from '@/lib/api';

export default function CommandCenterPage() {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [mapGeoJson, setMapGeoJson] = useState<any>(null);
  const [scenarios, setScenarios] = useState<FloodEvent[]>([]);
  const [floodOverview, setFloodOverview] = useState<FloodOverview | null>(null);
  const [riskOverview, setRiskOverview] = useState<FoodRiskOverview | null>(null);
  const [marketRisks, setMarketRisks] = useState<MarketRisk[]>([]);
  const [recoveryPriorities, setRecoveryPriorities] = useState<RecoveryPriority[]>([]);

  const [simulating, setSimulating] = useState<boolean>(false);
  const [analyzingRisk, setAnalyzingRisk] = useState<boolean>(false);

  const [selectedParcel, setSelectedParcel] = useState<ParcelDetail | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketDetail | null>(null);

  useEffect(() => {
    async function loadInitialData() {
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

      if (riskOverviewRes && riskOverviewRes.status === 'ANALYSIS_ACTIVE') {
        const [mRisks, recs] = await Promise.all([
          fetchMarketRisks(),
          fetchRecoveryPriorities(20)
        ]);
        setMarketRisks(mRisks);
        setRecoveryPriorities(recs);
      }
    }
    loadInitialData();
  }, []);

  const handleSimulateScenario = async (eventId: string) => {
    setSimulating(true);
    setSelectedParcel(null);
    setSelectedMarket(null);

    const ov = await simulateFloodEvent(eventId);
    setFloodOverview(ov);
    
    const riskOv = await analyzeFoodRisk();
    setRiskOverview(riskOv);

    const [updatedGeoJson, mRisks, recs] = await Promise.all([
      fetchMapOverview(),
      fetchMarketRisks(),
      fetchRecoveryPriorities(20)
    ]);

    setMapGeoJson(updatedGeoJson);
    setMarketRisks(mRisks);
    setRecoveryPriorities(recs);

    setSimulating(false);
  };

  const handleResetScenario = async () => {
    setSimulating(true);
    setSelectedParcel(null);
    setSelectedMarket(null);

    const ov = await resetFloodScenario();
    setFloodOverview(ov);
    
    const riskOv = await fetchRiskOverview();
    setRiskOverview(riskOv);

    const updatedGeoJson = await fetchMapOverview();
    setMapGeoJson(updatedGeoJson);

    setMarketRisks([]);
    setRecoveryPriorities([]);

    setSimulating(false);
  };

  const handleAnalyzeFoodRisk = async () => {
    setAnalyzingRisk(true);
    const riskOv = await analyzeFoodRisk();
    setRiskOverview(riskOv);

    const [updatedGeoJson, mRisks, recs] = await Promise.all([
      fetchMapOverview(),
      fetchMarketRisks(),
      fetchRecoveryPriorities(20)
    ]);

    setMapGeoJson(updatedGeoJson);
    setMarketRisks(mRisks);
    setRecoveryPriorities(recs);

    setAnalyzingRisk(false);
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

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        systemStatus={floodOverview?.status === 'ACTIVE_FLOOD' ? 'Disaster Active' : 'All Systems Operational'}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          disasterStatus={floodOverview?.status || 'NORMAL'}
          activeEventName={floodOverview?.active_event?.name}
        />

        {/* Content Container */}
        <div className="p-6 md:p-8 flex flex-col gap-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
          {/* Section 1: Overview & Food Network */}
          <div id="overview">
            {floodOverview?.status === 'ACTIVE_FLOOD' ? (
              <DisasterMetricsBar overview={floodOverview} />
            ) : (
              <MetricsBar metrics={metrics} />
            )}
          </div>

          {/* Section 2: Disaster Scenario Controller */}
          <div id="analysis">
            <FloodScenarioControl
              scenarios={scenarios}
              activeOverview={floodOverview}
              onSimulate={handleSimulateScenario}
              onReset={handleResetScenario}
              loading={simulating || analyzingRisk}
            />
          </div>

          {/* Section 3: City Food Supply Risk Gauge & Breakdown */}
          <CityRiskMetricsBar
            riskOverview={riskOverview}
            onAnalyze={handleAnalyzeFoodRisk}
            analyzing={analyzingRisk}
            hasActiveFlood={floodOverview?.status === 'ACTIVE_FLOOD'}
          />

          {/* Section 4: Main Geospatial Map Workspace (Hero) */}
          <div id="map" className="relative flex flex-col lg:flex-row gap-6 h-[680px]">
            <div className="flex-1 relative h-full">
              <MapView
                geoJsonData={mapGeoJson}
                onSelectParcel={handleSelectParcel}
                onSelectMarket={handleSelectMarket}
              />
            </div>

            {/* Floating Inspection Panels */}
            {(selectedParcel || selectedMarket) && (
              <div className="absolute top-4 right-4 z-20 max-h-[620px] overflow-y-auto">
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

          {/* Section 5: Market Exposure Rankings & Recovery Priority List */}
          {floodOverview?.status === 'ACTIVE_FLOOD' && (
            <div id="markets" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketRiskTable
                markets={marketRisks}
                onSelectMarket={handleSelectMarket}
              />
              <div id="recovery">
                <RecoveryPriorityList
                  priorities={recoveryPriorities}
                  onSelectParcel={handleSelectParcel}
                />
              </div>
            </div>
          )}

          {/* Section 6: AI Analyst Reasoning Panel */}
          <div id="ai-analyst">
            <GeminiAnalystPanel
              activeDisasterName={floodOverview?.active_event?.name}
              overallRiskScore={riskOverview?.overall_risk_score}
              riskLevel={riskOverview?.risk_level}
              parcelId={selectedParcel?.parcel_id}
              marketId={selectedMarket?.market_id}
            />
          </div>

          {/* Section 7: City Action Framework */}
          <div id="city-action">
            <CityActionSection />
          </div>

          {/* Data Honesty Footer */}
          <footer className="mt-auto border-t border-slate-800/80 pt-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2 font-mono">
            <p className="text-amber-400/90">
              <strong>Data Honesty Disclaimer:</strong> Illustrative prototype dataset & risk models — not official government predictions, legal land ownership, or market forecasts.
            </p>
            <p>Fund My Crazy — &ldquo;Surprise Us!&rdquo; Competition Project</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
