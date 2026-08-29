from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine, SessionLocal, Base
from app.services.seed_service import seed_database
import app.models # register models

from app.api.health import router as health_router
from app.api.food_system import router as food_system_router
from app.api.flood import router as flood_router
from app.api.risk import router as risk_router
from app.api.ai import router as ai_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Enable PostGIS and create tables if not present
    try:
        with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
    except Exception as e:
        print(f"PostGIS extension notice: {e}")

    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        # Seed if parcels empty
        from app.models.food_system import AgriculturalParcel
        if db.query(AgriculturalParcel).count() == 0:
            print("Production database empty. Seeding Pune prototype dataset...")
            seed_database(db, num_parcels=75)
            print("Production database seeded successfully.")
        db.close()
    except Exception as e:
        print(f"Database startup initialization notice: {e}")

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API foundation for AgriGuard-AI city food-resilience platform",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "type": type(exc).__name__}
    )

# Include routers
app.include_router(health_router, prefix="/api")
app.include_router(food_system_router, prefix="/api")
app.include_router(flood_router, prefix="/api")
app.include_router(risk_router, prefix="/api")
app.include_router(ai_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to AgriGuard-AI API",
        "docs": "/docs",
        "health": "/api/health"
    }
