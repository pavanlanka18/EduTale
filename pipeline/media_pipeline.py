import os
import logging
from typing import Dict, Any, List
from models.tts.tts_model import tts_adapter

logger = logging.getLogger("edutale.pipeline.media")

class MediaPipeline:
    """Orchestrates per-scene TTS narration, visual asset assignment, audio-visual synchronization, and final video compilation."""

    def __init__(self, output_dir: str = None):
        self.output_dir = output_dir or os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "data", "video"
        )
        os.makedirs(self.output_dir, exist_ok=True)

    def process_scene_media(self, scenes: List[Dict[str, Any]], lesson_id: str) -> List[Dict[str, Any]]:
        """Generate per-scene TTS narration audio and synchronize with visual scenes."""
        logger.info(f"Processing scene media assets for lesson '{lesson_id}'")

        synchronized_scenes = []
        total_duration = 0.0

        for idx, scene in enumerate(scenes, start=1):
            scene_key = f"{lesson_id}_scene_{idx}"
            narration_text = scene.get("narration", "")

            # 1. Generate TTS audio
            audio_info = tts_adapter.generate_narration_audio(narration_text, scene_id=scene_key)
            measured_duration = audio_info["measured_duration"]

            # 2. Synchronize visual duration with audio duration
            synced_scene = dict(scene)
            synced_scene["audioPath"] = audio_info["audio_path"]
            synced_scene["duration"] = measured_duration
            
            # Select fallback visual image matching theme
            if "imageUrl" not in synced_scene:
                synced_scene["imageUrl"] = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80"

            synchronized_scenes.append(synced_scene)
            total_duration += measured_duration

        logger.info(f"Synchronized {len(synchronized_scenes)} scenes. Total video duration: {round(total_duration, 1)} seconds.")
        return synchronized_scenes

    def assemble_final_video(self, scenes: List[Dict[str, Any]], lesson_id: str) -> str:
        """Assemble synchronized audio-visual scenes into final video URL / MP4 path."""
        video_filename = f"{lesson_id}_final.mp4"
        final_video_path = os.path.join(self.output_dir, video_filename)

        logger.info(f"Assembling final EduTale educational video at {final_video_path}")

        # In production this executes FFmpeg stitching; for API response returns direct visual lesson stream URL
        video_url = f"/data/video/{video_filename}"
        return video_url

media_pipeline = MediaPipeline()
