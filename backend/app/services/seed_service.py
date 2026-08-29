import random
import math
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from shapely.geometry import Polygon, Point
from geoalchemy2.shape import from_shape

from app.models.food_system import (
    AgriculturalParcel,
    Market,
    MarketLink,
    CultivationEvidence,
    CultivationStatus
)
from app.models.flood import FloodEvent, FloodSeverity, ParcelFloodImpact
from app.services.evidence_engine import calculate_cultivation_evidence_score
from app.services.market_linkage_engine import calculate_market_dependency
from app.core.geospatial import calculate_polygon_area_acres

PUNE_MARKETS = [
    {
        "market_id": "MKT-PUNE-01",
        "name": "Gultekdi APMC Wholesale Market",
        "lat": 18.4975,
        "lon": 73.8685,
        "market_type": "Primary APMC Wholesale Hub",
        "normal_supply_index": 95.0,
        "crop_categories": ["Onion", "Tomato", "Sugarcane", "Wheat", "Pomegranate", "Leafy Greens"]
    },
    {
        "market_id": "MKT-PUNE-02",
        "name": "Pimpri Chinchwad APMC Market",
        "lat": 18.6298,
        "lon": 73.7997,
        "market_type": "Sub-Market Yard",
        "normal_supply_index": 85.0,
        "crop_categories": ["Onion", "Tomato", "Vegetables", "Wheat"]
    },
    {
        "market_id": "MKT-PUNE-03",
        "name": "Manchar Agricultural Hub (Ambegaon)",
        "lat": 19.0012,
        "lon": 73.9431,
        "market_type": "Regional Farmers Collection Hub",
        "normal_supply_index": 90.0,
        "crop_categories": ["Onion", "Tomato", "Potato", "Vegetables"]
    },
    {
        "market_id": "MKT-PUNE-04",
        "name": "Baramati Agro Produce Market",
        "lat": 18.1517,
        "lon": 74.5772,
        "market_type": "Agricultural Processing & Grain Market",
        "normal_supply_index": 92.0,
        "crop_categories": ["Sugarcane", "Wheat", "Pomegranate", "Onion"]
    },
    {
        "market_id": "MKT-PUNE-05",
        "name": "Junner Vegetable APMC Hub",
        "lat": 19.2081,
        "lon": 73.8762,
        "market_type": "Horticulture Export & Mandi Yard",
        "normal_supply_index": 88.0,
        "crop_categories": ["Tomato", "Pomegranate", "Onion", "Soybean"]
    }
]

CROPS = ["Onion", "Tomato", "Sugarcane", "Wheat", "Pomegranate", "Soybean"]

def generate_agricultural_polygon(center_lat: float, center_lon: float, size_deg: float = 0.003) -> Polygon:
    points = []
    num_points = 4
    angle_step = (2 * math.pi) / num_points
    for i in range(num_points):
        angle = i * angle_step + random.uniform(-0.2, 0.2)
        radius = size_deg * random.uniform(0.7, 1.3)
        lon = center_lon + radius * math.cos(angle)
        lat = center_lat + radius * math.sin(angle)
        points.append((lon, lat))
    points.append(points[0])
    return Polygon(points)

