from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base

class RiskLevel(str, enum.Enum):
    LOW = "LOW"             # 0-20
    MODERATE = "MODERATE"   # 20-40
    HIGH = "HIGH"           # 40-70
    CRITICAL = "CRITICAL"   # 70-100

class PriorityLevel(str, enum.Enum):
    LOW = "LOW"             # 0-30
    MODERATE = "MODERATE"   # 30-50
    HIGH = "HIGH"           # 50-75
    CRITICAL = "CRITICAL"   # 75-100

class FoodRiskAssessment(Base):
    __tablename__ = "food_risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    flood_event_id = Column(Integer, ForeignKey("flood_events.id", ondelete="CASCADE"), nullable=False, index=True)
    
    overall_risk_score = Column(Float, nullable=False) # 0-100
    risk_level = Column(Enum(RiskLevel), nullable=False)
    affected_production_tons = Column(Float, nullable=False)
    affected_market_count = Column(Integer, nullable=False)
    affected_parcel_count = Column(Integer, nullable=False)

    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    flood_event = relationship("FloodEvent")


class MarketRiskAssessment(Base):
    __tablename__ = "market_risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    flood_event_id = Column(Integer, ForeignKey("flood_events.id", ondelete="CASCADE"), nullable=False, index=True)
    market_id = Column(Integer, ForeignKey("markets.id", ondelete="CASCADE"), nullable=False, index=True)

    exposure_score = Column(Float, nullable=False) # 0-100
    exposure_level = Column(Enum(RiskLevel), nullable=False)
    affected_supply_tons = Column(Float, nullable=False)
    affected_parcels_count = Column(Integer, nullable=False)

    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    flood_event = relationship("FloodEvent")
    market = relationship("Market")


class RecoveryPriority(Base):
    __tablename__ = "recovery_priorities"

    id = Column(Integer, primary_key=True, index=True)
    flood_event_id = Column(Integer, ForeignKey("flood_events.id", ondelete="CASCADE"), nullable=False, index=True)
    parcel_id = Column(Integer, ForeignKey("agricultural_parcels.id", ondelete="CASCADE"), nullable=False, index=True)

    priority_score = Column(Float, nullable=False) # 0-100
    priority_level = Column(Enum(PriorityLevel), nullable=False)

    # Component breakdown scores (0-100)
    flood_component = Column(Float, nullable=False)
    cultivation_component = Column(Float, nullable=False)
    market_component = Column(Float, nullable=False)
    crop_component = Column(Float, nullable=False)
    production_component = Column(Float, nullable=False)

    structured_reasons = Column(JSON, nullable=False, default=list) # List of string explanations

    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    flood_event = relationship("FloodEvent")
    parcel = relationship("AgriculturalParcel")

Index("idx_recovery_priorities_event_parcel", RecoveryPriority.flood_event_id, RecoveryPriority.parcel_id)
Index("idx_market_risk_event_market", MarketRiskAssessment.flood_event_id, MarketRiskAssessment.market_id)
