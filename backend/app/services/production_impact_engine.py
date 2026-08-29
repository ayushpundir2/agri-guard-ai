from typing import Dict

# Average crop baseline yield in metric tons per acre per season (Prototype estimates)
CROP_YIELD_PER_ACRE: Dict[str, float] = {
    "Sugarcane": 35.0,
    "Onion": 8.5,
    "Tomato": 12.0,
    "Potato": 10.0,
    "Wheat": 2.2,
    "Soybean": 1.8,
    "Pomegranate": 5.0,
    "Leafy Greens": 6.0,
    "General": 5.0
}

def calculate_parcel_production_impact(
    affected_area_acres: float,
    crop_type: str,
    crop_damage_score: float,
    crop_activity_score: float
) -> float:
    """
    Calculates estimated lost agricultural production in metric tons for an affected parcel.
    
    Formula:
      Baseline Production (tons) = affected_area_acres * crop_yield_per_acre
      Impact Factor = (crop_damage_score / 100) * (crop_activity_score / 100)
      Production Impact (tons) = Baseline Production * Impact Factor
    """
    yield_per_acre = CROP_YIELD_PER_ACRE.get(crop_type, CROP_YIELD_PER_ACRE["General"])
    baseline_tons = affected_area_acres * yield_per_acre
    
    damage_factor = max(0.0, min(1.0, crop_damage_score / 100.0))
    activity_factor = max(0.0, min(1.0, crop_activity_score / 100.0))
    
    impact_tons = baseline_tons * damage_factor * activity_factor
    return round(impact_tons, 2)
