from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriGuard-AI API"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    # Database
    DATABASE_URL: str = "postgresql://agriguard:agriguard_secret@localhost:5432/agriguard_db"
    
    # Target region
    PROTOTYPE_CITY: str = "Pune, Maharashtra, India"
    PROTOTYPE_LAT: float = 18.5204
    PROTOTYPE_LNG: float = 73.8567
    
    # Optional Gemini Key placeholder
    GEMINI_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
