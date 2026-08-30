import os
import yaml
from functools import lru_cache
from pathlib import Path
from typing import Optional

from models.video_model import RemoteVideoModel


@lru_cache(maxsize=1)
def get_video_model() -> RemoteVideoModel:
    service_path = Path(__file__).resolve()
    repo_root = service_path.parent.parent.parent.parent
    config_path = repo_root / "config" / "models.yaml"

    endpoint_url = "http://localhost:8001"
    if config_path.exists():
        with open(config_path, "r", encoding="utf-8") as f:
            config = yaml.safe_load(f)
            video_config = config.get("video_model", {})
            endpoint_url = os.getenv("VIDEO_MODEL_URL") or video_config.get("endpoint_url") or "http://localhost:8001"

    if not endpoint_url or endpoint_url.startswith("${"):
        endpoint_url = "http://localhost:8001"

    return RemoteVideoModel(endpoint_url=endpoint_url)


class VideoService:
    def __init__(self, model: Optional[RemoteVideoModel] = None):
        self.model = model or get_video_model()

    def generate_scene_clip(self, visual_description: str, interest: Optional[str] = None) -> str:
        prompt = f"Educational visual scene ({interest}): {visual_description}" if interest else visual_description
        res = self.model.generate_clip(prompt=prompt)
        return res["clip_path"]

    def health(self) -> bool:
        return self.model.health()


video_service = VideoService()
