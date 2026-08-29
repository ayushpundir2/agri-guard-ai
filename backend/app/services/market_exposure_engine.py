from typing import List, Dict, Any, Tuple
from app.schemas.risk import classify_risk_level, RiskLevel

def calculate_market_exposure_score(
    total_affected_supply_tons: float,
    normal_supply_index: float,
    connected_affected_parcels_count: int,
    avg_dependency_score: float
) -> Tuple[float, RiskLevel]:
    """
    Calculates market supply exposure score (0-100) and risk level.
    
    Formula:
      supply_ratio = min(1.0, (total_affected_supply_tons / (normal_supply_index * 2.0)))
      dependency_factor = max(0.2, avg_dependency_score / 100.0)
      exposure_score = (supply_ratio * 70.0 + (min(connected_affected_parcels_count, 10) / 10.0) * 30.0) * dependency_factor
    """
    supply_ratio = min(1.0, (total_affected_supply_tons / (max(normal_supply_index, 10.0) * 2.0)))
    parcel_volume_factor = min(1.0, connected_affected_parcels_count / 10.0)
    dependency_factor = max(0.2, min(1.0, avg_dependency_score / 100.0))

    raw_score = ((supply_ratio * 70.0) + (parcel_volume_factor * 30.0)) * dependency_factor
    score = round(max(0.0, min(100.0, raw_score)), 1)
    
    return score, classify_risk_level(score)
