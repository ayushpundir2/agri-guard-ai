import pytest
from app.models.risk import RiskLevel, PriorityLevel
from app.models.flood import FloodSeverity
from app.services.production_impact_engine import calculate_parcel_production_impact
from app.services.market_exposure_engine import calculate_market_exposure_score
from app.services.food_risk_engine import calculate_city_food_supply_risk
from app.services.recovery_priority_engine import calculate_recovery_priority

def test_production_impact_engine():
    # 2.0 acres, Tomato (12 tons/acre baseline = 24.0 tons), 100% damage, 100% activity -> 24.0 tons impact
    impact = calculate_parcel_production_impact(
        affected_area_acres=2.0,
        crop_type="Tomato",
        crop_damage_score=100.0,
        crop_activity_score=100.0
    )
    assert impact == 24.0

def test_market_exposure_engine():
    # 100 tons affected supply loss, 100 normal supply index, 10 parcels, 100% dependency -> CRITICAL / HIGH exposure
    score, level = calculate_market_exposure_score(
        total_affected_supply_tons=100.0,
        normal_supply_index=100.0,
        connected_affected_parcels_count=10,
        avg_dependency_score=100.0
    )
    assert score > 50.0
    assert level in [RiskLevel.HIGH, RiskLevel.CRITICAL]

def test_city_food_supply_risk_engine():
    # 300 tons loss, 75 market exposure, 0.8 vulnerability, SEVERE flood -> HIGH/CRITICAL risk
    score, level = calculate_city_food_supply_risk(
        affected_production_tons=300.0,
        avg_market_exposure_score=75.0,
        avg_crop_vulnerability=0.8,
        flood_severity=FloodSeverity.SEVERE
    )
    assert score >= 50.0
    assert level in [RiskLevel.HIGH, RiskLevel.CRITICAL]

def test_recovery_priority_engine():
    # 90% flood exposure, 90 evidence, 80 market linkage, Tomato (0.9 vuln), 20 tons impact -> CRITICAL priority
    score, level, comps, reasons = calculate_recovery_priority(
        overlap_percentage=90.0,
        evidence_score=90.0,
        market_linkage_score=80.0,
        crop_type="Tomato",
        production_impact_tons=20.0
    )
    assert score >= 75.0
    assert level == PriorityLevel.CRITICAL
    assert len(reasons) > 0
