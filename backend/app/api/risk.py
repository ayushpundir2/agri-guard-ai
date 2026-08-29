from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.food_system import AgriculturalParcel
from app.models.flood import FloodEvent, ParcelFloodImpact
from app.models.risk import FoodRiskAssessment, MarketRiskAssessment, RecoveryPriority, PriorityLevel
from app.schemas.risk import (
    FoodRiskOverviewResponse,
    MarketRiskResponse,
    RecoveryPriorityResponse,
    RecoveryPriorityDetailResponse
)
from app.services.risk_analysis_service import RiskAnalysisService

router = APIRouter()

@router.post("/risk/analyze", response_model=FoodRiskOverviewResponse)
def analyze_food_risk(db: Session = Depends(get_db)):
    try:
        assessment = RiskAnalysisService.analyze_active_flood_risk(db)
        active_event = assessment.flood_event
        
        crit_count = db.query(RecoveryPriority).filter(
            RecoveryPriority.flood_event_id == assessment.flood_event_id,
            RecoveryPriority.priority_level.in_([PriorityLevel.HIGH, PriorityLevel.CRITICAL])
        ).count()

        return FoodRiskOverviewResponse(
            status="ANALYSIS_ACTIVE",
            flood_event_id=active_event.event_id if active_event else None,
            flood_event_name=active_event.name if active_event else None,
            overall_risk_score=assessment.overall_risk_score,
            risk_level=assessment.risk_level,
            affected_production_tons=assessment.affected_production_tons,
            affected_market_count=assessment.affected_market_count,
            affected_parcel_count=assessment.affected_parcel_count,
            critical_priority_parcels_count=crit_count,
            calculated_at=assessment.calculated_at
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/risk/overview", response_model=FoodRiskOverviewResponse)
def get_risk_overview(db: Session = Depends(get_db)):
    active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()
    if not active_event:
        return FoodRiskOverviewResponse(status="NO_ACTIVE_ANALYSIS")

    assessment = db.query(FoodRiskAssessment).filter(
        FoodRiskAssessment.flood_event_id == active_event.id
    ).order_by(FoodRiskAssessment.calculated_at.desc()).first()

    if not assessment:
        return FoodRiskOverviewResponse(
            status="ANALYSIS_REQUIRED",
            flood_event_id=active_event.event_id,
            flood_event_name=active_event.name
        )

    crit_count = db.query(RecoveryPriority).filter(
        RecoveryPriority.flood_event_id == active_event.id,
        RecoveryPriority.priority_level.in_([PriorityLevel.HIGH, PriorityLevel.CRITICAL])
    ).count()

    return FoodRiskOverviewResponse(
        status="ANALYSIS_ACTIVE",
        flood_event_id=active_event.event_id,
        flood_event_name=active_event.name,
        overall_risk_score=assessment.overall_risk_score,
        risk_level=assessment.risk_level,
        affected_production_tons=assessment.affected_production_tons,
        affected_market_count=assessment.affected_market_count,
        affected_parcel_count=assessment.affected_parcel_count,
        critical_priority_parcels_count=crit_count,
        calculated_at=assessment.calculated_at
    )


@router.get("/risk/markets", response_model=List[MarketRiskResponse])
def get_market_risk(db: Session = Depends(get_db)):
    active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()
    if not active_event:
        return []

    assessments = db.query(MarketRiskAssessment).filter(
        MarketRiskAssessment.flood_event_id == active_event.id
    ).order_by(MarketRiskAssessment.exposure_score.desc()).all()

    results = []
    for a in assessments:
        m = a.market
        if not m:
            continue
        results.append(MarketRiskResponse(
            id=a.id,
            market_id=m.market_id,
            market_name=m.name,
            exposure_score=a.exposure_score,
            exposure_level=a.exposure_level,
            affected_supply_tons=a.affected_supply_tons,
            affected_parcels_count=a.affected_parcels_count,
            normal_supply_index=m.normal_supply_index
        ))

    return results


@router.get("/risk/recovery", response_model=List[RecoveryPriorityResponse])
def get_recovery_priorities(
    limit: int = Query(20, ge=1, le=100),
    priority_level: Optional[PriorityLevel] = None,
    crop_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()
    if not active_event:
        return []

    query = db.query(RecoveryPriority).filter(RecoveryPriority.flood_event_id == active_event.id)

    if priority_level:
        query = query.filter(RecoveryPriority.priority_level == priority_level)

    records = query.order_by(RecoveryPriority.priority_score.desc()).limit(limit).all()

    results = []
    for r in records:
        p = r.parcel
        if not p:
            continue

        if crop_type and p.crop_type != crop_type:
            continue

        # Get impact overlap percentage directly from database
        imp = db.query(ParcelFloodImpact).filter(
            ParcelFloodImpact.parcel_id == p.id,
            ParcelFloodImpact.flood_event_id == active_event.id
        ).first()

        overlap = imp.overlap_percentage if imp else r.flood_component
        ev_score = p.evidence.evidence_score if p.evidence else r.cultivation_component

        results.append(RecoveryPriorityResponse(
            id=r.id,
            parcel_id=p.parcel_id,
            crop_type=p.crop_type,
            area_acres=p.area_acres,
            priority_score=r.priority_score,
            priority_level=r.priority_level,
            flood_exposure_pct=overlap,
            cultivation_evidence_score=ev_score,
            estimated_production_impact_tons=round(r.production_component / 2.5, 2),
            structured_reasons=r.structured_reasons
        ))

    return results


@router.get("/risk/recovery/{parcel_id}", response_model=RecoveryPriorityDetailResponse)
def get_recovery_priority_detail(parcel_id: str, db: Session = Depends(get_db)):
    active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()
    if not active_event:
        raise HTTPException(status_code=404, detail="No active flood scenario found.")

    rec = db.query(RecoveryPriority).join(RecoveryPriority.parcel).filter(
        RecoveryPriority.flood_event_id == active_event.id,
        (AgriculturalParcel.parcel_id == parcel_id) | (AgriculturalParcel.id.cast(str) == parcel_id)
    ).first()

    if not rec:
        raise HTTPException(status_code=404, detail="Recovery priority record not found for parcel.")

    p = rec.parcel
    imp = db.query(ParcelFloodImpact).filter(
        ParcelFloodImpact.parcel_id == p.id,
        ParcelFloodImpact.flood_event_id == active_event.id
    ).first()

    overlap = imp.overlap_percentage if imp else rec.flood_component
    ev_score = p.evidence.evidence_score if p.evidence else rec.cultivation_component

    connected_m = [{"market_name": l.market.name, "dependency_score": l.dependency_score} for l in p.market_links if l.market]

    return RecoveryPriorityDetailResponse(
        id=rec.id,
        parcel_id=p.parcel_id,
        crop_type=p.crop_type,
        area_acres=p.area_acres,
        priority_score=rec.priority_score,
        priority_level=rec.priority_level,
        flood_exposure_pct=overlap,
        cultivation_evidence_score=ev_score,
        estimated_production_impact_tons=round(rec.production_component / 2.5, 2),
        structured_reasons=rec.structured_reasons,
        flood_component=rec.flood_component,
        cultivation_component=rec.cultivation_component,
        market_component=rec.market_component,
        crop_component=rec.crop_component,
        production_component=rec.production_component,
        connected_markets=connected_m
    )
