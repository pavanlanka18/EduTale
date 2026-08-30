import os
import pytest
from fastapi.testclient import TestClient

from pipeline.story_pipeline import prose_to_scenes
from pipeline.lesson_pipeline import lesson_pipeline
from backend.app.main import app

client = TestClient(app)


def test_prose_to_scenes_returns_populated_scenes():
    """Verification 1: prose_to_scenes on real story prose returns 4 populated scenes."""
    prose = (
        "Once upon a time in a vibrant ecosystem, the sun shone brightly on lush leaves.\n\n"
        "Milo the zebra arrived at the meadow to graze on fresh grass.\n\n"
        "As Milo gained energy, a lion observed from the shade of the tall acacia tree.\n\n"
        "Finally, nutrients returned to the soil to sustain new plant growth."
    )
    res = prose_to_scenes(prose, target_scenes=4)
    assert res["title"] is not None
    assert len(res["scenes"]) == 4
    for idx, scene in enumerate(res["scenes"], start=1):
        assert scene["title"] == f"Scene {idx}"
        assert len(scene["narration"]) > 0
        assert scene["visualDescription"] == scene["narration"]


def test_get_api_video_health():
    """Verification 2: GET /api/video/health returns status available."""
    response = client.get("/api/video/health")
    assert response.status_code == 200
    json_data = response.json()
    assert "status" in json_data
    assert json_data["service"] == "video_model"


def test_post_api_video_clip_creates_mp4_file():
    """Verification 3: POST /api/video/clip returns a real MP4 path and the file exists on disk."""
    payload = {
        "visual_description": "Sunlight streaming through vibrant green leaves in a tropical jungle.",
        "interest": "nature"
    }
    response = client.post("/api/video/clip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "clip_path" in data
    clip_path = data["clip_path"]
    assert os.path.exists(clip_path)
    assert clip_path.endswith(".mp4")
    assert os.path.getsize(clip_path) > 0


def test_full_lesson_end_to_end_pdf_to_assembled_mp4(tmp_path):
    """Verification 4: PDF -> topic -> profile -> story -> scenes -> clips -> assembled MP4."""
    # Create sample PDF
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Photosynthesis and Ecosystem Energy Transfer")
    pdf_bytes = doc.tobytes()
    doc.close()

    pdf_file = tmp_path / "photosynthesis.pdf"
    pdf_file.write_bytes(pdf_bytes)

    student_profile = {
        "name": "Alex",
        "age": 10,
        "grade": "Grade 5",
        "interests": ["animals", "space"]
    }

    result = lesson_pipeline.execute_full_lesson_pipeline(
        lesson_id="test_full_lesson_100",
        title="Photosynthesis Lesson",
        content=str(pdf_file),
        student_profile=student_profile,
        content_type="text"
    )

    assert result["lesson_id"] == "test_full_lesson_100"
    assert "story" in result
    assert result["total_scenes"] >= 4

    # Verify assembled MP4 file exists
    assembled_mp4 = os.path.join("data", "video", "test_full_lesson_100_assembled.mp4")
    assert os.path.exists(assembled_mp4)
    assert os.path.getsize(assembled_mp4) > 0
