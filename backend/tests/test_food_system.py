import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from shapely.geometry import Polygon, Point, mapping

from app.main import app
from app.core.database import get_db
from app.services.evidence_engine import calculate_cultivation_evidence_score
from app.services.market_linkage_engine import calculate_market_dependency
from app.models.food_system import EvidenceStatus, CultivationStatus

client = TestClient(app)

def test_evidence_formula():
    score, status = calculate_cultivation_evidence_score(
        crop_activity=80.0,
        historical_activity=80.0,
        market_linkage=80.0,
        parcel_activity=80.0,
        administrative_signal=80.0
    )
    assert score == 80.0
    assert status == EvidenceStatus.HIGH

def test_market_dependency_formula():
    dep_score, share = calculate_market_dependency(
        parcel_crop="Onion",
        parcel_lat=18.5,
        parcel_lon=73.8,
        market_categories=["Onion", "Tomato"],
        market_lat=18.5,
        market_lon=73.8
    )
    assert dep_score == 100.0
    assert share == 80.0

def test_evidence_formula_weights():
    # Test custom weights or boundaries
    score, status = calculate_cultivation_evidence_score(
        crop_activity=100.0,
        historical_activity=100.0,
        market_linkage=100.0,
        parcel_activity=100.0,
        administrative_signal=100.0
    )
    assert score == 100.0
    assert status == EvidenceStatus.HIGH

    low_score, low_status = calculate_cultivation_evidence_score(
        crop_activity=20.0,
        historical_activity=20.0,
        market_linkage=20.0,
        parcel_activity=20.0,
        administrative_signal=20.0
    )
    assert low_score == 20.0
    assert low_status == EvidenceStatus.LOW
