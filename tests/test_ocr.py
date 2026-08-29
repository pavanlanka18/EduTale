import io
import sys
import os
from PIL import Image, ImageDraw

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from models.ocr_model import ocr_engine
from pipeline.content_pipeline import content_pipeline

def create_sample_text_image(text: str = "Ecosystem Food Chain") -> bytes:
    """Helper to generate a PNG byte stream containing drawn text."""
    img = Image.new('RGB', (400, 100), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((10, 40), text, fill=(0, 0, 0))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

def test_ocr_clean_text_postprocessing():
    """Test line hyphenation removal and spacing cleanup."""
    raw_ocr = "Photo-\nsynthesis produces oxygen.\nPrimary consumers eat grass."
    cleaned = ocr_engine.clean_extracted_text(raw_ocr)
    assert "Photosynthesis" in cleaned
    assert "Primary consumers" in cleaned

def test_ocr_extraction_from_bytes():
    """Test extracting text from generated image bytes."""
    img_bytes = create_sample_text_image("Ecosystem Food Chain")
    extracted = ocr_engine.extract_text_from_bytes(img_bytes)
    assert isinstance(extracted, str)
    assert len(extracted) > 0

def test_content_pipeline_with_image():
    """Test content extraction pipeline receiving an image byte stream."""
    img_bytes = create_sample_text_image("Photosynthesis Notes")
    result = content_pipeline.process_content_input(
        content_data=img_bytes,
        filename="notes.png",
        content_type="image"
    )
    assert result["source_type"] == "image"
    assert "cleaned_content" in result
    assert isinstance(result["key_concepts"], list)

def test_file_upload_ocr_endpoint(client):
    """Test POST /lessons/upload endpoint with an image file."""
    img_bytes = create_sample_text_image("Chapter 4 Food Chains")
    
    files = {
        "file": ("textbook_page.png", img_bytes, "image/png")
    }
    data = {
        "student_id": "student-sample-1",
        "title": "Uploaded Chapter OCR"
    }

    response = client.post("/lessons/upload", files=files, data=data)
    assert response.status_code == 201
    json_data = response.json()
    assert json_data["title"] == "Uploaded Chapter OCR"
    assert "lesson_id" in json_data
