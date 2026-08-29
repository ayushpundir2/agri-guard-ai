from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum

from app.core.database import Base

class UserRole(str, enum.Enum):
    CITY_ADMIN = "city_admin"
    DISASTER_OFFICER = "disaster_officer"
    AGRICULTURAL_OFFICER = "agricultural_officer"
    ANALYST = "analyst"  # Default role for all signups & Google OAuth

class AuthProvider(str, enum.Enum):
    EMAIL = "email"
    GOOGLE = "google"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    password_hash = Column(String(255), nullable=True) # Null for Google OAuth users
    auth_provider = Column(Enum(AuthProvider, native_enum=False), default=AuthProvider.EMAIL, nullable=False)
    role = Column(Enum(UserRole, native_enum=False), default=UserRole.ANALYST, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
