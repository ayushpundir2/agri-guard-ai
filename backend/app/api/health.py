from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.schemas.health import HealthCheckResponse
from app.core.config import settings
from app.core.database import get_db

router = APIRouter()

@router.get("/health", response_model=HealthCheckResponse)
def health_check(db: Session = Depends(get_db)):
    db_status = False
    try:
        db.execute(text("SELECT 1"))
        db_status = True
    except Exception:
        db_status = False

    return HealthCheckResponse(
        status="ok",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        timestamp=datetime.now(timezone.utc),
        target_city=settings.PROTOTYPE_CITY,
        database_connected=db_status
    )