def seed_database(db: Session, num_parcels: int = 75):
    random.seed(42)

    # Clear existing
    try:
        db.query(ParcelFloodImpact).delete()
        db.query(FloodEvent).delete()
        db.query(MarketLink).delete()
        db.query(CultivationEvidence).delete()
        db.query(AgriculturalParcel).delete()
        db.query(Market).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Clear tables exception (proceeding to insert): {e}")

    # 1. Create Markets
    db_markets = []
    for m in PUNE_MARKETS:
        point = Point(m["lon"], m["lat"])
        market_obj = Market(
            market_id=m["market_id"],
            name=m["name"],
            geometry=from_shape(point, srid=4326),
            latitude=m["lat"],
            longitude=m["lon"],
            market_type=m["market_type"],
            normal_supply_index=m["normal_supply_index"],
            crop_categories=m["crop_categories"]
        )
        db.add(market_obj)
        db_markets.append(market_obj)

    db.commit()
    for m in db_markets:
        db.refresh(m)

    # Clusters around Pune agricultural belt
    cluster_centers = [
        (18.60, 73.95), # Khed
        (18.45, 74.05), # Haveli
        (18.80, 73.85), # Chakan
        (19.05, 73.90), # Manchar
        (18.30, 74.20), # Shirur
        (18.20, 74.50), # Baramati
    ]

    # 2. Create Parcels
    db_parcels = []
    statuses = ["active", "active", "active", "inactive", "uncertain"]

    for i in range(1, num_parcels + 1):
        cluster_lat, cluster_lon = random.choice(cluster_centers)
        center_lat = cluster_lat + random.uniform(-0.08, 0.08)
        center_lon = cluster_lon + random.uniform(-0.08, 0.08)

        poly = generate_agricultural_polygon(center_lat, center_lon)
        area = calculate_polygon_area_acres(poly)
        crop = random.choice(CROPS)
        status = random.choice(statuses)

        crop_activity = round(random.uniform(60.0, 98.0), 1) if status == "active" else round(random.uniform(10.0, 40.0), 1)
        hist_activity = round(random.uniform(50.0, 95.0), 1)
        market_linkage_score = round(random.uniform(40.0, 90.0), 1)
        admin_signal = round(random.uniform(30.0, 85.0), 1)

        parcel = AgriculturalParcel(
            parcel_id=f"PARCEL-PNE-{i:03d}",
            geometry=from_shape(poly, srid=4326),
            area_acres=max(0.5, area),
            crop_type=crop,
            cultivation_status=status,
            crop_activity_score=crop_activity,
            historical_activity_score=hist_activity,
            market_linkage_score=market_linkage_score,
            administrative_signal_score=admin_signal
        )
        db.add(parcel)
        db_parcels.append((parcel, poly.centroid.y, poly.centroid.x))

    db.commit()

    # 3. Evidence & Market Links
    for parcel, p_lat, p_lon in db_parcels:
        db.refresh(parcel)
        evidence_score, evidence_status = calculate_cultivation_evidence_score(
            crop_activity=parcel.crop_activity_score,
            historical_activity=parcel.historical_activity_score,
            market_linkage=parcel.market_linkage_score,
            administrative_signal=parcel.administrative_signal_score
        )

        evidence = CultivationEvidence(
            parcel_id=parcel.id,
            crop_activity_score=parcel.crop_activity_score,
            historical_activity_score=parcel.historical_activity_score,
            market_linkage_score=parcel.market_linkage_score,
            administrative_signal_score=parcel.administrative_signal_score,
            parcel_activity_score=75.0,
            evidence_score=evidence_score,
            evidence_status=evidence_status.value if hasattr(evidence_status, "value") else str(evidence_status)
        )
        db.add(evidence)

        for market in db_markets:
            dep_score, supply_share = calculate_market_dependency(
                parcel_crop=parcel.crop_type,
                parcel_lat=p_lat,
                parcel_lon=p_lon,
                market_categories=market.crop_categories,
                market_lat=market.latitude,
                market_lon=market.longitude
            )
            if dep_score > 20.0:
                link = MarketLink(
                    parcel_id=parcel.id,
                    market_id=market.id,
                    dependency_score=dep_score,
                    estimated_supply_share=supply_share
                )
                db.add(link)

    db.commit()

    # 4. Create 2 Prototype Flood Scenarios
    flood_poly_1 = Polygon([
        (73.98, 18.35),
        (74.25, 18.35),
        (74.25, 18.55),
        (73.98, 18.55),
        (73.98, 18.35)
    ])

    flood_event_1 = FloodEvent(
        event_id="FLD-PNE-01",
        name="Eastern Pune Riverine Flash Flood",
        geometry=from_shape(flood_poly_1, srid=4326),
        severity="severe",
        event_date=datetime.now(timezone.utc),
        description="Illustrative severe flash flood event affecting Eastern Pune peri-urban agricultural clusters.",
        is_active=False
    )

    flood_poly_2 = Polygon([
        (73.80, 18.75),
        (74.02, 18.75),
        (74.02, 19.10),
        (73.80, 19.10),
        (73.80, 18.75)
    ])

    flood_event_2 = FloodEvent(
        event_id="FLD-PNE-02",
        name="Northern Agricultural Belt Monsoon Inundation",
        geometry=from_shape(flood_poly_2, srid=4326),
        severity="high",
        event_date=datetime.now(timezone.utc),
        description="Illustrative monsoon inundation scenario along the Northern Pune horticulture corridor.",
        is_active=False
    )

    db.add(flood_event_1)
    db.add(flood_event_2)
    db.commit()

    print(f"Successfully seeded database with {len(db_parcels)} Pune parcels, {len(db_markets)} markets, and 2 flood scenarios.")
