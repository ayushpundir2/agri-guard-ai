from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.risk import RiskLevel, PriorityLevel

# Threshold helper
def classify_risk_level(score: float) -> RiskLevel:
    if score >= 70.0:
        return RiskLevel.CRITICAL
    elif score >= 40.0:
        return RiskLevel.HIGH
    elif score >= 20.0:
        return RiskLevel.MODERATE
    else:
        return RiskLevel.LOW

def classify_priority_level(score: float) -> PriorityLevel:
    if score >= 75.0:
        return PriorityLevel.CRITICAL
    elif score >= 50.0:
        return PriorityLevel.HIGH
    elif score >= 30.0:
        return PriorityLevel.MODERATE
    else:
        return PriorityLevel.LOW

class FoodRiskOverviewResponse(BaseModel):
    status: str = "NO_ACTIVE_ANALYSIS"
    flood_event_id: Optional[str] = None
    flood_event_name: Optional[str] = None
    overall_risk_score: float = 0.0
    risk_level: RiskLevel = RiskLevel.LOW
    affected_production_tons: float = 0.0
    affected_market_count: int = 0
    affected_parcel_count: int = 0
    critical_priority_parcels_count: int = 0
    calculated_at: Optional[datetime] = None
    disclaimer: str = "Illustrative prototype risk assessment — not official government or market loss predictions."

class MarketRiskResponse(BaseModel):
    id: int
    market_id: str
    market_name: str
    exposure_score: float
    exposure_level: RiskLevel
    affected_supply_tons: float
    affected_parcels_count: int
    normal_supply_index: float

    model_config = ConfigDict(from_attributes=True)

class RecoveryPriorityResponse(BaseModel):
    id: int
    parcel_id: str
    crop_type: str
    area_acres: float
    priority_score: float
    priority_level: PriorityLevel
    flood_exposure_pct: float
    cultivation_evidence_score: float
    estimated_production_impact_tons: float
    structured_reasons: List[str]

    model_config = ConfigDict(from_attributes=True)

class RecoveryPriorityDetailResponse(RecoveryPriorityResponse):
    flood_component: float
    cultivation_component: float
    market_component: float
    crop_component: float
    production_component: float
    connected_markets: List[Dict[str, Any]] = []
