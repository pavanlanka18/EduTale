def test_root_endpoint(client):
    """Test the root GET / endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to EduTale AI Backend" in data["message"]

def test_health_check(client):
    """Test GET /api/v1/health returns 200 and healthy status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data

def test_health_readiness(client):
    """Test GET /api/v1/health/ready returns 200 and ready dependencies."""
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["ready"] is True
    assert "dependencies" in data

def test_student_endpoints(client):
    """Test POST /api/v1/students and GET /api/v1/students/{id}."""
    payload = {
        "name": "Jordan",
        "age": 14,
        "grade": 9,
        "interests": ["space", "science"],
        "learning_style": "visual"
    }
    create_res = client.post("/api/v1/students", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == "Jordan"
    assert "student_id" in created_data

    student_id = created_data["student_id"]
    get_res = client.get(f"/api/v1/students/{student_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Jordan"

def test_lesson_lifecycle(client):
    """Test creating, fetching, listing, and deleting a lesson."""
    payload = {
        "title": "Photosynthesis Fundamentals",
        "content": "Plants produce energy using sunlight.",
        "student_id": "student-sample-1",
        "content_type": "text"
    }
    create_res = client.post("/api/v1/lessons/create", json=payload)
    assert create_res.status_code == 201
    lesson_data = create_res.json()
    assert lesson_data["title"] == "Photosynthesis Fundamentals"
    assert "lesson_id" in lesson_data

    lesson_id = lesson_data["lesson_id"]

    # Get lesson
    get_res = client.get(f"/api/v1/lessons/{lesson_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Photosynthesis Fundamentals"

    # List lessons
    list_res = client.get("/api/v1/lessons")
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # Delete lesson
    del_res = client.delete(f"/api/v1/lessons/{lesson_id}")
    assert del_res.status_code == 200

    # Verify 404
    get_again = client.get(f"/api/v1/lessons/{lesson_id}")
    assert get_again.status_code == 404

