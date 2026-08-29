from pydantic import BaseModel, Field, ConfigDict
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.models.food_system import CultivationStatus, EvidenceStatus

# Config Weights Schema
class EvidenceWeights(BaseModel):
    crop_activity: float = 0.30
    historical_activity: float = 0.25
    market_linkage: float = 0.20
    parcel_activity: float = 0.15
    administrative_signal: float = 0.10

# Cultivation Evidence Schemas
class CultivationEvidenceBase(BaseModel):
    crop_activity_score: float
    historical_activity_score: float
    market_linkage_score: float
    administrative_signal_score: float
    parcel_activity_score: float = 70.0

class CultivationEvidenceResponse(CultivationEvidenceBase):
    id: int
    parcel_id: int
    evidence_score: float
    evidence_status: EvidenceStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Market Link Schemas
class MarketLinkBase(BaseModel):
    dependency_score: float
    estimated_supply_share: float

class MarketLinkResponse(MarketLinkBase):
    id: int
    parcel_id: int
    market_id: int
    market_name: Optional[str] = None
    market_code: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Market Schemas
class MarketBase(BaseModel):
    market_id: str
    name: str
    latitude: float
    longitude: float
    market_type: str
    normal_supply_index: float
    crop_categories: List[str]

class MarketResponse(MarketBase):
    id: int
    created_at: datetime
    updated_at: datetime
    connected_parcels_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)

class MarketDetailResponse(MarketResponse):
    connected_parcels: List[Dict[str, Any]] = []
    top_crops: List[Dict[str, Any]] = []

# Agricultural Parcel Schemas
class ParcelBase(BaseModel):
    parcel_id: str
    area_acres: float
    crop_type: str
    cultivation_status: CultivationStatus
    crop_activity_score: float
    historical_activity_score: float
    market_linkage_score: float
    administrative_signal_score: float

class ParcelResponse(ParcelBase):
    id: int
    created_at: datetime
    updated_at: datetime
    evidence_score: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

class ParcelDetailResponse(ParcelResponse):
    geometry_geojson: Dict[str, Any]
    evidence: Optional[CultivationEvidenceResponse] = None
    connected_markets: List[MarketLinkResponse] = []

# Overview & Metrics
class SystemMetricsResponse(BaseModel):
    parcels_monitored: int
    active_cultivation_count: int
    markets_connected: int
    crops_represented: int
    crop_distribution: Dict[str, int]
    disclaimer: str = "Illustrative prototype dataset — not official cadastral boundaries or verified ownership."
