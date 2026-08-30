import time
import logging
import sys
import os
from datetime import datetime

# Ensure repository root is in python path
repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.database import init_db
from app.core.exceptions import EduTaleException, LessonNotFound, StudentNotFound, InvalidContentType, ProcessingError
from app.schemas.common import ErrorResponse
from app.api.routes import api_router
from backend.app.api.video import router as video_router

# Configure Logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("edutale.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered educational video story generation platform API backend.",
)

@app.on_event("startup")
async def on_startup():
    await init_db()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - Status: {response.status_code} - Duration: {duration:.3f}s")
    return response

# Custom Exception Handlers
@app.exception_handler(LessonNotFound)
async def lesson_not_found_handler(request: Request, exc: LessonNotFound):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=ErrorResponse(
            error="Lesson Not Found",
            detail=exc.detail,
            timestamp=datetime.utcnow()
        ).model_dump(mode="json")
    )

@app.exception_handler(StudentNotFound)
async def student_not_found_handler(request: Request, exc: StudentNotFound):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=ErrorResponse(
            error="Student Not Found",
            detail=exc.detail,
            timestamp=datetime.utcnow()
        ).model_dump(mode="json")
    )

@app.exception_handler(InvalidContentType)
async def invalid_content_type_handler(request: Request, exc: InvalidContentType):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ErrorResponse(
            error="Invalid Content Type",
            detail=exc.detail,
            timestamp=datetime.utcnow()
        ).model_dump(mode="json")
    )

@app.exception_handler(ProcessingError)
async def processing_error_handler(request: Request, exc: ProcessingError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error="Pipeline Processing Error",
            detail=exc.detail,
            timestamp=datetime.utcnow()
        ).model_dump(mode="json")
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error="Validation Error",
            detail=str(exc),
            timestamp=datetime.utcnow()
        ).model_dump(mode="json")
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error="Internal Server Error",
            detail="An unexpected error occurred on the server.",
            timestamp=datetime.utcnow()
        ).model_dump(mode="json")
    )

# Root Endpoint
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to EduTale AI Backend Core Service",
        "docs": "/docs",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

# Include API Router
app.include_router(api_router, prefix="/api/v1")
app.include_router(video_router, prefix="/api")
