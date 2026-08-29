import logging
from typing import List, Dict, Any, Optional

from rag.chunker import text_chunker
from rag.embeddings import embedding_engine
from rag.vector_store import vector_store

logger = logging.getLogger("edutale.rag.retriever")

class RAGRetriever:
    """End-to-end RAG Retriever managing document ingestion, vector indexing, and topic context retrieval."""

    def ingest_document(self, text: str, document_id: str = "doc_1") -> Dict[str, Any]:
        """Chunk text, generate embeddings, and index into the vector store."""
        logger.info(f"Ingesting document '{document_id}' into RAG pipeline...")
        
        # 1. Chunk document
        chunks = text_chunker.chunk_text(text, source_id=document_id)
        if not chunks:
            return {"status": "empty", "chunks_indexed": 0}

        # 2. Embed chunk texts
        chunk_texts = [c["text"] for c in chunks]
        embeddings = embedding_engine.embed_batch(chunk_texts)

        # 3. Add to vector store
        indexed_count = vector_store.add_chunks(chunks, embeddings)

        return {
            "status": "success",
            "document_id": document_id,
            "chunks_indexed": indexed_count,
            "total_words": len(text.split())
        }

    def retrieve_context(
        self,
        query: str,
        top_k: int = 3,
        document_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Query vector store for the top-k most semantically relevant educational chunks."""
        logger.info(f"Retrieving top {top_k} contexts for query: '{query}'")
        
        # Embed query string
        query_vector = embedding_engine.embed_text(query)

        # Retrieve matching chunks
        results = vector_store.search(
            query_vector=query_vector,
            top_k=top_k,
            source_id_filter=document_id
        )

        return results

    def format_llm_context_prompt(self, relevant_chunks: List[Dict[str, Any]]) -> str:
        """Format retrieved context chunks into a clean prompt block for LLM story synthesis."""
        if not relevant_chunks:
            return "No specific document context retrieved."

        formatted_blocks = []
        for idx, chunk in enumerate(relevant_chunks, start=1):
            formatted_blocks.append(
                f"--- Educational Fact Chunk {idx} (Score: {chunk.get('similarity_score', 0)}) ---\n"
                f"{chunk['text']}\n"
            )

        return "\n".join(formatted_blocks)

rag_retriever = RAGRetriever()
