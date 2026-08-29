from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean, Text, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import enum

from app.core.database import Base

class FloodSeverity(str, enum.Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    SEVERE = "severe"

class ExposureLevel(str, enum.Enum):
    LOW = "LOW"             # 0-20%
    MODERATE = "MODERATE"   # 20-50%
    HIGH = "HIGH"           # 50-80%
    SEVERE = "SEVERE"       # 80-100%

class FloodEvent(Base):
    __tablename__ = "flood_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    geometry = Column(Geometry("POLYGON", srid=4326), nullable=False)
    severity = Column(Enum(FloodSeverity, native_enum=False), default=FloodSeverity.MODERATE, nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False, nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    impacts = relationship("ParcelFloodImpact", back_populates="flood_event", cascade="all, delete-orphan")


class ParcelFloodImpact(Base):
    __tablename__ = "parcel_flood_impacts"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("agricultural_parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    flood_event_id = Column(Integer, ForeignKey("flood_events.id", ondelete="CASCADE"), nullable=False, index=True)

    overlap_percentage = Column(Float, nullable=False)  # 0.0 to 100.0
    affected_area_acres = Column(Float, nullable=False)
    exposure_level = Column(Enum(ExposureLevel, native_enum=False), nullable=False)
    estimated_crop_damage = Column(Float, nullable=False)  # 0.0 to 100.0

    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    parcel = relationship("AgriculturalParcel")
    flood_event = relationship("FloodEvent", back_populates="impacts")

# Spatial and foreign key performance indexes
Index("idx_flood_events_geometry", FloodEvent.geometry, postgresql_using="gist")
Index("idx_parcel_flood_impacts_parcel_event", ParcelFloodImpact.parcel_id, ParcelFloodImpact.flood_event_id)
