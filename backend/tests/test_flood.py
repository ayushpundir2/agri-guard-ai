import pytest
from app.models.flood import ExposureLevel, FloodSeverity
from app.services.damage_engine import classify_exposure_level, calculate_crop_damage

def test_classify_exposure_level():
    assert classify_exposure_level(95.0) == ExposureLevel.SEVERE
    assert classify_exposure_level(80.0) == ExposureLevel.SEVERE
    assert classify_exposure_level(65.0) == ExposureLevel.HIGH
    assert classify_exposure_level(50.0) == ExposureLevel.HIGH
    assert classify_exposure_level(30.0) == ExposureLevel.MODERATE
    assert classify_exposure_level(20.0) == ExposureLevel.MODERATE
    assert classify_exposure_level(10.0) == ExposureLevel.LOW
    assert classify_exposure_level(0.0) == ExposureLevel.LOW

def test_calculate_crop_damage():
    # 100% overlap, Leafy Greens (0.95 vuln), 100% crop activity -> 95.0 damage
    damage = calculate_crop_damage(
        overlap_percentage=100.0,
        crop_type="Leafy Greens",
        crop_activity_score=100.0
    )
    assert damage == 95.0

    # 50% overlap, Wheat (0.35 vuln), 80% crop activity -> 50% * 0.35 * 80% * 100 = 14.0 damage
    wheat_damage = calculate_crop_damage(
        overlap_percentage=50.0,
        crop_type="Wheat",
        crop_activity_score=80.0
    )
    assert wheat_damage == 14.0

    # 0% overlap -> 0 damage
    zero_damage = calculate_crop_damage(
        overlap_percentage=0.0,
        crop_type="Tomato",
        crop_activity_score=90.0
    )
    assert zero_damage == 0.0
