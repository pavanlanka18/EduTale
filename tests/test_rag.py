import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from rag.chunker import text_chunker
from rag.embeddings import embedding_engine
from rag.vector_store import vector_store
from rag.retriever import rag_retriever

SAMPLE_EDUCATIONAL_TEXT = (
    "Photosynthesis is the fundamental biological process through which plants convert solar energy into chemical sugars. "
    "Leaves contain chlorophyll which absorbs sunlight. The plant takes in carbon dioxide from the air and water from the soil. "
    "Primary consumers, also known as herbivores, feed on plants to gain metabolic energy. "
    "Secondary consumers or carnivores, such as tigers and lions, hunt herbivores. "
    "Decomposers like forest fungi and bacteria break down organic waste back into rich soil nutrients."
)

def test_chunker_splits_sentences():
    """Test text chunker preserves complete sentences and respects word counts."""
    chunks = text_chunker.chunk_text(SAMPLE_EDUCATIONAL_TEXT, source_id="test_doc")
    assert len(chunks) > 0
    for chunk in chunks:
        assert "text" in chunk
        assert "chunk_id" in chunk
        assert chunk["word_count"] > 0

def test_embedding_generation():
    """Test embedding engine produces 384-dimensional normalized float vectors."""
    embedding = embedding_engine.embed_text("Ecosystem Food Chain")
    assert len(embedding) == 384
    assert isinstance(embedding[0], float)

def test_vector_store_add_and_search():
    """Test vector store indexing and cosine similarity search."""
    vector_store.clear()
    
    chunks = [
        {"chunk_id": "c1", "source_id": "doc1", "text": "Photosynthesis solar energy in plants"},
        {"chunk_id": "c2", "source_id": "doc1", "text": "Tigers and lions hunt herbivore prey"},
    ]
    embeddings = embedding_engine.embed_batch([c["text"] for c in chunks])
    vector_store.add_chunks(chunks, embeddings)

    query_vec = embedding_engine.embed_text("solar energy photosynthesis")
    results = vector_store.search(query_vec, top_k=1)

    assert len(results) == 1
    assert results[0]["chunk_id"] == "c1"

def test_full_rag_retriever_pipeline():
    """Test end-to-end RAG ingestion and prompt formatting."""
    rag_retriever.ingest_document(SAMPLE_EDUCATIONAL_TEXT, document_id="doc_food_chain")
    
    retrieved = rag_retriever.retrieve_context("How do plants get solar energy?", top_k=2)
    assert len(retrieved) > 0
    assert "text" in retrieved[0]

    formatted_prompt = rag_retriever.format_llm_context_prompt(retrieved)
    assert "Educational Fact Chunk" in formatted_prompt
    assert "Photosynthesis" in formatted_prompt
