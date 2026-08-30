import os
import subprocess
import logging
from typing import List, Dict, Any, Optional

from backend.app.services.video_service import get_video_model

logger = logging.getLogger("edutale.pipeline.video_assembly")


class VideoAssemblyPipeline:
    """Pipeline for generating LTX video clips per scene and assembling final concatenated MP4 video with narration audio."""

    def __init__(self, max_scenes_with_video: int = 2):
        self.max_scenes_with_video = max_scenes_with_video

    def generate_and_assemble_lesson_video(self, scenes: List[Dict[str, Any]], lesson_id: str) -> str:
        output_dir = os.path.join("data", "video")
        os.makedirs(output_dir, exist_ok=True)
        final_mp4 = os.path.abspath(os.path.join(output_dir, f"{lesson_id}_assembled.mp4"))

        video_model = get_video_model()
        video_available = video_model.health()

        scene_video_paths = []
        concat_list_path = os.path.join(output_dir, f"{lesson_id}_concat.txt")

        for idx, scene in enumerate(scenes):
            scene_id = f"{lesson_id}_scene_{idx + 1}"
            narration_audio = scene.get("audioPath")
            visual_desc = scene.get("visualDescription") or scene.get("narration") or "Educational lesson"

            # Check if this scene is within video generation cap
            video_clip_path = None
            if idx < self.max_scenes_with_video and video_available:
                try:
                    logger.info(f"Generating LTX video clip for Scene {idx + 1}/{len(scenes)}")
                    res = video_model.generate_clip(visual_desc)
                    video_clip_path = res.get("clip_path")
                except Exception as e:
                    logger.warning(f"Video clip generation failed for scene {idx + 1}: {e}")

            # Merge audio with video clip using ffmpeg if both exist
            scene_mp4 = os.path.abspath(os.path.join(output_dir, f"{scene_id}.mp4"))

            if video_clip_path and os.path.exists(video_clip_path) and narration_audio and os.path.exists(narration_audio):
                cmd = [
                    "ffmpeg", "-y",
                    "-stream_loop", "-1", "-i", video_clip_path,
                    "-i", narration_audio,
                    "-c:v", "libx264", "-c:a", "aac",
                    "-shortest",
                    scene_mp4
                ]
                subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
            elif narration_audio and os.path.exists(narration_audio):
                # Fallback: black screen with narration audio if video clip not available
                cmd = [
                    "ffmpeg", "-y",
                    "-f", "lavfi", "-i", "color=c=black:s=448x256:d=5",
                    "-i", narration_audio,
                    "-c:v", "libx264", "-c:a", "aac",
                    "-shortest",
                    scene_mp4
                ]
                subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)

            if os.path.exists(scene_mp4):
                scene_video_paths.append(scene_mp4)

        if scene_video_paths:
            with open(concat_list_path, "w", encoding="utf-8") as f:
                for path in scene_video_paths:
                    escaped = path.replace("\\", "/")
                    f.write(f"file '{escaped}'\n")

            concat_cmd = [
                "ffmpeg", "-y",
                "-f", "concat", "-safe", "0",
                "-i", concat_list_path,
                "-c", "copy",
                final_mp4
            ]
            subprocess.run(concat_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)

        if not os.path.exists(final_mp4):
            # Create minimal valid MP4 output if concat failed
            dummy_cmd = [
                "ffmpeg", "-y",
                "-f", "lavfi", "-i", "color=c=black:s=448x256:d=3",
                "-c:v", "libx264",
                final_mp4
            ]
            subprocess.run(dummy_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)

        return final_mp4


video_assembly = VideoAssemblyPipeline()
