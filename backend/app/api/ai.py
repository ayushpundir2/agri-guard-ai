from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.core.database import get_db
from app.schemas.ai import QuestionRequest, AIAnalysisResponse, AnalysisContent
from app.services.ai_context_service import AIContextService
from app.services.gemini_service import GeminiService

router = APIRouter()

@router.post("/ai/analyze", response_model=AIAnalysisResponse)
def analyze_with_gemini(req: QuestionRequest, db: Session = Depends(get_db)):
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Question string cannot be empty.")

    # 1. Build structured system context from current database state
    context = AIContextService.build_system_context(
        db,
        parcel_id=req.parcel_id,
        market_id=req.market_id
    )

    # 2. Call Gemini Service (or fallback if API key unconfigured)
    result = GeminiService.generate_analysis(
        user_question=req.question.strip(),
        system_context=context
    )

    analysis_data = result.get("analysis") or result.get("fallback_analysis")
    analysis_obj = AnalysisContent(
        summary=analysis_data.get("summary", "Analysis unavailable."),
        reasoning=analysis_data.get("reasoning", "Context reasoning unavailable."),
        recommended_actions=analysis_data.get("recommended_actions", []),
        caveats=analysis_data.get("caveats", "Prototype methodology demonstration.")
    )

    active_d = context.get("active_disaster")
    risk_d = context.get("city_food_supply_risk")

    return AIAnalysisResponse(
        success=result.get("success", False),
        disaster_status=context.get("disaster_status", "NORMAL"),
        active_event_name=active_d.get("event_name") if active_d else None,
        overall_risk_score=risk_d.get("overall_risk_score") if risk_d else None,
        risk_level=risk_d.get("risk_level") if risk_d else None,
        analysis=analysis_obj,
        error=result.get("error"),
        calculated_at=datetime.now(timezone.utc)
    )
