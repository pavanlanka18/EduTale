from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class StudentProfile(BaseModel):
    """Student profile attributes."""
    name: str = Field(..., example="Alex")
    age: int = Field(..., ge=4, le=18, example=10)
    grade: int = Field(..., ge=1, le=12, example=5)
    class_name: Optional[str] = Field(None, example="5A")
    gender: Optional[str] = Field(None, example="male")
    interests: List[str] = Field(default_factory=list, example=["animals", "space"])
    learning_style: str = Field(default="visual", example="visual")

class StudentCreateRequest(StudentProfile):
    """Request payload for creating a student profile."""
    pass

class StudentResponse(StudentProfile):
    """Response payload for a student profile."""
    student_id: str = Field(..., example="std_123456789")
    created_at: datetime
    updated_at: datetime
