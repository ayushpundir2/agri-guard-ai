from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from shapely.geometry import box

from app.core.database import get_db
from app.models.food_system import (
    AgriculturalParcel,
    Market,
    MarketLink,
    CultivationEvidence,
    CultivationStatus
)
from app.models.flood import FloodEvent, ParcelFloodImpact
from app.schemas.food_system import (
    ParcelResponse,
    ParcelDetailResponse,
    MarketResponse,
    MarketDetailResponse,
    MarketLinkResponse,
    CultivationEvidenceResponse,
    SystemMetricsResponse
)
from app.schemas.flood import ParcelFloodImpactResponse
from app.core.geospatial import geometry_to_geojson

router = APIRouter()

@router.get("/parcels", response_model=List[ParcelResponse])
def get_parcels(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    crop_type: Optional[str] = None,
    cultivation_status: Optional[CultivationStatus] = None,
    bbox: Optional[str] = Query(None, description="MinLon,MinLat,MaxLon,MaxLat"),
    db: Session = Depends(get_db)
):
    query = db.query(AgriculturalParcel)

    if crop_type:
        query = query.filter(AgriculturalParcel.crop_type == crop_type)

    if cultivation_status:
        query = query.filter(AgriculturalParcel.cultivation_status == cultivation_status)

    if bbox:
        try:
            min_lon, min_lat, max_lon, max_lat = map(float, bbox.split(","))
            bbox_polygon = box(min_lon, min_lat, max_lon, max_lat)
            query = query.filter(func.ST_Intersects(
                AgriculturalParcel.geometry,
                func.ST_SetSRID(func.ST_GeomFromText(bbox_polygon.wkt), 4326)
            ))
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid bbox format. Expected 'minLon,minLat,maxLon,maxLat'")

    parcels = query.offset(skip).limit(limit).all()

    response = []
    for p in parcels:
        ev_score = p.evidence.evidence_score if p.evidence else None
        p_res = ParcelResponse.model_validate(p)
        p_res.evidence_score = ev_score
        response.append(p_res)

    return response


@router.get("/parcels/{parcel_id}", response_model=ParcelDetailResponse)
def get_parcel_detail(parcel_id: str, db: Session = Depends(get_db)):
    parcel = db.query(AgriculturalParcel).filter(
        (AgriculturalParcel.parcel_id == parcel_id) | (AgriculturalParcel.id.cast(func.text) == parcel_id)
    ).first()

    if not parcel:
        raise HTTPException(status_code=404, detail="Agricultural parcel not found")

    geojson_dict = geometry_to_geojson(parcel.geometry)

    market_links = []
    for link in parcel.market_links:
        m_link = MarketLinkResponse.model_validate(link)
        if link.market:
            m_link.market_name = link.market.name
            m_link.market_code = link.market.market_id
        market_links.append(m_link)

    evidence_resp = CultivationEvidenceResponse.model_validate(parcel.evidence) if parcel.evidence else None

    # Check active flood impact
    active_flood_impact = None
    active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()
    if active_event:
        impact = db.query(ParcelFloodImpact).filter(
            ParcelFloodImpact.parcel_id == parcel.id,
            ParcelFloodImpact.flood_event_id == active_event.id
        ).first()
        if impact:
            active_flood_impact = {
                "flood_event_name": active_event.name,
                "flood_event_id": active_event.event_id,
                "overlap_percentage": impact.overlap_percentage,
                "affected_area_acres": impact.affected_area_acres,
                "exposure_level": impact.exposure_level.value if hasattr(impact.exposure_level, "value") else str(impact.exposure_level),
                "estimated_crop_damage": impact.estimated_crop_damage
            }

    detail = ParcelDetailResponse(
        id=parcel.id,
        parcel_id=parcel.parcel_id,
        area_acres=parcel.area_acres,
        crop_type=parcel.crop_type,
        cultivation_status=parcel.cultivation_status,
        crop_activity_score=parcel.crop_activity_score,
        historical_activity_score=parcel.historical_activity_score,
        market_linkage_score=parcel.market_linkage_score,
        administrative_signal_score=parcel.administrative_signal_score,
        created_at=parcel.created_at,
        updated_at=parcel.updated_at,
        evidence_score=parcel.evidence.evidence_score if parcel.evidence else None,
        geometry_geojson=geojson_dict,
        evidence=evidence_resp,
        connected_markets=market_links,
        active_flood_impact=active_flood_impact
    )

    return detail


@router.get("/markets", response_model=List[MarketResponse])
def get_markets(db: Session = Depends(get_db)):
    markets = db.query(Market).all()
    results = []
    for m in markets:
        res = MarketResponse.model_validate(m)
        res.connected_parcels_count = len(m.parcel_links)
        results.append(res)
    return results


