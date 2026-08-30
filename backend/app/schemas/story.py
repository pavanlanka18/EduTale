from typing import Optional
from pydantic import BaseModel, Field


class StudentProfile(BaseModel):
    age: int = Field(..., ge=5, le=18)
    grade: int = Field(..., ge=1, le=12)
    interest: str = Field(..., min_length=2, max_length=50)


class StoryRequest(BaseModel):
    document_id: Optional[str] = None
    topic: Optional[str] = None
    context: Optional[str] = None
    profile: StudentProfile


class StoryResponse(BaseModel):
    story: str
    profile: StudentProfile
    topic: Optional[str] = None
    retrieved_chunks: int = 0
    model_version: str = "edutale-story-v1"


class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    chunk_count: int
