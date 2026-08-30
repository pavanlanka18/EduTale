def test_frontend_api_endpoints_integration(client, monkeypatch):
    """Regression test verifying that frontend service endpoints resolve correctly on the backend API."""
    monkeypatch.setenv("STORY_MODEL_URL", "http://localhost:8000")

    # 1. Documents upload text endpoint (/api/v1/documents/upload)
    upload_res = client.post("/api/v1/documents/upload", data={"text": "Photosynthesis is the process used by plants to convert light energy into chemical energy."})
    assert upload_res.status_code == 200
    doc_data = upload_res.json()
    assert "document_id" in doc_data
    doc_id = doc_data["document_id"]

    # Verify document is stored in database
    from app.core.database import db
    stored_doc = db.get_document(doc_id)
    assert stored_doc is not None
    assert stored_doc["chunk_count"] > 0

    # 2. RAG Story generation endpoint (/api/v1/story/generate)
    # Note: When remote model is unreachable, backend returns 503 as expected for story service
    story_res = client.post(
        "/api/v1/story/generate",
        json={
            "document_id": doc_id,
            "topic": "Photosynthesis",
            "profile": {
                "age": 10,
                "grade": 5,
                "interest": "animals"
            }
        }
    )
    assert story_res.status_code in (200, 503)

    # 3. Lessons create endpoint (/api/v1/lessons/create)
    lesson_create_res = client.post(
        "/api/v1/lessons/create",
        json={
            "title": "Ecosystem Food Chains",
            "content": "Plants convert solar energy via photosynthesis. Herbivores eat plants.",
            "student_id": "student-sample-1",
            "content_type": "text"
        }
    )
    assert lesson_create_res.status_code == 201
    assert "lesson_id" in lesson_create_res.json()

    # 4. Lessons upload endpoint (/api/v1/lessons/upload)
    files = {"file": ("notes.txt", b"Photosynthesis energy flow", "text/plain")}
    data = {"student_id": "student-sample-1"}
    lesson_upload_res = client.post("/api/v1/lessons/upload", files=files, data=data)
    assert lesson_upload_res.status_code == 201
    assert "lesson_id" in lesson_upload_res.json()

