import os
import io
import logging
from typing import Dict, Any, Union
from models.ocr_model import ocr_engine

logger = logging.getLogger("edutale.rag.loader")

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
        """Extract text from PDF, falling back to OCR image rendering if PDF is scanned."""
        extracted_text = ""
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"
        except Exception as e:
            logger.warning(f"pypdf extraction failed or uninstalled: {e}")

        # If PDF is scanned (no native text), attempt OCR using pdf2image
        if not extracted_text.strip():
            logger.info("PDF appears to be scanned or contains image pages. Triggering pdf2image OCR pipeline...")
            try:
                from pdf2image import convert_from_bytes
                images = convert_from_bytes(pdf_bytes)
                ocr_pages = []
                for i, img in enumerate(images):
                    logger.info(f"Running EasyOCR on PDF page {i + 1}")
                    ocr_pages.append(ocr_engine.extract_text_from_pil(img))
                extracted_text = "\n\n".join(ocr_pages)
            except Exception as pdf_ocr_err:
                logger.error(f"pdf2image OCR failed: {pdf_ocr_err}")

        return ocr_engine.clean_extracted_text(extracted_text)

document_loader = DocumentLoader()
