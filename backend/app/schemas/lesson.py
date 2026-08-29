from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.student import StudentProfile

class ContentTypeEnum(str, Enum):
    TEXT = "text"
    PDF = "pdf"
    IMAGE = "image"

class LessonStatusEnum(str, Enum):
    CREATED = "created"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class LessonCreateRequest(BaseModel):
    """Payload for creating a new educational lesson."""
    title: str = Field(..., example="Ecosystem Food Chains")
    content: str = Field(..., example="Plants convert solar energy via photosynthesis. Herbivores eat plants.")
    student_id: str = Field(..., example="student-sample-1")
    content_type: ContentTypeEnum = Field(default=ContentTypeEnum.TEXT)
    student_profile_override: Optional[StudentProfile] = None

class LessonResponse(BaseModel):
    """Full detail response for a lesson."""
    lesson_id: str = Field(..., example="les_987654321")
    title: str
    student_id: str
    content_type: ContentTypeEnum
    status: LessonStatusEnum
    progress: Dict[str, Any] = Field(
        default_factory=lambda: {
            "stage": "created",
            "percent": 0,
            "details": "Job queued for AI processing"
        }
    )
    video_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class LessonListResponse(BaseModel):
    """Paginated list of lessons."""
    items: List[LessonResponse]
    total: int
    limit: int
    offset: int
