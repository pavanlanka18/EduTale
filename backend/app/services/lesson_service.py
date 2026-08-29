import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.core.database import db
from app.core.exceptions import LessonNotFound, InvalidContentType
from app.schemas.lesson import (
    LessonCreateRequest,
    LessonResponse,
    LessonStatusEnum,
    ContentTypeEnum,
    LessonListResponse,
)
from app.services.student_service import student_service

logger = logging.getLogger("edutale.lesson_service")

class LessonService:
    """Business logic for educational lesson workflows."""

    def create_lesson(self, request: LessonCreateRequest) -> LessonResponse:
        logger.info(f"Creating lesson '{request.title}' for student '{request.student_id}'")

        # Validate content type
        if request.content_type not in ContentTypeEnum:
            raise InvalidContentType(str(request.content_type))

        # Ensure student exists or override
        try:
            student_service.get_student(request.student_id)
        except Exception:
            if request.student_profile_override:
                logger.info(f"Student profile override supplied for {request.student_id}")
            else:
                logger.warning(f"Student {request.student_id} not pre-registered; proceeding with default fallback.")

        lesson_id = f"les_{uuid.uuid4().hex[:10]}"
        now = datetime.utcnow()

        initial_data = {
            "lesson_id": lesson_id,
            "title": request.title,
            "content": request.content,
            "student_id": request.student_id,
            "content_type": request.content_type,
            "status": LessonStatusEnum.CREATED,
            "progress": {
                "stage": "created",
                "percent": 10,
                "details": "Lesson created and queued for processing"
            },
            "video_url": None,
            "created_at": now,
            "updated_at": now,
        }

        stored = db.create_lesson(lesson_id, initial_data)

        # Execute End-to-End Lesson Pipeline
        try:
            from pipeline.lesson_pipeline import lesson_pipeline
            student_profile_dict = {"age": 10, "grade": "Grade 5", "interests": ["animals"]}
            try:
                student = student_service.get_student(request.student_id)
                student_profile_dict = student.model_dump()
            except Exception:
                if request.student_profile_override:
                    student_profile_dict = request.student_profile_override.model_dump()

            result = lesson_pipeline.execute_full_lesson_pipeline(
                lesson_id=lesson_id,
                title=request.title,
                content=request.content,
                student_profile=student_profile_dict,
                content_type=request.content_type.value
            )

            self.update_lesson_status(
                lesson_id=lesson_id,
                status=LessonStatusEnum.COMPLETED,
                progress={
                    "stage": "completed",
                    "percent": 100,
                    "details": "Educational story & visual lesson generation completed!"
                },
                video_url=result["video_url"]
            )
        except Exception as e:
            logger.error(f"Lesson pipeline execution failed for '{lesson_id}': {e}")
            self.update_lesson_status(
                lesson_id=lesson_id,
                status=LessonStatusEnum.FAILED,
                progress={"stage": "failed", "percent": 0, "details": str(e)}
            )

        return LessonResponse(**stored)

    def get_lesson(self, lesson_id: str) -> LessonResponse:
        stored = db.get_lesson(lesson_id)
        return LessonResponse(**stored)

    def update_lesson_status(
        self,
        lesson_id: str,
        status: LessonStatusEnum,
        progress: Dict[str, Any],
        video_url: Optional[str] = None
    ) -> LessonResponse:
        updates = {"status": status, "progress": progress}
        if video_url:
            updates["video_url"] = video_url

        stored = db.update_lesson(lesson_id, updates)
        return LessonResponse(**stored)

    def list_lessons(self, limit: int = 20, offset: int = 0) -> LessonListResponse:
        stored_items = db.list_lessons(limit=limit, offset=offset)
        items = [LessonResponse(**item) for item in stored_items]
        return LessonListResponse(
            items=items,
            total=len(stored_items),
            limit=limit,
            offset=offset
        )

    def delete_lesson(self, lesson_id: str) -> bool:
        logger.info(f"Deleting lesson '{lesson_id}' and associated artifacts")
        return db.delete_lesson(lesson_id)

    def _simulate_pipeline_trigger(self, lesson_id: str):
        """Simulate async task dispatch for hackathon MVP."""
        logger.info(f"Triggered background AI pipeline for lesson '{lesson_id}'")
        self.update_lesson_status(
            lesson_id=lesson_id,
            status=LessonStatusEnum.PROCESSING,
            progress={
                "stage": "rag_story_synthesis",
                "percent": 45,
                "details": "Generating age-appropriate story script & visual prompts"
            }
        )

lesson_service = LessonService()
