import logging
import math
import hashlib
from typing import List, Union

logger = logging.getLogger("edutale.rag.embeddings")

class EmbeddingEngine:
    """Generates 384-dimensional dense vector embeddings for text chunks and queries."""

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.vector_dim = 384
        self._model = None

    def _get_model(self):
        """Lazy load sentence transformer model."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading SentenceTransformer model '{self.model_name}'...")
                self._model = SentenceTransformer(self.model_name)
            except Exception as e:
                logger.warning(f"SentenceTransformer model load deferred or uninstalled: {e}")
                self._model = None
        return self._model

    def embed_text(self, text: str) -> List[float]:
        """Generate embedding vector for a single text snippet."""
        return self.embed_batch([text])[0]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate normalized embedding vectors for a list of text snippets."""
        if not texts:
            return []

        model = self._get_model()
        if model is not None:
            try:
                embeddings = model.encode(texts, normalize_embeddings=True)
                return [emb.tolist() for emb in embeddings]
            except Exception as e:
                logger.error(f"SentenceTransformer encoding failed: {e}")

        # Fallback deterministic pseudo-embedding (for offline / lightweight mode)
        logger.info("Using deterministic feature vector fallback for RAG embeddings")
        return [self._fallback_embedding(t) for t in texts]

    def _fallback_embedding(self, text: str) -> List[float]:
        """Deterministic 384-dimensional normalized vector based on character and word n-grams."""
        vector = [0.0] * self.vector_dim
        words = text.lower().split()
        
        for i, word in enumerate(words):
            # Compute hash slot
            hash_val = int(hashlib.md5(word.encode('utf-8')).hexdigest(), 16)
            slot = hash_val % self.vector_dim
            vector[slot] += 1.0 / (i + 1) # Position weighted

        # L2 Normalize
        squared_sum = sum(v * v for v in vector)
        if squared_sum > 0:
            norm = math.sqrt(squared_sum)
            vector = [v / norm for v in vector]
        else:
            vector[0] = 1.0

        return vector

embedding_engine = EmbeddingEngine()
