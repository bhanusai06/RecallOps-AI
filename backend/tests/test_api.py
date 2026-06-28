import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_analyze_incident_valid_hit():
    """Test a valid request that causes a mock memory hit ('strong')."""
    payload = {
        "log": "A strong crash loop back off occurred.",
        "engineer_notes": "None",
        "environment": "production",
        "service": "auth"
    }
    response = client.post("/api/v1/incidents/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "incident_id" in data
    assert len(data["memory"]["matches"]) >= 0

def test_analyze_incident_valid_miss():
    """Test a valid request that causes a mock memory miss."""
    payload = {
        "log": "A random new issue.",
        "engineer_notes": "None"
    }
    response = client.post("/api/v1/incidents/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["memory"]["matches"]) >= 0

def test_analyze_incident_empty_log():
    """Test validation failure for empty log."""
    payload = {
        "log": "   ",
        "engineer_notes": "None"
    }
    response = client.post("/api/v1/incidents/analyze", json=payload)
    assert response.status_code == 400
    assert "error" in response.json()

def test_analyze_incident_invalid_schema():
    """Test missing log field entirely."""
    payload = {
        "engineer_notes": "None"
    }
    response = client.post("/api/v1/incidents/analyze", json=payload)
    assert response.status_code == 422
