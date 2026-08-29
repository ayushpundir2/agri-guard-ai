from typing import List, Tuple
from app.core.geospatial import calculate_distance_km

def calculate_market_dependency(
    parcel_crop: str,
    parcel_lat: float,
    parcel_lon: float,
    market_categories: List[str],
    market_lat: float,
    market_lon: float,
    max_distance_km: float = 100.0
) -> Tuple[float, float]:
    """
    Evaluates market linkage relationship:
    distance suitability + crop compatibility + market relevance -> dependency score & supply share.
    """
    # 1. Crop Compatibility Score (0 or 100)
    crop_match = parcel_crop in market_categories or "General" in market_categories
    crop_score = 100.0 if crop_match else 10.0

    # 2. Geographic Distance & Distance Suitability
    distance_km = calculate_distance_km(parcel_lat, parcel_lon, market_lat, market_lon)
    
    # Distance decay factor (100% at 0km, linear decay down to 0 at max_distance_km)
    if distance_km >= max_distance_km:
        distance_suitability = 0.0
    else:
        distance_suitability = 100.0 * (1.0 - (distance_km / max_distance_km))

    # 3. Overall Dependency Score (60% distance suitability, 40% crop suitability)
    dependency_score = round((distance_suitability * 0.6) + (crop_score * 0.4), 1)

    # 4. Estimated Supply Share (%)
    estimated_supply_share = round(max(0.0, dependency_score * 0.8), 1)

    return dependency_score, estimated_supply_share
