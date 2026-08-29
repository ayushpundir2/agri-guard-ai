import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.services.gemini_service import GeminiService
from app.services.ai_context_service import AIContextService

client = TestClient(app)

def test_empty_question_validation():
    response = client.post("/api/ai/analyze", json={"question": ""})
    assert response.status_code == 400

def test_ai_analyze_fallback_when_no_api_key():
    mock_context = {
        "disaster_status": "NORMAL",
        "active_disaster": None,
        "city_food_supply_risk": None
    }
    with patch.object(AIContextService, "build_system_context", return_value=mock_context):
        with patch.object(GeminiService, "get_api_key", return_value=None):
            response = client.post("/api/ai/analyze", json={"question": "What should the city prioritize?"})
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is False
            assert "Gemini API key is not configured" in data["error"]
            assert "analysis" in data
            assert "summary" in data["analysis"]

def test_ai_analyze_mocked_gemini_success():
    mock_context = {
        "disaster_status": "ACTIVE_FLOOD",
        "active_disaster": {"event_name": "Eastern Pune Flash Flood"},
        "city_food_supply_risk": {"overall_risk_score": 61.8, "risk_level": "HIGH"}
    }
    mock_response = {
        "success": True,
        "analysis": {
            "summary": "The city should prioritize drainage in high-exposure tomato production areas.",
            "reasoning": "Tomatoes have a high vulnerability index and significant market flow to Gultekdi APMC.",
            "recommended_actions": [
                "Deploy emergency pumping to Chakan cluster",
                "Divert wholesale demand to secondary yards",
                "Verify cultivation evidence"
            ],
            "caveats": "Illustrative prototype scenario."
        }
    }

    with patch.object(AIContextService, "build_system_context", return_value=mock_context):
        with patch.object(GeminiService, "generate_analysis", return_value=mock_response):
            response = client.post("/api/ai/analyze", json={"question": "What should the city prioritize?"})
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["analysis"]["summary"] == "The city should prioritize drainage in high-exposure tomato production areas."
            assert len(data["analysis"]["recommended_actions"]) == 3
            assert data["active_event_name"] == "Eastern Pune Flash Flood"
            assert data["overall_risk_score"] == 61.8
