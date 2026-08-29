from app.models.food_system import EvidenceStatus
from app.schemas.food_system import EvidenceWeights

def calculate_cultivation_evidence_score(
    crop_activity: float,
    historical_activity: float,
    market_linkage: float,
    parcel_activity: float = 70.0,
    administrative_signal: float = 50.0,
    weights: EvidenceWeights = EvidenceWeights()
) -> tuple[float, EvidenceStatus]:
    """
    Calculates AI-assisted cultivation evidence score (0-100) using configurable weights.
    
    Formula:
      Score = (crop_activity * 0.30) + 
              (historical_activity * 0.25) + 
              (market_linkage * 0.20) + 
              (parcel_activity * 0.15) + 
              (administrative_signal * 0.10)
    """
    total_weight = (
        weights.crop_activity +
        weights.historical_activity +
        weights.market_linkage +
        weights.parcel_activity +
        weights.administrative_signal
    )
    
    weighted_score = (
        (crop_activity * weights.crop_activity) +
        (historical_activity * weights.historical_activity) +
        (market_linkage * weights.market_linkage) +
        (parcel_activity * weights.parcel_activity) +
        (administrative_signal * weights.administrative_signal)
    ) / total_weight

    score = round(max(0.0, min(100.0, weighted_score)), 1)

    if score >= 75.0:
        status = EvidenceStatus.HIGH
    elif score >= 50.0:
        status = EvidenceStatus.MEDIUM
    else:
        status = EvidenceStatus.LOW

    return score, status
