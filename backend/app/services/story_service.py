from functools import lru_cache
from pathlib import Path
from typing import Optional
import yaml

from models.story_model import create_story_model, StoryModel
from app.schemas.story import StoryRequest, StoryResponse



@lru_cache(maxsize=1)
def get_story_model() -> StoryModel:
    # Resolve config/models.yaml relative to backend/app/services/story_service.py
    # story_service.py -> services -> app -> backend -> repo_root
    service_path = Path(__file__).resolve()
    repo_root = service_path.parent.parent.parent.parent
    config_path = repo_root / "config" / "models.yaml"

    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    return create_story_model(config)


class StoryService:
    def __init__(self, model: StoryModel):
        self.model = model

    def generate(self, request: StoryRequest, context: Optional[str] = None, retrieved_chunks: int = 0) -> StoryResponse:
        story_text = self.model.generate(
            age=request.profile.age,
            grade=request.profile.grade,
            interest=request.profile.interest,
            context=context,
        )
        return StoryResponse(
            story=story_text,
            profile=request.profile,
            topic=request.topic,
            retrieved_chunks=retrieved_chunks,
            model_version="edutale-story-v1",
        )

    def health(self) -> bool:
        return self.model.health()

