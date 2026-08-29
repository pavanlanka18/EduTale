import uuid
from typing import Dict, Any
from app.core.database import db
from app.schemas.student import StudentCreateRequest, StudentResponse, StudentProfile

class StudentService:
    """Service handling student profile business logic."""

    def create_student(self, request: StudentCreateRequest) -> StudentResponse:
        student_id = f"std_{uuid.uuid4().hex[:10]}"
        data = request.model_dump()
        stored = db.create_student(student_id, data)
        return StudentResponse(student_id=stored["id"], **stored)

    def get_student(self, student_id: str) -> StudentResponse:
        stored = db.get_student(student_id)
        return StudentResponse(student_id=stored["id"], **stored)

    def update_student(self, student_id: str, updates: Dict[str, Any]) -> StudentResponse:
        stored = db.update_student(student_id, updates)
        return StudentResponse(student_id=stored["id"], **stored)

student_service = StudentService()
