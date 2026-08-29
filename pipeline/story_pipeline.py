import logging
from typing import Dict, Any
from models.llm.story_model import story_llm
from rag.retriever import rag_retriever

logger = logging.getLogger("edutale.pipeline.story")

class StoryPipeline:
    """Pipeline orchestrating RAG context retrieval and LLM story generation."""

    def generate_personalized_story(
        self,
        topic: str,
        student_profile: Dict[str, Any],
        document_id: str = "doc_1"
    ) -> Dict[str, Any]:
        """Query RAG for facts and synthesize personalized story script."""
        logger.info(f"Orchestrating story pipeline for topic '{topic}'")

        # 1. Retrieve RAG Context
        retrieved_chunks = rag_retriever.retrieve_context(topic, top_k=3, document_id=document_id)
        formatted_context = rag_retriever.format_llm_context_prompt(retrieved_chunks)

        # 2. Generate Story using LLM adapter
        story_data = story_llm.generate_story(
            rag_context=formatted_context,
            student_profile=student_profile,
            topic=topic
        )

        return story_data

story_pipeline = StoryPipeline()
