import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_async_db, UserModel
from app.core.security import verify_password, get_password_hash, create_access_token
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, GoogleAuthRequest, TokenResponse, UserResponse
from app.api.deps import get_required_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserRegisterRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """Register a new user account."""
    # Check if user with email exists
    result = await db.execute(select(UserModel).where(UserModel.email == user_in.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )
    
    user_id = f"user-{uuid.uuid4().hex[:8]}"
    hashed_pwd = get_password_hash(user_in.password)
    
    user = UserModel(
        id=user_id,
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=TokenResponse)
async def login(
    user_in: UserLoginRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """Authenticate user and return JWT bearer token."""
    result = await db.execute(select(UserModel).where(UserModel.email == user_in.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account."
        )
    
    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.post("/google", response_model=TokenResponse)
async def google_auth(
    google_in: GoogleAuthRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """Authenticate or auto-register user via Google OAuth2 token/credentials."""
    result = await db.execute(select(UserModel).where(UserModel.email == google_in.email))
    user = result.scalars().first()

    if not user:
        user_id = f"user-google-{uuid.uuid4().hex[:8]}"
        hashed_pwd = get_password_hash(f"google_oauth_{uuid.uuid4().hex}")
        user = UserModel(
            id=user_id,
            email=google_in.email,
            hashed_password=hashed_pwd,
            full_name=google_in.full_name or google_in.email.split("@")[0]
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account."
        )

    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: UserModel = Depends(get_required_current_user)
):
    """Fetch profile details for current authenticated user."""
    return current_user