@router.get("/markets/{market_id}", response_model=MarketDetailResponse)
def get_market_detail(market_id: str, db: Session = Depends(get_db)):
    market = db.query(Market).filter(
        (Market.market_id == market_id) | (Market.id.cast(func.text) == market_id)
    ).first()

    if not market:
        raise HTTPException(status_code=404, detail="Market not found")

    connected_parcels = []
    crop_counts = {}

    for link in market.parcel_links:
        if link.parcel:
            p = link.parcel
            connected_parcels.append({
                "parcel_id": p.parcel_id,
                "crop_type": p.crop_type,
                "area_acres": p.area_acres,
                "dependency_score": link.dependency_score,
                "estimated_supply_share": link.estimated_supply_share
            })
            crop_counts[p.crop_type] = crop_counts.get(p.crop_type, 0) + 1

    top_crops = [{"crop": crop, "count": count} for crop, count in sorted(crop_counts.items(), key=lambda x: x[1], reverse=True)]

    return MarketDetailResponse(
        id=market.id,
        market_id=market.market_id,
        name=market.name,
        latitude=market.latitude,
        longitude=market.longitude,
        market_type=market.market_type,
        normal_supply_index=market.normal_supply_index,
        crop_categories=market.crop_categories,
        created_at=market.created_at,
        updated_at=market.updated_at,
        connected_parcels_count=len(connected_parcels),
        connected_parcels=connected_parcels,
        top_crops=top_crops
    )


@router.get("/map/overview")
def get_map_overview(db: Session = Depends(get_db)):
    features = []

    # Get active flood event impacts if available
    active_event = db.query(FloodEvent).filter(FloodEvent.is_active == True).first()
    impact_map = {}
    if active_event:
        impacts = db.query(ParcelFloodImpact).filter(
            ParcelFloodImpact.flood_event_id == active_event.id
        ).all()
        impact_map = {imp.parcel_id: imp for imp in impacts}

        # Add Active Flood Event Polygon Feature
        event_geom = geometry_to_geojson(active_event.geometry)
        features.append({
            "type": "Feature",
            "geometry": event_geom,
            "properties": {
                "feature_type": "flood_event",
                "event_id": active_event.event_id,
                "name": active_event.name,
                "severity": active_event.severity.value if hasattr(active_event.severity, "value") else str(active_event.severity)
            }
        })

    # 1. Parcels Features
    parcels = db.query(AgriculturalParcel).all()
    for p in parcels:
        geom = geometry_to_geojson(p.geometry)
        ev_score = p.evidence.evidence_score if p.evidence else None
        ev_status = p.evidence.evidence_status if p.evidence else "N/A"
        
        impact = impact_map.get(p.id)
        is_affected = impact is not None
        exposure_lvl = impact.exposure_level.value if (impact and hasattr(impact.exposure_level, "value")) else (str(impact.exposure_level) if impact else "NONE")
        overlap_pct = impact.overlap_percentage if impact else 0.0
        crop_damage = impact.estimated_crop_damage if impact else 0.0

        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "feature_type": "parcel",
                "id": p.id,
                "parcel_id": p.parcel_id,
                "crop_type": p.crop_type,
                "area_acres": p.area_acres,
                "cultivation_status": p.cultivation_status,
                "crop_activity_score": p.crop_activity_score,
                "evidence_score": ev_score,
                "evidence_status": ev_status,
                "is_affected_by_flood": is_affected,
                "exposure_level": exposure_lvl,
                "overlap_percentage": overlap_pct,
                "estimated_crop_damage": crop_damage
            }
        })

    # 2. Market Features
    markets = db.query(Market).all()
    for m in markets:
        geom = geometry_to_geojson(m.geometry)
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "feature_type": "market",
                "id": m.id,
                "market_id": m.market_id,
                "name": m.name,
                "market_type": m.market_type,
                "normal_supply_index": m.normal_supply_index,
                "connected_parcels": len(m.parcel_links)
            }
        })

    # 3. Supply Line Features
    links = db.query(MarketLink).filter(MarketLink.dependency_score >= 50.0).all()
    for link in links:
        if link.parcel and link.market:
            p = link.parcel
            m = link.market
            p_geom = geometry_to_geojson(p.geometry)
            coords = p_geom["coordinates"][0]
            avg_lon = sum(c[0] for c in coords) / len(coords)
            avg_lat = sum(c[1] for c in coords) / len(coords)

            line_geom = {
                "type": "LineString",
                "coordinates": [
                    [avg_lon, avg_lat],
                    [m.longitude, m.latitude]
                ]
            }

            features.append({
                "type": "Feature",
                "geometry": line_geom,
                "properties": {
                    "feature_type": "market_link",
                    "parcel_id": p.parcel_id,
                    "market_id": m.market_id,
                    "crop_type": p.crop_type,
                    "dependency_score": link.dependency_score
                }
            })

    return {
        "type": "FeatureCollection",
        "features": features
    }


@router.get("/metrics", response_model=SystemMetricsResponse)
def get_system_metrics(db: Session = Depends(get_db)):
    parcels_count = db.query(AgriculturalParcel).count()
    active_count = db.query(AgriculturalParcel).filter(
        AgriculturalParcel.cultivation_status == CultivationStatus.ACTIVE
    ).count()
    markets_count = db.query(Market).count()

    crop_stats = db.query(
        AgriculturalParcel.crop_type,
        func.count(AgriculturalParcel.id)
    ).group_by(AgriculturalParcel.crop_type).all()

    crop_dict = {crop: count for crop, count in crop_stats}

    return SystemMetricsResponse(
        parcels_monitored=parcels_count,
        active_cultivation_count=active_count,
        markets_connected=markets_count,
        crops_represented=len(crop_dict),
        crop_distribution=crop_dict
    )
