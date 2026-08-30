import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from app.core.config import settings
from app.core.exceptions import LessonNotFound, StudentNotFound

Base = declarative_base()

# SQLAlchemy ORM Models
class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    students = relationship("StudentProfileModel", back_populates="user", cascade="all, delete-orphan")
    lessons = relationship("LessonModel", back_populates="user", cascade="all, delete-orphan")

class StudentProfileModel(Base):
    __tablename__ = "student_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    grade = Column(Integer, nullable=False)
    class_name = Column(String, nullable=True) # e.g., "5A", "Science-101"
    gender = Column(String, nullable=True) # e.g., "male", "female", "other"
    interests = Column(JSON, nullable=False) # List[str]
    learning_style = Column(String, default="visual")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("UserModel", back_populates="students")
    lessons = relationship("LessonModel", back_populates="student")

class LessonModel(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    student_id = Column(String, ForeignKey("student_profiles.id"), nullable=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String, nullable=False, default="text")
    status = Column(String, nullable=False, default="created")
    progress = Column(JSON, nullable=False)
    video_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("UserModel", back_populates="lessons")
    student = relationship("StudentProfileModel", back_populates="lessons")

class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    chunk_count = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Database Engine
os.makedirs(settings.DATA_DIR, exist_ok=True)
engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    """Create database tables on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_async_db():
    """Dependency for delivering async database sessions."""
    async with AsyncSessionLocal() as session:
        yield session

# Memory Store Fallback Compatibility Wrapper
class Database:
    """Thread-safe state repository providing sync/async access for EduTale."""

    def __init__(self):
        self._lessons: Dict[str, Dict[str, Any]] = {}
        self._students: Dict[str, Dict[str, Any]] = {}
        self._documents: Dict[str, Dict[str, Any]] = {}
        
        # Seed initial sample student
        self._students["student-sample-1"] = {
            "id": "student-sample-1",
            "name": "Alex",
            "age": 10,
            "grade": 5,
            "class_name": "5A",
            "gender": "male",
            "interests": ["animals", "space"],
            "learning_style": "visual",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

    # Student Operations
    def create_student(self, student_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        data["id"] = student_id
        now = datetime.utcnow()
        data["created_at"] = now
        data["updated_at"] = now
        if "class_name" not in data:
            data["class_name"] = None
        if "gender" not in data:
            data["gender"] = None
        self._students[student_id] = data
        return data

    def get_student(self, student_id: str) -> Dict[str, Any]:
        if student_id not in self._students:
            raise StudentNotFound(student_id)
        return self._students[student_id]

    def update_student(self, student_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        student = self.get_student(student_id)
        student.update(updates)
        student["updated_at"] = datetime.utcnow().isoformat()
        self._students[student_id] = student
        return student

    # Lesson Operations
    def create_lesson(self, lesson_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        data["lesson_id"] = lesson_id
        now = datetime.utcnow()
        data["created_at"] = now
        data["updated_at"] = now
        self._lessons[lesson_id] = data
        return data

    def get_lesson(self, lesson_id: str) -> Dict[str, Any]:
        if lesson_id not in self._lessons:
            raise LessonNotFound(lesson_id)
        return self._lessons[lesson_id]

    def list_lessons(self, limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
        all_items = list(self._lessons.values())
        return all_items[offset : offset + limit]

    def update_lesson(self, lesson_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        lesson = self.get_lesson(lesson_id)
        lesson.update(updates)
        lesson["updated_at"] = datetime.utcnow()
        self._lessons[lesson_id] = lesson
        return lesson

    def delete_lesson(self, lesson_id: str) -> bool:
        if lesson_id not in self._lessons:
            raise LessonNotFound(lesson_id)
        del self._lessons[lesson_id]
        return True

    # Document Operations
    def create_document(self, document_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        data["document_id"] = document_id
        now = datetime.utcnow()
        data["created_at"] = now
        self._documents[document_id] = data
        return data

    def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        return self._documents.get(document_id)

db = Database()
