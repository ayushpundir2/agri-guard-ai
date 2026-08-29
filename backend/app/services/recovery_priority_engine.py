from typing import List, Tuple, Dict, Any
from app.schemas.risk import classify_priority_level, PriorityLevel
from app.schemas.flood import CROP_VULNERABILITY

def calculate_recovery_priority(
    overlap_percentage: float,
    evidence_score: float,
    market_linkage_score: float,
    crop_type: str,
    production_impact_tons: float
) -> Tuple[float, PriorityLevel, Dict[str, float], List[str]]:
    """
    Calculates parcel recovery priority score (0-100), level, component scores, and structured explanations.
    
    Formula:
      30% flood_exposure (overlap_percentage)
    + 25% cultivation_evidence (evidence_score)
    + 20% market_importance (market_linkage_score)
    + 15% crop_vulnerability (crop_vulnerability * 100)
    + 10% production_impact (min(100, production_impact_tons * 2))
    """
    crop_vuln = CROP_VULNERABILITY.get(crop_type, CROP_VULNERABILITY["General"]) * 100.0
    prod_comp = min(100.0, production_impact_tons * 2.5)

    comp_flood = overlap_percentage
    comp_evidence = evidence_score
    comp_market = market_linkage_score
    comp_crop = crop_vuln
    comp_prod = prod_comp

    score = round(
        (comp_flood * 0.30) +
        (comp_evidence * 0.25) +
        (comp_market * 0.20) +
        (comp_crop * 0.15) +
        (comp_prod * 0.10),
        1
    )
    score = max(0.0, min(100.0, score))
    level = classify_priority_level(score)

    # Structured reasons generation
    reasons = []
    if comp_flood >= 75.0:
        reasons.append(f"{round(overlap_percentage)}% severe flood inundation exposure")
    elif comp_flood >= 40.0:
        reasons.append(f"{round(overlap_percentage)}% moderate flood exposure")

    if comp_evidence >= 70.0:
        reasons.append(f"{round(evidence_score, 1)}/100 AI-assisted cultivation evidence score")

    if comp_market >= 60.0:
        reasons.append(f"Strong supply linkage ({round(market_linkage_score, 1)}%) to primary Pune wholesale market")

    if comp_crop >= 70.0:
        reasons.append(f"High-vulnerability perishable crop category ({crop_type})")

    if comp_prod >= 30.0:
        reasons.append(f"Significant estimated crop production loss ({production_impact_tons} metric tons)")

    components = {
        "flood_component": comp_flood,
        "cultivation_component": comp_evidence,
        "market_component": comp_market,
        "crop_component": comp_crop,
        "production_component": comp_prod
    }

    return score, level, components, reasons
