import sys
import os
from typing import Optional
from fastapi import APIRouter, Query, UploadFile, File, Form, BackgroundTasks, status
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse

# Add repository root directory to sys.path so pipeline & models modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))

from app.schemas.lesson import LessonCreateRequest, LessonResponse, LessonListResponse, ContentTypeEnum
from app.schemas.common import SuccessResponse
from app.services.lesson_service import lesson_service
from pipeline.content_pipeline import content_pipeline

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.post("/create", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(request: LessonCreateRequest):
    """Create a new personalized lesson and queue processing pipeline."""
    return lesson_service.create_lesson(request)

@router.post("/upload", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def upload_and_create_lesson(
    file: UploadFile = File(...),
    student_id: str = Form(...),
    title: Optional[str] = Form(None)
):
    """Upload a PDF or textbook image, extract text via EasyOCR in worker thread, and create a lesson."""
    file_bytes = await file.read()
    filename = file.filename or "upload.png"

    # Infer content type
    ext = os.path.splitext(filename)[1].lower()
    if ext in [".png", ".jpg", ".jpeg", ".webp", ".bmp"]:
        content_type = ContentTypeEnum.IMAGE
    elif ext == ".pdf":
        content_type = ContentTypeEnum.PDF
    else:
        content_type = ContentTypeEnum.TEXT

    # Execute CPU/GPU bound OCR extraction in threadpool so main event loop remains non-blocking
    extracted_res = await run_in_threadpool(
        content_pipeline.process_content_input,
        content_data=file_bytes,
        filename=filename,
        content_type=content_type.value
    )

    lesson_title = title or extracted_res["extracted_topic"] or f"Lesson from {filename}"

    create_request = LessonCreateRequest(
        title=lesson_title,
        content=extracted_res["cleaned_content"],
        student_id=student_id,
        content_type=content_type
    )

    return lesson_service.create_lesson(create_request)

@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(lesson_id: str):
    """Fetch status, details, and progress of a specific lesson."""
    return lesson_service.get_lesson(lesson_id)

@router.get("/{lesson_id}/video")
async def get_lesson_video(lesson_id: str):
    """Stream or redirect to the rendered video file for a completed lesson."""
    lesson = lesson_service.get_lesson(lesson_id)
    if not lesson.video_url:
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={
                "message": "Video generation is still in progress.",
                "lesson_id": lesson_id,
                "status": lesson.status
            }
        )
    return {
        "lesson_id": lesson_id,
        "video_url": lesson.video_url,
        "status": "ready"
    }

@router.get("", response_model=LessonListResponse)
async def list_lessons(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """List lessons with pagination."""
    return lesson_service.list_lessons(limit=limit, offset=offset)

@router.delete("/{lesson_id}", response_model=SuccessResponse[dict])
async def delete_lesson(lesson_id: str):
    """Delete a lesson and clear its associated media artifacts."""
    lesson_service.delete_lesson(lesson_id)
    return SuccessResponse(
        message=f"Lesson '{lesson_id}' deleted successfully.",
        data={"lesson_id": lesson_id}
    )
