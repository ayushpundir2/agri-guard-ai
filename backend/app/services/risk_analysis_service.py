from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List

from app.models.food_system import AgriculturalParcel, Market, MarketLink
from app.models.flood import FloodEvent, ParcelFloodImpact
from app.models.risk import FoodRiskAssessment, MarketRiskAssessment, RecoveryPriority
from app.services.production_impact_engine import calculate_parcel_production_impact
from app.services.market_exposure_engine import calculate_market_exposure_score
from app.services.food_risk_engine import calculate_city_food_supply_risk
from app.services.recovery_priority_engine import calculate_recovery_priority
from app.schemas.flood import CROP_VULNERABILITY

class RiskAnalysisService:

    @staticmethod
    def analyze_active_flood_risk(db: Session) -> FoodRiskAssessment:
        """
        Orchestrates full food-supply risk & recovery priority analysis for active flood scenario.
        """
        active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()
        if not active_event:
            raise ValueError("No active flood scenario found. Simulate a flood event first.")

        # Clear prior risk assessments for this event
        db.query(RecoveryPriority).filter(RecoveryPriority.flood_event_id == active_event.id).delete()
        db.query(MarketRiskAssessment).filter(MarketRiskAssessment.flood_event_id == active_event.id).delete()
        db.query(FoodRiskAssessment).filter(FoodRiskAssessment.flood_event_id == active_event.id).delete()
        db.commit()

        # 1. Fetch parcel impacts
        impacts = db.query(ParcelFloodImpact).filter(
            ParcelFloodImpact.flood_event_id == active_event.id
        ).all()

        total_production_loss_tons = 0.0
        parcel_production_map = {}
        vuln_list = []

        # Calculate production impact and recovery priority per parcel
        recovery_records = []
        for imp in impacts:
            parcel = imp.parcel
            if not parcel:
                continue

            prod_loss = calculate_parcel_production_impact(
                affected_area_acres=imp.affected_area_acres,
                crop_type=parcel.crop_type,
                crop_damage_score=imp.estimated_crop_damage,
                crop_activity_score=parcel.crop_activity_score
            )
            total_production_loss_tons += prod_loss
            parcel_production_map[parcel.id] = prod_loss

            vuln = CROP_VULNERABILITY.get(parcel.crop_type, CROP_VULNERABILITY["General"])
            vuln_list.append(vuln)

            evidence_score = parcel.evidence.evidence_score if parcel.evidence else parcel.crop_activity_score

            p_score, p_level, comps, reasons = calculate_recovery_priority(
                overlap_percentage=imp.overlap_percentage,
                evidence_score=evidence_score,
                market_linkage_score=parcel.market_linkage_score,
                crop_type=parcel.crop_type,
                production_impact_tons=prod_loss
            )

            rec = RecoveryPriority(
                flood_event_id=active_event.id,
                parcel_id=parcel.id,
                priority_score=p_score,
                priority_level=p_level,
                flood_component=comps["flood_component"],
                cultivation_component=comps["cultivation_component"],
                market_component=comps["market_component"],
                crop_component=comps["crop_component"],
                production_component=comps["production_component"],
                structured_reasons=reasons
            )
            recovery_records.append(rec)

        db.add_all(recovery_records)
        db.commit()

        # 2. Calculate Market Exposure
        markets = db.query(Market).all()
        market_exposure_scores = []
        market_records = []

        for m in markets:
            # Get links to affected parcels
            affected_links = db.query(MarketLink).filter(
                MarketLink.market_id == m.id,
                MarketLink.parcel_id.in_([i.parcel_id for i in impacts])
            ).all()

            affected_parcels_count = len(affected_links)
            m_supply_loss = sum(parcel_production_map.get(l.parcel_id, 0.0) * (l.estimated_supply_share / 100.0) for l in affected_links)
            avg_dep = sum(l.dependency_score for l in affected_links) / affected_parcels_count if affected_parcels_count > 0 else 0.0

            m_score, m_level = calculate_market_exposure_score(
                total_affected_supply_tons=m_supply_loss,
                normal_supply_index=m.normal_supply_index,
                connected_affected_parcels_count=affected_parcels_count,
                avg_dependency_score=avg_dep
            )

            market_exposure_scores.append(m_score)

            m_rec = MarketRiskAssessment(
                flood_event_id=active_event.id,
                market_id=m.id,
                exposure_score=m_score,
                exposure_level=m_level,
                affected_supply_tons=round(m_supply_loss, 2),
                affected_parcels_count=affected_parcels_count
            )
            market_records.append(m_rec)

        db.add_all(market_records)
        db.commit()

        # 3. Calculate City Food Supply Risk Assessment
        avg_market_exp = sum(market_exposure_scores) / len(market_exposure_scores) if market_exposure_scores else 0.0
        avg_vuln = sum(vuln_list) / len(vuln_list) if vuln_list else 0.5

        city_risk_score, city_risk_level = calculate_city_food_supply_risk(
            affected_production_tons=round(total_production_loss_tons, 1),
            avg_market_exposure_score=avg_market_exp,
            avg_crop_vulnerability=avg_vuln,
            flood_severity=active_event.severity
        )

        assessment = FoodRiskAssessment(
            flood_event_id=active_event.id,
            overall_risk_score=city_risk_score,
            risk_level=city_risk_level,
            affected_production_tons=round(total_production_loss_tons, 1),
            affected_market_count=len([m for m in market_records if m.exposure_score > 20.0]),
            affected_parcel_count=len(impacts)
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)

        return assessment
