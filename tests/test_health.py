def test_root_endpoint(client):
    """Test the root GET / endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to EduTale AI Backend" in data["message"]

def test_health_check(client):
    """Test GET /health returns 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data

def test_health_readiness(client):
    """Test GET /health/ready returns 200 and ready dependencies."""
    response = client.get("/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["ready"] is True
    assert "dependencies" in data

def test_student_endpoints(client):
    """Test POST /students and GET /students/{id}."""
    payload = {
        "name": "Jordan",
        "age": 14,
        "grade": 9,
        "interests": ["space", "science"],
        "learning_style": "visual"
    }
    create_res = client.post("/students", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == "Jordan"
    assert "student_id" in created_data

    student_id = created_data["student_id"]
    get_res = client.get(f"/students/{student_id}")
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
    create_res = client.post("/lessons/create", json=payload)
    assert create_res.status_code == 201
    lesson_data = create_res.json()
    assert lesson_data["title"] == "Photosynthesis Fundamentals"
    assert "lesson_id" in lesson_data

    lesson_id = lesson_data["lesson_id"]

    # Get lesson
    get_res = client.get(f"/lessons/{lesson_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Photosynthesis Fundamentals"

    # List lessons
    list_res = client.get("/lessons")
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # Delete lesson
    del_res = client.delete(f"/lessons/{lesson_id}")
    assert del_res.status_code == 200

    # Verify 404
    get_again = client.get(f"/lessons/{lesson_id}")
    assert get_again.status_code == 404
