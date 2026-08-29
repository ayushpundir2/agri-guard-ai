from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.health import router as health_router
from app.api.food_system import router as food_system_router
from app.api.flood import router as flood_router
from app.api.risk import router as risk_router
from app.api.ai import router as ai_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API foundation for AgriGuard-AI city food-resilience platform"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
