import logging
from typing import Dict, Any, Optional

from pipeline.content_pipeline import content_pipeline
from pipeline.story_pipeline import story_pipeline
from pipeline.scene_pipeline import scene_pipeline
from pipeline.media_pipeline import media_pipeline
from rag.retriever import rag_retriever

logger = logging.getLogger("edutale.pipeline.lesson")

class EndToEndLessonPipeline:
    """Master orchestrator connecting Content Extraction -> RAG -> Story LLM -> Scene Planning -> TTS -> Video Assembly."""

    def execute_full_lesson_pipeline(
        self,
        lesson_id: str,
        title: str,
        content: str,
        student_profile: Dict[str, Any],
        content_type: str = "text"
    ) -> Dict[str, Any]:
        """Run complete EduTale lesson generation workflow."""
        logger.info(f"Starting End-to-End EduTale Lesson Pipeline for '{title}' (Lesson ID: '{lesson_id}')")

        # Step 1: Content Extraction & OCR
        extracted = content_pipeline.process_content_input(
            content_data=content,
            filename=f"{lesson_id}.txt",
            content_type=content_type
        )
        cleaned_text = extracted["cleaned_content"]
        topic = title or extracted["extracted_topic"]

        # Step 2: RAG Ingestion & Vector Indexing
        rag_res = rag_retriever.ingest_document(cleaned_text, document_id=lesson_id)
        logger.info(f"RAG Ingestion result: {rag_res}")

        # Step 3: Personalized Story Synthesis
        story_data = story_pipeline.generate_personalized_story(
            topic=topic,
            student_profile=student_profile,
            document_id=lesson_id
        )

        # Step 4: Scene Decomposition
        decomposed_scenes = scene_pipeline.decompose_into_scenes(story_data)

        # Step 5: Per-scene TTS Audio & Visual Synchronization
        synced_scenes = media_pipeline.process_scene_media(decomposed_scenes, lesson_id=lesson_id)
        story_data["scenes"] = synced_scenes

        # Step 6: Final Video Assembly
        video_url = media_pipeline.assemble_final_video(synced_scenes, lesson_id=lesson_id)

        logger.info(f"End-to-End EduTale Lesson Pipeline finished successfully for '{lesson_id}'!")

        return {
            "lesson_id": lesson_id,
            "title": story_data["title"],
            "story": story_data,
            "video_url": video_url,
            "total_scenes": len(synced_scenes)
        }

lesson_pipeline = EndToEndLessonPipeline()
