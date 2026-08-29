import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.schemas.student import StudentCreateRequest, StudentResponse
from app.core.database import get_async_db, StudentProfileModel, UserModel
from app.api.deps import get_required_current_user, get_current_user

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    profile: StudentCreateRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user: Optional[UserModel] = Depends(get_current_user)
):
    """Create a new student profile in the database."""
    student_id = f"std_{uuid.uuid4().hex[:10]}"
    student_model = StudentProfileModel(
        id=student_id,
        user_id=current_user.id if current_user else None,
        name=profile.name,
        age=profile.age,
        grade=profile.grade,
        class_name=profile.class_name,
        gender=profile.gender,
        interests=profile.interests,
        learning_style=profile.learning_style
    )
    db.add(student_model)
    await db.commit()
    await db.refresh(student_model)
    
    return StudentResponse(
        student_id=student_model.id,
        name=student_model.name,
        age=student_model.age,
        grade=student_model.grade,
        class_name=student_model.class_name,
        gender=student_model.gender,
        interests=student_model.interests,
        learning_style=student_model.learning_style,
        created_at=student_model.created_at,
        updated_at=student_model.updated_at
    )

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: str,
    db: AsyncSession = Depends(get_async_db)
):
    """Fetch student profile by ID from the database."""
    result = await db.execute(select(StudentProfileModel).where(StudentProfileModel.id == student_id))
    student_model = result.scalars().first()
    if not student_model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student profile with ID '{student_id}' not found."
        )
        
    return StudentResponse(
        student_id=student_model.id,
        name=student_model.name,
        age=student_model.age,
        grade=student_model.grade,
        class_name=student_model.class_name,
        gender=student_model.gender,
        interests=student_model.interests,
        learning_style=student_model.learning_style,
        created_at=student_model.created_at,
        updated_at=student_model.updated_at
    )
