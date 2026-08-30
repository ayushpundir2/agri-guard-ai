from sqlalchemy import cast, String
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from app.models.food_system import AgriculturalParcel, Market
from app.models.flood import FloodEvent, ParcelFloodImpact
from app.models.risk import FoodRiskAssessment, MarketRiskAssessment, RecoveryPriority
from app.services.flood_service import FloodAnalysisService

class AIContextService:

    @staticmethod
    def build_system_context(db: Session, parcel_id: Optional[str] = None, market_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Gathers current active disaster state, food risk assessment, wholesale market exposures,
        and recovery priorities into a structured dictionary for Gemini.
        """
        active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()

        context = {
            "disaster_status": "NORMAL" if not active_event else "ACTIVE_FLOOD",
            "prototype_region": "Pune, Maharashtra, India",
            "active_disaster": None,
            "city_food_supply_risk": None,
            "market_exposures": [],
            "top_recovery_priorities": [],
            "inspected_entity": None
        }

        if not active_event:
            return context

        # 1. Active Disaster Context
        flood_overview = FloodAnalysisService.get_flood_overview(db)
        context["active_disaster"] = {
            "event_id": active_event.event_id,
            "event_name": active_event.name,
            "severity": active_event.severity.value if hasattr(active_event.severity, "value") else str(active_event.severity),
            "affected_parcels_count": flood_overview.get("affected_parcel_count", 0),
            "affected_cultivated_acres": flood_overview.get("affected_cultivated_acres", 0.0),
            "exposure_distribution": flood_overview.get("exposure_distribution", {}),
            "average_crop_damage_score": flood_overview.get("average_crop_damage", 0.0)
        }

        # 2. Food Risk Assessment Context
        risk_assessment = db.query(FoodRiskAssessment).filter(
            FoodRiskAssessment.flood_event_id == active_event.id
        ).order_by(FoodRiskAssessment.calculated_at.desc()).first()

        if risk_assessment:
            context["city_food_supply_risk"] = {
                "overall_risk_score": risk_assessment.overall_risk_score,
                "risk_level": risk_assessment.risk_level.value if hasattr(risk_assessment.risk_level, "value") else str(risk_assessment.risk_level),
                "affected_production_loss_tons": risk_assessment.affected_production_tons,
                "affected_wholesale_markets_count": risk_assessment.affected_market_count,
                "affected_parcels_count": risk_assessment.affected_parcel_count
            }

        # 3. Market Exposure Context
        market_assessments = db.query(MarketRiskAssessment).filter(
            MarketRiskAssessment.flood_event_id == active_event.id
        ).order_by(MarketRiskAssessment.exposure_score.desc()).all()

        for ma in market_assessments:
            m = ma.market
            if m:
                context["market_exposures"].append({
                    "market_id": m.market_id,
                    "market_name": m.name,
                    "exposure_score": ma.exposure_score,
                    "exposure_level": ma.exposure_level.value if hasattr(ma.exposure_level, "value") else str(ma.exposure_level),
                    "affected_supply_loss_tons": ma.affected_supply_tons,
                    "connected_affected_parcels": ma.affected_parcels_count,
                    "crop_categories": m.crop_categories
                })

        # 4. Top Recovery Priorities
        priorities = db.query(RecoveryPriority).filter(
            RecoveryPriority.flood_event_id == active_event.id
        ).order_by(RecoveryPriority.priority_score.desc()).limit(10).all()

        for p_rec in priorities:
            p = p_rec.parcel
            if p:
                context["top_recovery_priorities"].append({
                    "parcel_id": p.parcel_id,
                    "crop_type": p.crop_type,
                    "area_acres": p.area_acres,
                    "priority_score": p_rec.priority_score,
                    "priority_level": p_rec.priority_level.value if hasattr(p_rec.priority_level, "value") else str(p_rec.priority_level),
                    "flood_exposure_pct": p_rec.flood_component,
                    "cultivation_evidence_score": p_rec.cultivation_component,
                    "market_importance_score": p_rec.market_component,
                    "structured_reasons": p_rec.structured_reasons
                })

        # 5. Inspected Entity Context (if parcel or market specified)
        if parcel_id:
            p_obj = db.query(AgriculturalParcel).filter(
                (AgriculturalParcel.parcel_id == parcel_id) | (cast(AgriculturalParcel.id, String) == parcel_id)
            ).first()
            if p_obj:
                p_rec = db.query(RecoveryPriority).filter(
                    RecoveryPriority.flood_event_id == active_event.id,
                    RecoveryPriority.parcel_id == p_obj.id
                ).first()
                imp = db.query(ParcelFloodImpact).filter(
                    ParcelFloodImpact.flood_event_id == active_event.id,
                    ParcelFloodImpact.parcel_id == p_obj.id
                ).first()

                context["inspected_entity"] = {
                    "type": "agricultural_parcel",
                    "parcel_id": p_obj.parcel_id,
                    "crop_type": p_obj.crop_type,
                    "area_acres": p_obj.area_acres,
                    "cultivation_status": p_obj.cultivation_status,
                    "evidence_score": p_obj.evidence.evidence_score if p_obj.evidence else None,
                    "flood_impact": {
                        "overlap_percentage": imp.overlap_percentage,
                        "affected_area_acres": imp.affected_area_acres,
                        "exposure_level": imp.exposure_level.value if hasattr(imp.exposure_level, "value") else str(imp.exposure_level),
                        "estimated_crop_damage": imp.estimated_crop_damage
                    } if imp else None,
                    "recovery_priority": {
                        "priority_score": p_rec.priority_score,
                        "priority_level": p_rec.priority_level.value if hasattr(p_rec.priority_level, "value") else str(p_rec.priority_level),
                        "structured_reasons": p_rec.structured_reasons
                    } if p_rec else None
                }

        elif market_id:
            m_obj = db.query(Market).filter(
                (Market.market_id == market_id) | (cast(Market.id, String) == market_id)
            ).first()
            if m_obj:
                ma = db.query(MarketRiskAssessment).filter(
                    MarketRiskAssessment.flood_event_id == active_event.id,
                    MarketRiskAssessment.market_id == m_obj.id
                ).first()

                context["inspected_entity"] = {
                    "type": "wholesale_market",
                    "market_id": m_obj.market_id,
                    "market_name": m_obj.name,
                    "market_type": m_obj.market_type,
                    "crop_categories": m_obj.crop_categories,
                    "normal_supply_index": m_obj.normal_supply_index,
                    "exposure_assessment": {
                        "exposure_score": ma.exposure_score,
                        "exposure_level": ma.exposure_level.value if hasattr(ma.exposure_level, "value") else str(ma.exposure_level),
                        "affected_supply_loss_tons": ma.affected_supply_tons,
                        "connected_affected_parcels": ma.affected_parcels_count
                    } if ma else None
                }

        return context
