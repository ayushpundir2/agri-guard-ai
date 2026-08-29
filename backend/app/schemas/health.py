from pydantic import BaseModel, Field
from datetime import datetime

class HealthCheckResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "ok"})
    service: str = Field(..., json_schema_extra={"example": "AgriGuard-AI API"})
    version: str = Field(..., json_schema_extra={"example": "0.1.0"})
    timestamp: datetime
    target_city: str = Field(..., json_schema_extra={"example": "Pune, Maharashtra, India"})
    database_connected: bool
