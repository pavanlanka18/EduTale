import logging
from typing import Dict, Any, Optional

from pipeline.content_pipeline import content_pipeline
from pipeline.story_pipeline import story_pipeline, prose_to_scenes
from pipeline.scene_pipeline import scene_pipeline
from pipeline.media_pipeline import media_pipeline
from pipeline.video_assembly import video_assembly
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

        # Wire prose_to_scenes: if scenes key is missing or empty, convert prose first
        if not (isinstance(story_data, dict) and story_data.get("scenes") and len(story_data["scenes"]) > 0):
            prose_text = ""
            if isinstance(story_data, str):
                prose_text = story_data
            elif isinstance(story_data, dict):
                prose_text = story_data.get("story") or str(story_data)

            converted = prose_to_scenes(prose_text, target_scenes=4)
            if isinstance(story_data, dict):
                story_data["scenes"] = converted["scenes"]
                if not story_data.get("title"):
                    story_data["title"] = converted["title"]
            else:
                story_data = converted

        # Step 4: Scene Decomposition
        decomposed_scenes = scene_pipeline.decompose_into_scenes(story_data)

        # Step 5: Per-scene TTS Audio & Visual Synchronization
        synced_scenes = media_pipeline.process_scene_media(decomposed_scenes, lesson_id=lesson_id)
        story_data["scenes"] = synced_scenes

        # Step 6: Final Video Assembly
        final_mp4_path = video_assembly.generate_and_assemble_lesson_video(synced_scenes, lesson_id=lesson_id)
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
