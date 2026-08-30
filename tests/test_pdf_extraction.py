import io
from PIL import Image
from models.ocr_model import ocr_engine
from rag.document_loader import document_loader
from rag.vector_store import vector_store


def test_pdf_with_text_layer_extracts_real_text():
    """Test 1: A PDF with a text layer extracts its real text."""
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Photosynthesis converts solar light into chemical energy in plant chloroplasts.")
    pdf_bytes = doc.tobytes()
    doc.close()

    extracted = document_loader.load_from_bytes(pdf_bytes, "text_layer.pdf")
    assert "Photosynthesis converts solar light" in extracted
    assert "chloroplasts" in extracted


def test_pdf_unreadable_returns_422_and_no_vector_store_add(client):
    """Test 2: A PDF with no text layer and unreadable images returns HTTP 422 and nothing added to vector store."""
    initial_vector_count = len(vector_store._chunks)

    # Create a PDF with a blank image page (no readable text)
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    pdf_bytes = doc.tobytes()
    doc.close()

    files = {"file": ("unreadable.pdf", pdf_bytes, "application/pdf")}
    response = client.post("/api/v1/documents/upload", files=files)

    assert response.status_code == 422
    assert "This PDF contains no readable text" in response.json()["detail"]
    assert len(vector_store._chunks) == initial_vector_count


def test_corrupted_pdf_returns_422(client):
    """Test corrupted PDF returns HTTP 422 with corruption detail message."""
    files = {"file": ("corrupted.pdf", b"NOT_A_VALID_PDF_STREAM", "application/pdf")}
    response = client.post("/api/v1/documents/upload", files=files)

    assert response.status_code == 422
    assert "This file could not be opened as a PDF" in response.json()["detail"]


def test_extract_text_from_pil_blank_image_returns_empty():
    """Test 3: extract_text_from_pil on a blank image returns an empty string."""
    blank_img = Image.new("RGB", (200, 200), color=(255, 255, 255))
    result = ocr_engine.extract_text_from_pil(blank_img)
    assert result == ""
