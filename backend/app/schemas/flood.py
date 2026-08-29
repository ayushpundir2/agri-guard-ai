from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.flood import FloodSeverity, ExposureLevel

# Crop vulnerability index map (0.0 to 1.0)
CROP_VULNERABILITY: Dict[str, float] = {
    "Leafy Greens": 0.95,
    "Tomato": 0.90,
    "Onion": 0.75,
    "Soybean": 0.65,
    "Sugarcane": 0.40,
    "Wheat": 0.35,
    "Pomegranate": 0.50,
    "General": 0.60
}

class FloodEventBase(BaseModel):
    event_id: str
    name: str
    severity: FloodSeverity
    event_date: datetime
    description: Optional[str] = None

class FloodEventResponse(FloodEventBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FloodEventDetailResponse(FloodEventResponse):
    geometry_geojson: Dict[str, Any]
    impacted_parcels_count: int = 0

class ParcelFloodImpactResponse(BaseModel):
    id: int
    parcel_id: int
    parcel_code: Optional[str] = None
    crop_type: Optional[str] = None
    flood_event_id: int
    overlap_percentage: float
    affected_area_acres: float
    exposure_level: ExposureLevel
    estimated_crop_damage: float
    calculated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FloodOverviewResponse(BaseModel):
    status: str = "NORMAL"  # "NORMAL" or "ACTIVE_FLOOD"
    active_event: Optional[FloodEventResponse] = None
    affected_parcel_count: int = 0
    affected_cultivated_acres: float = 0.0
    exposure_distribution: Dict[str, int] = Field(default_factory=dict)
    average_crop_damage: float = 0.0
    severity_summary: Dict[str, Any] = Field(default_factory=dict)
    disclaimer: str = "Illustrative prototype disaster scenario — not actual historical flood predictions."
