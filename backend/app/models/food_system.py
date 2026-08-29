from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import enum

from app.core.database import Base

class CultivationStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    UNCERTAIN = "uncertain"

class EvidenceStatus(str, enum.Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class AgriculturalParcel(Base):
    __tablename__ = "agricultural_parcels"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(String(50), unique=True, nullable=False, index=True)
    geometry = Column(Geometry("POLYGON", srid=4326), nullable=False)
    area_acres = Column(Float, nullable=False)
    crop_type = Column(String(100), nullable=False, index=True)
    cultivation_status = Column(Enum(CultivationStatus, native_enum=False), default=CultivationStatus.ACTIVE, nullable=False, index=True)
    
    crop_activity_score = Column(Float, default=0.0)
    historical_activity_score = Column(Float, default=0.0)
    market_linkage_score = Column(Float, default=0.0)
    administrative_signal_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    evidence = relationship("CultivationEvidence", back_populates="parcel", uselist=False, cascade="all, delete-orphan")
    market_links = relationship("MarketLink", back_populates="parcel", cascade="all, delete-orphan")


class Market(Base):
    __tablename__ = "markets"

    id = Column(Integer, primary_key=True, index=True)
    market_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    geometry = Column(Geometry("POINT", srid=4326), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    market_type = Column(String(100), nullable=False)  # e.g., Wholesale APMC, Regional Hub
    normal_supply_index = Column(Float, default=100.0) # Baseline normal supply capacity (0-100)
    crop_categories = Column(JSON, nullable=False, default=list)  # list of crops handled e.g., ["Onion", "Tomato", "Sugarcane"]
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    parcel_links = relationship("MarketLink", back_populates="market", cascade="all, delete-orphan")


class MarketLink(Base):
    __tablename__ = "market_links"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("agricultural_parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    market_id = Column(Integer, ForeignKey("markets.id", ondelete="CASCADE"), nullable=False, index=True)
    
    dependency_score = Column(Float, nullable=False)  # 0-100 score indicating flow strength
    estimated_supply_share = Column(Float, nullable=False, default=0.0) # Percentage share of crop supply
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    parcel = relationship("AgriculturalParcel", back_populates="market_links")
    market = relationship("Market", back_populates="parcel_links")


class CultivationEvidence(Base):
    __tablename__ = "cultivation_evidence"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("agricultural_parcels.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    crop_activity_score = Column(Float, nullable=False)
    historical_activity_score = Column(Float, nullable=False)
    market_linkage_score = Column(Float, nullable=False)
    administrative_signal_score = Column(Float, nullable=False)
    parcel_activity_score = Column(Float, nullable=False, default=70.0)
    
    evidence_score = Column(Float, nullable=False) # Normalized 0-100
    evidence_status = Column(Enum(EvidenceStatus, native_enum=False), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    parcel = relationship("AgriculturalParcel", back_populates="evidence")
