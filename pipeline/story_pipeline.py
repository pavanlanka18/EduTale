import logging
import re
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

        retrieved_chunks = rag_retriever.retrieve_context(topic, top_k=3, document_id=document_id)
        formatted_context = rag_retriever.format_llm_context_prompt(retrieved_chunks)

        story_data = story_llm.generate_story(
            rag_context=formatted_context,
            student_profile=student_profile,
            topic=topic
        )

        return story_data


def prose_to_scenes(story_text: str, target_scenes: int = 4) -> Dict[str, Any]:
    """Split plain prose into the scene structure ScenePipeline expects.

    The fine-tuned story model emits prose with no scene markers, but
    ScenePipeline.decompose_into_scenes reads story_data["scenes"].
    This bridges the two.
    """
    paras = [p.strip() for p in story_text.split("\n\n") if p.strip()]

    if len(paras) < target_scenes:
        sents = re.split(r'(?<=[.!?])\s+', story_text)
        sents = [s for s in sents if s.strip()]
        per = max(1, len(sents) // target_scenes)
        paras = [" ".join(sents[i:i + per]) for i in range(0, len(sents), per)]

    paras = [p for p in paras if p][:target_scenes]

    return {
        "title": story_text.split("\n")[0][:60],
        "scenes": [
            {
                "title": f"Scene {i}",
                "narration": p,
                "visualDescription": p,
                "conceptsHighlighted": [],
            }
            for i, p in enumerate(paras, start=1)
        ],
    }


story_pipeline = StoryPipeline()