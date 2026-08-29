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
    # 1. Enable PostGIS
    postgis_err = None
    try:
        with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
            try:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            except Exception:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;"))
            print("PostGIS extension created/verified.")
    except Exception as e:
        postgis_err = str(e)
        print(f"PostGIS extension error: {e}")

    # 2. Create tables
    tables_err = None
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created.")
    except Exception as e:
        tables_err = str(e)
        print(f"Table creation error: {e}")

    # 3. Seed database
    seed_err = None
    db = SessionLocal()
    try:
        from app.models.food_system import Market
        market_count = db.query(Market).count()
        if market_count == 0:
            print("Production database empty. Seeding Pune prototype dataset...")
            seed_database(db, num_parcels=75)
            print("Production database seeded successfully!")
    except Exception as e:
        seed_err = str(e)
        print(f"Seed error: {e}")
        try:
            Base.metadata.create_all(bind=engine)
            seed_database(db, num_parcels=75)
            print("Seed retry succeeded!")
        except Exception as retry_e:
            seed_err = f"Primary error: {e} | Retry error: {retry_e}"
    finally:
        db.close()

    app.state.db_init_log = {
        "postgis_err": postgis_err,
        "tables_err": tables_err,
        "seed_err": seed_err
    }

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
    init_log = getattr(app.state, "db_init_log", {})
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "type": type(exc).__name__, "db_init_log": init_log}
    )

@app.get("/api/db-diagnostic")
def db_diagnostic():
    init_log = getattr(app.state, "db_init_log", {})
    return {"init_log": init_log}

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
