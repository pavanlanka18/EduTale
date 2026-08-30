import os
import io
import logging
from typing import Dict, Any, Union
import fitz  # PyMuPDF
from models.ocr_model import ocr_engine

logger = logging.getLogger("edutale.rag.loader")


class TextExtractionError(Exception):
    """Custom exception raised when text cannot be extracted from a document."""
    pass


class DocumentLoader:
    """Document loader handling text files, PDFs, and OCR image files."""

    SUPPORTED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}

    def load_from_bytes(self, content_bytes: bytes, filename: str) -> str:
        """Extract text from raw file bytes based on file extension."""
        ext = os.path.splitext(filename)[1].lower()

        if ext in self.SUPPORTED_IMAGE_EXTENSIONS:
            logger.info(f"Extracting text from image file '{filename}' using EasyOCR")
            return ocr_engine.extract_text_from_bytes(content_bytes)
        elif ext == ".pdf":
            logger.info(f"Extracting text from PDF file '{filename}'")
            return self._extract_pdf_bytes(content_bytes)
        else:
            # Treat as plain text
            logger.info(f"Reading text file '{filename}' directly")
            return content_bytes.decode("utf-8", errors="ignore")

    def load_from_file_path(self, file_path: str) -> str:
        """Extract text from a file on disk."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()

        if ext in self.SUPPORTED_IMAGE_EXTENSIONS:
            return ocr_engine.extract_text_from_path(file_path)
        elif ext == ".pdf":
            with open(file_path, "rb") as f:
                return self._extract_pdf_bytes(f.read())
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()

    def _extract_pdf_bytes(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF using PyMuPDF (fitz), falling back to EasyOCR on page rasterization."""
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as e:
            raise TextExtractionError(f"Corrupted or invalid PDF structure: {e}")

        extracted_text = ""
        for page in doc:
            page_text = page.get_text()
            if page_text:
                extracted_text += page_text + "\n"

        if extracted_text.strip():
            return ocr_engine.clean_extracted_text(extracted_text)

        # If empty text layer, rasterize each page and pass image to EasyOCR
        logger.info("PDF has no native text layer; rasterizing pages for EasyOCR...")
        ocr_pages = []
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            page_ocr = ocr_engine.extract_text_from_bytes(img_bytes)
            if page_ocr.strip():
                ocr_pages.append(page_ocr)

        full_ocr_text = "\n\n".join(ocr_pages)
        if full_ocr_text.strip():
            return ocr_engine.clean_extracted_text(full_ocr_text)

        raise TextExtractionError("PDF contains no readable text layer and EasyOCR detected no text on rasterized pages.")


document_loader = DocumentLoader()
