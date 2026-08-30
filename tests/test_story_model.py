import os
from fastapi.testclient import TestClient
import pytest


@pytest.fixture(autouse=True)
def set_story_model_env(monkeypatch):
    monkeypatch.setenv("STORY_MODEL_URL", "http://localhost:8000")


def test_story_health_endpoint(client: TestClient):
    """Test GET /api/v1/story/health returns 200 with model_available boolean."""
    response = client.get("/api/v1/story/health")
    assert response.status_code == 200
    data = response.json()
    assert "model_available" in data
    assert isinstance(data["model_available"], bool)


def test_story_generate_endpoint_503_when_no_server(client: TestClient):
    """Test POST /api/v1/story/generate returns 503 when remote server is unreachable."""
    payload = {
        "profile": {
            "age": 10,
            "grade": 5,
            "interest": "space"
        }
    }
    response = client.post("/api/v1/story/generate", json=payload)
    assert response.status_code == 503
    assert "Story generation service unavailable" in response.json()["detail"]


def test_story_generate_validation_error(client: TestClient):
    """Test POST /api/v1/story/generate with invalid profile payload."""
    payload = {
        "profile": {
            "age": 2,  # Invalid: ge=5
            "grade": 5,
            "interest": "space"
        }
    }
    response = client.post("/api/v1/story/generate", json=payload)
    assert response.status_code == 422

