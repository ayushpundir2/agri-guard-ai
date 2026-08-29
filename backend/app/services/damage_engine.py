from app.models.flood import ExposureLevel
from app.schemas.flood import CROP_VULNERABILITY

def classify_exposure_level(overlap_percentage: float) -> ExposureLevel:
    """Classifies exposure level based on overlap percentage."""
    if overlap_percentage >= 80.0:
        return ExposureLevel.SEVERE
    elif overlap_percentage >= 50.0:
        return ExposureLevel.HIGH
    elif overlap_percentage >= 20.0:
        return ExposureLevel.MODERATE
    else:
        return ExposureLevel.LOW

def calculate_crop_damage(
    overlap_percentage: float,
    crop_type: str,
    crop_activity_score: float
) -> float:
    """
    Prototype crop damage calculation:
      crop_damage = (overlap_percentage / 100) * crop_vulnerability * (crop_activity_score / 100) * 100
    Normalized to 0.0 - 100.0.
    """
    vulnerability = CROP_VULNERABILITY.get(crop_type, CROP_VULNERABILITY["General"])
    
    # Exposure factor (0.0 to 1.0)
    exposure_factor = max(0.0, min(1.0, overlap_percentage / 100.0))
    
    # Activity factor (0.0 to 1.0)
    activity_factor = max(0.0, min(1.0, crop_activity_score / 100.0))
    
    # Combined score
    damage_score = exposure_factor * vulnerability * activity_factor * 100.0
    
    return round(max(0.0, min(100.0, damage_score)), 1)
