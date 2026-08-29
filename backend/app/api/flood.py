from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.flood import FloodEvent, ParcelFloodImpact
from app.schemas.flood import (
    FloodEventResponse,
    FloodEventDetailResponse,
    ParcelFloodImpactResponse,
    FloodOverviewResponse
)
from app.services.flood_service import FloodAnalysisService
from app.core.geospatial import geometry_to_geojson

router = APIRouter()

@router.get("/flood-events", response_model=List[FloodEventResponse])
def get_flood_events(db: Session = Depends(get_db)):
    events = db.query(FloodEvent).all()
    return events


@router.get("/flood-events/{event_id}", response_model=FloodEventDetailResponse)
def get_flood_event_detail(event_id: str, db: Session = Depends(get_db)):
    event = db.query(FloodEvent).filter(
        (FloodEvent.event_id == event_id) | (FloodEvent.id.cast(str) == event_id)
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Flood event scenario not found")

    geom_geojson = geometry_to_geojson(event.geometry)
    impact_count = len(event.impacts)

    return FloodEventDetailResponse(
        id=event.id,
        event_id=event.event_id,
        name=event.name,
        severity=event.severity,
        event_date=event.event_date,
        description=event.description,
        is_active=event.is_active,
        created_at=event.created_at,
        geometry_geojson=geom_geojson,
        impacted_parcels_count=impact_count
    )


@router.post("/flood-events/{event_id}/simulate", response_model=FloodOverviewResponse)
def simulate_flood_event(event_id: str, db: Session = Depends(get_db)):
    try:
        active_event = FloodAnalysisService.simulate_flood_event(db, event_id)
        overview = FloodAnalysisService.get_flood_overview(db)
        return overview
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/flood-events/{event_id}/impacts", response_model=List[ParcelFloodImpactResponse])
def get_flood_event_impacts(event_id: str, db: Session = Depends(get_db)):
    event = db.query(FloodEvent).filter(
        (FloodEvent.event_id == event_id) | (FloodEvent.id.cast(str) == event_id)
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Flood event scenario not found")

    impacts = db.query(ParcelFloodImpact).filter(
        ParcelFloodImpact.flood_event_id == event.id
    ).all()

    results = []
    for imp in impacts:
        res = ParcelFloodImpactResponse.model_validate(imp)
        if imp.parcel:
            res.parcel_code = imp.parcel.parcel_id
            res.crop_type = imp.parcel.crop_type
        results.append(res)

    return results


@router.get("/flood/overview", response_model=FloodOverviewResponse)
def get_flood_overview(db: Session = Depends(get_db)):
    overview = FloodAnalysisService.get_flood_overview(db)
    return overview


@router.post("/flood/reset", response_model=FloodOverviewResponse)
def reset_flood_scenario(db: Session = Depends(get_db)):
    FloodAnalysisService.reset_flood_scenario(db)
    return FloodAnalysisService.get_flood_overview(db)
