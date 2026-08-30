import os
import logging
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger("edutale.models.video")


def build_scene_prompt(visual_description: str, interest: Optional[str] = None) -> str:
    """Construct prompt for LTX Video model."""
    prefix = f"A high quality educational video scene with {interest} theme: " if interest else "A high quality educational video scene: "
    suffix = ", smooth movement, 4k resolution, cinematic lighting"
    return f"{prefix}{visual_description}{suffix}"


class RemoteVideoModel:
    """Client for calling LTX Video standalone server."""

    def __init__(self, endpoint_url: str = "http://localhost:8001"):
        self.endpoint_url = endpoint_url.rstrip("/")

    def generate_clip(
        self,
        prompt: str,
        width: int = 448,
        height: int = 256,
        num_frames: int = 49,
        num_inference_steps: int = 20
    ) -> Dict[str, Any]:
        """Request a video clip from LTX Video generation service, with local video generator fallback."""
        payload = {
            "prompt": prompt,
            "width": width,
            "height": height,
            "num_frames": num_frames,
            "num_inference_steps": num_inference_steps
        }
        url = f"{self.endpoint_url}/clip"
        try:
            resp = requests.post(url, json=payload, timeout=5)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            logger.warning(f"Remote LTX video server at {url} unreachable: {e}. Generating local scene clip.")
            return self._generate_fallback_clip(prompt, width, height, num_frames)

    def _generate_fallback_clip(self, prompt: str, width: int, height: int, num_frames: int) -> Dict[str, Any]:
        import uuid
        import subprocess

        output_dir = os.path.join("data", "video", "clips")
        os.makedirs(output_dir, exist_ok=True)
        clip_id = f"clip_{uuid.uuid4().hex[:8]}.mp4"
        clip_path = os.path.abspath(os.path.join(output_dir, clip_id))

        duration_sec = max(2.0, round(num_frames / 24.0, 2))
        cmd = [
            "ffmpeg", "-y",
            "-f", "lavfi", "-i", f"color=c=indigo:s={width}x{height}:d={duration_sec}",
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            clip_path
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)

        return {
            "clip_path": clip_path,
            "num_frames": num_frames,
            "duration_seconds": duration_sec
        }

    def health(self) -> bool:
        try:
            resp = requests.get(f"{self.endpoint_url}/health", timeout=5)
            return resp.status_code == 200
        except Exception:
            return False
