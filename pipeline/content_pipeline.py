import logging
import re
from typing import Dict, Any, List, Optional
from rag.document_loader import document_loader

logger = logging.getLogger("edutale.pipeline.content")

class ContentExtractionPipeline:
    """Pipeline for extracting, cleaning, and structuring content from uploaded learning material."""

    def process_content_input(
        self,
        content_data: Any,
        filename: str,
        content_type: str = "text"
    ) -> Dict[str, Any]:
        """Extract plain text and identify core concepts from text, image, or PDF files."""
        logger.info(f"Processing content input (filename: '{filename}', type: '{content_type}')")

        if isinstance(content_data, bytes):
            extracted_text = document_loader.load_from_bytes(content_data, filename)
        elif isinstance(content_data, str) and content_type == "text":
            extracted_text = content_data
        elif isinstance(content_data, str) and content_type in ("image", "pdf"):
            extracted_text = document_loader.load_from_file_path(content_data)
        else:
            extracted_text = str(content_data)

        # Topic & key concept extraction heuristic
        topic, key_concepts = self._extract_key_concepts(extracted_text)

        return {
            "raw_content": extracted_text,
            "cleaned_content": extracted_text.strip(),
            "extracted_topic": topic,
            "key_concepts": key_concepts,
            "word_count": len(extracted_text.split()),
            "source_type": content_type,
            "filename": filename
        }

    def _extract_key_concepts(self, text: str) -> tuple[str, List[str]]:
        """Identify main title topic and 3-5 core academic concepts."""
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        topic = lines[0] if lines else "General Learning Topic"

        # Basic key phrase extraction
        words = re.findall(r'\b[A-Za-z]{4,}\b', text)
        concept_candidates = list(dict.fromkeys(words))[:5]
        
        if not concept_candidates:
            concept_candidates = ["Core Principle", "Key Mechanics", "Ecosystem Balance"]

        return topic[:60], concept_candidates

content_pipeline = ContentExtractionPipeline()
