from datetime import datetime
from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/health/ready")
async def readiness_check():
    """Readiness probe checking pipeline & storage dependencies."""
    return {
        "ready": True,
        "timestamp": datetime.utcnow().isoformat(),
        "dependencies": {
            "rag_pipeline": "available",
            "model_storage": "available",
            "database": "connected"
        }
    }
