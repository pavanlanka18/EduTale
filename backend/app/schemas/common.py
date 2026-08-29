from datetime import datetime
from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, Field

T = TypeVar("T")

class ErrorResponse(BaseModel):
    """Standard error response payload."""
    error: str = Field(..., description="Short error summary")
    detail: str = Field(..., description="Detailed error explanation")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SuccessResponse(BaseModel, Generic[T]):
    """Generic success response wrapper."""
    message: str = Field(..., description="Success message")
    data: Optional[T] = Field(None, description="Payload data")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
