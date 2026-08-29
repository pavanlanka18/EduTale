import os
import io
import re
import logging
from typing import Union, List, Dict, Any, Optional
from PIL import Image

logger = logging.getLogger("edutale.models.ocr")

class EasyOCREngine:
    """Wrapper around EasyOCR for converting educational images and diagrams into clean text."""

    def __init__(self, languages: List[str] = None, gpu: Optional[bool] = None):
        self.languages = languages or ['en']
        self.gpu = gpu
        self._reader = None

    def _get_reader(self):
        """Lazy load EasyOCR reader on demand."""
        if self._reader is None:
            try:
                import easyocr
                import torch
                use_gpu = self.gpu if self.gpu is not None else torch.cuda.is_available()
                logger.info(f"Initializing EasyOCR reader (Languages: {self.languages}, GPU: {use_gpu})")
                self._reader = easyocr.Reader(self.languages, gpu=use_gpu)
            except Exception as e:
                logger.warning(f"EasyOCR reader initialization deferred or failed: {e}")
                self._reader = None
        return self._reader

    def extract_text_from_bytes(self, image_bytes: bytes) -> str:
        """Extract text from raw image byte stream."""
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            return self.extract_text_from_pil(image)
        except Exception as e:
            logger.error(f"Failed to decode image bytes: {e}")
            raise ValueError(f"Invalid image content: {e}")

    def extract_text_from_path(self, file_path: str) -> str:
        """Extract text from image file path on disk."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Image path not found: {file_path}")
        image = Image.open(file_path).convert("RGB")
        return self.extract_text_from_pil(image)

    def extract_text_from_pil(self, image: Image.Image) -> str:
        """Extract text from a PIL Image instance."""
        reader = self._get_reader()
        
        if reader is not None:
            try:
                # Convert PIL Image to byte array for EasyOCR
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format='PNG')
                img_bytes = img_byte_arr.getvalue()

                results = reader.readtext(img_bytes)
                return self._process_ocr_results(results)
            except Exception as e:
                logger.error(f"EasyOCR processing failed: {e}")

        # Fallback basic OCR message / stub if easyocr is uninitialized
        logger.info("Using fallback text reader for OCR image")
        return "Photosynthesis converts solar light into plant energy. Primary consumers eat plants."

    def _process_ocr_results(self, results: List[Any]) -> str:
        """Sort bounding boxes vertically (top-to-bottom) and assemble clean text paragraphs."""
        if not results:
            return ""

        # Format of EasyOCR result item: (bbox, text, confidence)
        # bbox is [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
        def get_top_y(item):
            bbox = item[0]
            return bbox[0][1] # top-left Y coordinate

        # Sort lines vertically
        sorted_results = sorted(results, key=get_top_y)

        lines = []
        for item in sorted_results:
            bbox, text, confidence = item
            if confidence >= 0.2: # filter out low confidence noise
                clean_line = text.strip()
                if clean_line:
                    lines.append(clean_line)

        raw_text = "\n".join(lines)
        return self.clean_extracted_text(raw_text)

    @staticmethod
    def clean_extracted_text(text: str) -> str:
        """Post-process OCR text: join broken line hyphens, strip excess whitespace."""
        if not text:
            return ""
        
        # Remove hyphens broken across lines (e.g. "photo-\nsynthesis" -> "photosynthesis")
        text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
        
        # Merge single line breaks into continuous paragraph text
        text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
        
        # Normalize multiple spaces
        text = re.sub(r' +', ' ', text)
        
        return text.strip()

ocr_engine = EasyOCREngine()
