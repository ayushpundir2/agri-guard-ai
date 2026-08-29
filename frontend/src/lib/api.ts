const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface HealthCheckData {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  target_city: string;
  database_connected: boolean;
}

export interface SystemMetrics {
  parcels_monitored: number;
  active_cultivation_count: number;
  markets_connected: number;
  crops_represented: number;
  crop_distribution: Record<string, number>;
  disclaimer: string;
}

export interface FloodEvent {
  id: number;
  event_id: string;
  name: string;
  severity: string;
  event_date: string;
  description: string;
  is_active: boolean;
}

export interface FloodOverview {
  status: 'NORMAL' | 'ACTIVE_FLOOD';
  active_event: FloodEvent | null;
  affected_parcel_count: number;
  affected_cultivated_acres: number;
  exposure_distribution: Record<string, number>;
  average_crop_damage: number;
  severity_summary: Record<string, any>;
  disclaimer: string;
}

export interface FoodRiskOverview {
  status: string;
  flood_event_id: string | null;
  flood_event_name: string | null;
  overall_risk_score: number;
  risk_level: string;
  affected_production_tons: number;
  affected_market_count: number;
  affected_parcel_count: number;
  critical_priority_parcels_count: number;
  calculated_at: string | null;
  disclaimer: string;
}

export interface MarketRisk {
  id: number;
  market_id: string;
  market_name: string;
  exposure_score: number;
  exposure_level: string;
  affected_supply_tons: number;
  affected_parcels_count: number;
  normal_supply_index: number;
}

export interface RecoveryPriority {
  id: number;
  parcel_id: string;
  crop_type: string;
  area_acres: number;
  priority_score: number;
  priority_level: string;
  flood_exposure_pct: number;
  cultivation_evidence_score: number;
  estimated_production_impact_tons: number;
  structured_reasons: string[];
}

export interface ParcelDetail {
  id: number;
  parcel_id: string;
  area_acres: number;
  crop_type: string;
  cultivation_status: string;
  crop_activity_score: number;
  historical_activity_score: number;
  market_linkage_score: number;
  administrative_signal_score: number;
  evidence_score: number | null;
  geometry_geojson: any;
  evidence: {
    crop_activity_score: number;
    historical_activity_score: number;
    market_linkage_score: number;
    administrative_signal_score: number;
    parcel_activity_score: number;
    evidence_score: number;
    evidence_status: string;
  } | null;
  connected_markets: {
    id: number;
    dependency_score: number;
    estimated_supply_share: number;
    market_name?: string;
    market_code?: string;
  }[];
  active_flood_impact?: {
    flood_event_name: string;
    flood_event_id: string;
    overlap_percentage: number;
    affected_area_acres: number;
    exposure_level: string;
    estimated_crop_damage: number;
  } | null;
}

export interface MarketDetail {
  id: number;
  market_id: string;
  name: string;
  latitude: number;
  longitude: number;
  market_type: string;
  normal_supply_index: number;
  crop_categories: string[];
  connected_parcels_count: number;
  connected_parcels: {
    parcel_id: string;
    crop_type: string;
    area_acres: number;
    dependency_score: number;
    estimated_supply_share: number;
  }[];
  top_crops: { crop: string; count: number }[];
}

export interface AIAnalysisResult {
  success: boolean;
  disaster_status: string;
  active_event_name?: string | null;
  overall_risk_score?: number | null;
  risk_level?: string | null;
  analysis: {
    summary: string;
    reasoning: string;
    recommended_actions: string[];
    caveats: string;
  };
  error?: string | null;
  calculated_at: string;
}

export async function fetchBackendHealth(): Promise<HealthCheckData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch backend health:', err);
    return null;
  }
}

export async function fetchSystemMetrics(): Promise<SystemMetrics | null> {
  try {
    const res = await fetch(`${API_BASE}/api/metrics`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch metrics:', err);
    return null;
  }
}

export async function fetchMapOverview(): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/api/map/overview`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch map overview:', err);
    return null;
  }
}

export async function fetchParcelDetail(parcelId: string): Promise<ParcelDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/parcels/${parcelId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch parcel detail:', err);
    return null;
  }
}

export async function fetchMarketDetail(marketId: string): Promise<MarketDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/markets/${marketId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch market detail:', err);
    return null;
  }
}

export async function fetchFloodEvents(): Promise<FloodEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/api/flood-events`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch flood events:', err);
    return [];
  }
}

export async function simulateFloodEvent(eventId: string): Promise<FloodOverview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/flood-events/${eventId}/simulate`, {
      method: 'POST',
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to simulate flood event:', err);
    return null;
  }
}

export async function resetFloodScenario(): Promise<FloodOverview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/flood/reset`, {
      method: 'POST',
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to reset flood scenario:', err);
    return null;
  }
}

export async function fetchFloodOverview(): Promise<FloodOverview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/flood/overview`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch flood overview:', err);
    return null;
  }
}

export async function analyzeFoodRisk(): Promise<FoodRiskOverview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/risk/analyze`, {
      method: 'POST',
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to analyze food risk:', err);
    return null;
  }
}

export async function fetchRiskOverview(): Promise<FoodRiskOverview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/risk/overview`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch risk overview:', err);
    return null;
  }
}

export async function fetchMarketRisks(): Promise<MarketRisk[]> {
  try {
    const res = await fetch(`${API_BASE}/api/risk/markets`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch market risks:', err);
    return [];
  }
}

export async function fetchRecoveryPriorities(limit: number = 20, level?: string): Promise<RecoveryPriority[]> {
  try {
    const query = new URLSearchParams({ limit: limit.toString() });
    if (level) query.append('priority_level', level);
    const res = await fetch(`${API_BASE}/api/risk/recovery?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch recovery priorities:', err);
    return [];
  }
}

export async function askGeminiAnalyst(question: string, parcelId?: string, marketId?: string): Promise<AIAnalysisResult | null> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        parcel_id: parcelId,
        market_id: marketId
      }),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to query Gemini Analyst:', err);
    return null;
  }
}
