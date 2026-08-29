from sqlalchemy.orm import Session
from sqlalchemy import func, text
from shapely.geometry import shape
from geoalchemy2.shape import to_shape
from typing import Dict, Any, List

from app.models.food_system import AgriculturalParcel, CultivationStatus
from app.models.flood import FloodEvent, ParcelFloodImpact
from app.services.damage_engine import classify_exposure_level, calculate_crop_damage
from app.core.geospatial import calculate_polygon_area_acres

class FloodAnalysisService:

    @staticmethod
    def simulate_flood_event(db: Session, event_id: str) -> FloodEvent:
        """
        Activates selected flood scenario and performs PostGIS spatial intersection calculations
        across all agricultural parcels in the database.
        """
        # 1. Deactivate any existing active events
        db.query(FloodEvent).update({"is_active": False})
        
        event = db.query(FloodEvent).filter(
            (FloodEvent.event_id == event_id) | (FloodEvent.id.cast(func.text) == event_id)
        ).first()

        if not event:
            raise ValueError(f"Flood event '{event_id}' not found.")

        event.is_active = True
        
        # Clear prior impacts for this event
        db.query(ParcelFloodImpact).filter(ParcelFloodImpact.flood_event_id == event.id).delete()
        db.commit()

        # 2. Perform spatial intersection query using PostGIS ST_Intersects & ST_Intersection via SQL text
        sql = text("""
            SELECT 
                p.id AS parcel_db_id,
                ST_Area(ST_Transform(p.geometry, 3857)) AS parcel_area_m2,
                ST_Area(ST_Transform(ST_Intersection(p.geometry, f.geometry), 3857)) AS intersection_area_m2
            FROM agricultural_parcels p
            JOIN flood_events f ON f.id = :event_id AND ST_Intersects(p.geometry, f.geometry)
        """)

        rows = db.execute(sql, {"event_id": event.id}).mappings().all()

        impact_records = []
        for row in rows:
            parcel_db_id = row["parcel_db_id"]
            parcel_area = float(row["parcel_area_m2"] or 0.0)
            intersection_area = float(row["intersection_area_m2"] or 0.0)

            if parcel_area <= 0:
                continue

            parcel = db.query(AgriculturalParcel).filter(AgriculturalParcel.id == parcel_db_id).first()
            if not parcel:
                continue

            overlap_pct = round(min(100.0, (intersection_area / parcel_area) * 100.0), 1)
            affected_acres = round((intersection_area / 4046.86), 2)
            exposure_lvl = classify_exposure_level(overlap_pct)

            crop_dmg = calculate_crop_damage(
                overlap_percentage=overlap_pct,
                crop_type=parcel.crop_type,
                crop_activity_score=parcel.crop_activity_score
            )

            impact = ParcelFloodImpact(
                parcel_id=parcel.id,
                flood_event_id=event.id,
                overlap_percentage=overlap_pct,
                affected_area_acres=affected_acres,
                exposure_level=exposure_lvl,
                estimated_crop_damage=crop_dmg
            )
            impact_records.append(impact)

        db.add_all(impact_records)
        db.commit()
        db.refresh(event)

        return event

    @staticmethod
    def reset_flood_scenario(db: Session):
        """Resets active flood scenario."""
        db.query(FloodEvent).update({"is_active": False})
        db.commit()

    @staticmethod
    def get_flood_overview(db: Session) -> Dict[str, Any]:
        """Calculates dynamic flood summary metrics from active flood event."""
        active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()

        if not active_event:
            return {
                "status": "NORMAL",
                "active_event": None,
                "affected_parcel_count": 0,
                "affected_cultivated_acres": 0.0,
                "exposure_distribution": {"LOW": 0, "MODERATE": 0, "HIGH": 0, "SEVERE": 0},
                "average_crop_damage": 0.0,
                "severity_summary": {}
            }

        impacts = db.query(ParcelFloodImpact).filter(
            ParcelFloodImpact.flood_event_id == active_event.id
        ).all()

        affected_count = len(impacts)
        total_affected_acres = round(sum(i.affected_area_acres for i in impacts), 1)

        exposure_dist = {"LOW": 0, "MODERATE": 0, "HIGH": 0, "SEVERE": 0}
        for i in impacts:
            lvl = i.exposure_level.value if hasattr(i.exposure_level, "value") else str(i.exposure_level)
            exposure_dist[lvl] = exposure_dist.get(lvl, 0) + 1

        avg_damage = round(sum(i.estimated_crop_damage for i in impacts) / affected_count, 1) if affected_count > 0 else 0.0

        return {
            "status": "ACTIVE_FLOOD",
            "active_event": active_event,
            "affected_parcel_count": affected_count,
            "affected_cultivated_acres": total_affected_acres,
            "exposure_distribution": exposure_dist,
            "average_crop_damage": avg_damage,
            "severity_summary": {
                "event_name": active_event.name,
                "event_severity": active_event.severity,
                "event_date": active_event.event_date.isoformat()
            }
        }
