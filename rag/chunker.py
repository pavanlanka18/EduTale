import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger("edutale.rag.chunker")

class TextChunker:
    """Splits educational text into semantic chunks with sentence preservation and sliding window overlap."""

    def __init__(self, chunk_size: int = 250, chunk_overlap: int = 40):
        self.chunk_size = chunk_size  # target words per chunk
        self.chunk_overlap = chunk_overlap  # overlapping words between consecutive chunks

    def chunk_text(self, text: str, source_id: str = "doc_1") -> List[Dict[str, Any]]:
        """Split text into chunks while preserving complete sentence boundaries."""
        if not text or not text.strip():
            return []

        # Split text into sentences
        sentences = self._split_into_sentences(text)
        
        chunks = []
        current_chunk_sentences = []
        current_word_count = 0
        chunk_idx = 0

        for sentence in sentences:
            sentence_words = len(sentence.split())
            
            if current_word_count + sentence_words > self.chunk_size and current_chunk_sentences:
                # Store current chunk
                chunk_text = " ".join(current_chunk_sentences).strip()
                chunks.append({
                    "chunk_id": f"{source_id}_chunk_{chunk_idx}",
                    "source_id": source_id,
                    "chunk_index": chunk_idx,
                    "text": chunk_text,
                    "word_count": len(chunk_text.split()),
                })
                chunk_idx += 1

                # Calculate overlap sentences
                overlap_sentences = []
                overlap_words = 0
                for prev_sent in reversed(current_chunk_sentences):
                    prev_words = len(prev_sent.split())
                    if overlap_words + prev_words <= self.chunk_overlap:
                        overlap_sentences.insert(0, prev_sent)
                        overlap_words += prev_words
                    else:
                        break
                
                current_chunk_sentences = overlap_sentences
                current_word_count = overlap_words

            current_chunk_sentences.append(sentence)
            current_word_count += sentence_words

        # Add remaining sentences as final chunk
        if current_chunk_sentences:
            chunk_text = " ".join(current_chunk_sentences).strip()
            chunks.append({
                "chunk_id": f"{source_id}_chunk_{chunk_idx}",
                "source_id": source_id,
                "chunk_index": chunk_idx,
                "text": chunk_text,
                "word_count": len(chunk_text.split()),
            })

        logger.info(f"Chunked document '{source_id}' ({len(text.split())} words) into {len(chunks)} chunks.")
        return chunks

    def _split_into_sentences(self, text: str) -> List[str]:
        """Split string into sentences preserving punctuation."""
        sentence_endings = re.compile(r'(?<=[.!?]) +')
        raw_sentences = sentence_endings.split(text.replace('\n', ' '))
        return [s.strip() for s in raw_sentences if s.strip()]

text_chunker = TextChunker()
