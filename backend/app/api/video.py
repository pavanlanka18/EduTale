from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional

from backend.app.services.video_service import get_video_model, video_service
from models.video_model import build_scene_prompt

router = APIRouter(prefix="/video", tags=["Video"])


class VideoClipApiRequest(BaseModel):
    visual_description: str = Field(..., description="Visual scene description for clip generation")
    interest: Optional[str] = Field(None, description="Learner interest theme")


class VideoClipApiResponse(BaseModel):
    clip_path: str
    duration_seconds: float


@router.get("/health")
def video_health():
    model = get_video_model()
    is_healthy = model.health()
    if is_healthy:
        return {"status": "available", "service": "video_model"}
    return {"status": "unavailable", "service": "video_model"}


@router.post("/clip", response_model=VideoClipApiResponse)
def create_video_clip(req: VideoClipApiRequest):
    model = get_video_model()
    prompt = build_scene_prompt(req.visual_description, req.interest)
    try:
        res = model.generate_clip(prompt)
        return VideoClipApiResponse(
            clip_path=res["clip_path"],
            duration_seconds=res.get("duration_seconds", 2.0)
        )
    except Exception as e:
        import logging
        logging.getLogger("edutale.video.api").error(f"Error in create_video_clip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Video generation service unavailable: {e}"
        )
