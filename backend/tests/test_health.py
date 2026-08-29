import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from app.main import app
from app.core.database import get_db

def override_get_db():
    mock_db = MagicMock()
    # Mock successful SELECT 1 query
    mock_db.execute.return_value = True
    try:
        yield mock_db
    finally:
        pass

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Welcome to AgriGuard-AI API"

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "AgriGuard-AI API"
    assert data["target_city"] == "Pune, Maharashtra, India"
    assert data["database_connected"] is True
