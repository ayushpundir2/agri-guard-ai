from typing import Tuple
from app.schemas.risk import classify_risk_level, RiskLevel
from app.models.flood import FloodSeverity

SEVERITY_WEIGHTS = {
    FloodSeverity.LOW: 25.0,
    FloodSeverity.MODERATE: 50.0,
    FloodSeverity.HIGH: 75.0,
    FloodSeverity.SEVERE: 100.0
}

def calculate_city_food_supply_risk(
    affected_production_tons: float,
    avg_market_exposure_score: float,
    avg_crop_vulnerability: float,
    flood_severity: FloodSeverity
) -> Tuple[float, RiskLevel]:
    """
    Calculates overall city food-supply risk score (0-100) and risk level.
    
    Formula:
      food_supply_risk = 40% (affected_production_factor) +
                         25% (avg_market_exposure_score) +
                         20% (avg_crop_vulnerability * 100) +
                         15% (flood_severity_weight)
    """
    # Production factor normalized against 500 tons benchmark
    production_factor = min(100.0, (affected_production_tons / 500.0) * 100.0)
    severity_weight = SEVERITY_WEIGHTS.get(flood_severity, 50.0)
    vulnerability_score = min(100.0, avg_crop_vulnerability * 100.0)

    score = round(
        (production_factor * 0.40) +
        (avg_market_exposure_score * 0.25) +
        (vulnerability_score * 0.20) +
        (severity_weight * 0.15),
        1
    )
    score = max(0.0, min(100.0, score))
    return score, classify_risk_level(score)
