from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class QuestionMessage(BaseModel):
    role: str
    content: str

class QuestionRequest(BaseModel):
    question: str = Field(..., json_schema_extra={"example": "What should the city prioritize?"})
    parcel_id: Optional[str] = None
    market_id: Optional[str] = None
    language: Optional[str] = "en"
    history: Optional[List[QuestionMessage]] = None

class AnalysisContent(BaseModel):
    summary: str
    reasoning: str
    recommended_actions: List[str]
    caveats: str

class AIAnalysisResponse(BaseModel):
    success: bool
    disaster_status: str
    active_event_name: Optional[str] = None
    overall_risk_score: Optional[float] = None
    risk_level: Optional[str] = None
    analysis: AnalysisContent
    error: Optional[str] = None
    calculated_at: datetime
    disclaimer: str = "AI reasoning layer operating over deterministic AgriGuard database context."
