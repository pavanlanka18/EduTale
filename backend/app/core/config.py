import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application Settings loaded from environment variables."""
    PROJECT_NAME: str = "EduTale Backend"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # CORS Origins
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    # JWT Authentication
    JWT_SECRET: str = "edutale_super_secret_jwt_key_change_in_production_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 Days

    # API Keys
    OPENAI_API_KEY: str = ""
    HF_API_KEY: str = ""
    
    # Storage & Model settings
    DATA_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
    DATABASE_URL: str = f"sqlite+aiosqlite:///{os.path.join(DATA_DIR, 'edutale.db')}"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
