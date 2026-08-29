import logging
import math
from typing import List, Dict, Any, Optional

logger = logging.getLogger("edutale.rag.vector_store")

class VectorStore:
    """In-memory vector store calculating exact cosine similarity for Top-K semantic retrieval."""

    def __init__(self):
        self._chunks: Dict[str, Dict[str, Any]] = {}
        self._vectors: Dict[str, List[float]] = {}

    def add_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]) -> int:
        """Store chunk records alongside their vector embeddings."""
        if len(chunks) != len(embeddings):
            raise ValueError("Number of chunks and embeddings must match.")

        added_count = 0
        for chunk, vector in zip(chunks, embeddings):
            chunk_id = chunk["chunk_id"]
            self._chunks[chunk_id] = chunk
            self._vectors[chunk_id] = vector
            added_count += 1

        logger.info(f"Added {added_count} chunk embeddings to vector store. Total index size: {len(self._chunks)}")
        return added_count

    def search(
        self,
        query_vector: List[float],
        top_k: int = 3,
        source_id_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Find the Top-K most semantically relevant text chunks based on cosine similarity."""
        if not self._chunks:
            return []

        results = []
        for chunk_id, vector in self._vectors.items():
            chunk = self._chunks[chunk_id]

            if source_id_filter and chunk.get("source_id") != source_id_filter:
                continue

            similarity = self._cosine_similarity(query_vector, vector)
            
            result_item = dict(chunk)
            result_item["similarity_score"] = round(similarity, 4)
            results.append(result_item)

        # Sort descending by similarity score
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_k]

    def clear(self):
        """Clear all stored vectors and payload data."""
        self._chunks.clear()
        self._vectors.clear()

    @staticmethod
    def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Compute dot product cosine similarity between two normalized vectors."""
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot_product / (norm1 * norm2)

vector_store = VectorStore()
