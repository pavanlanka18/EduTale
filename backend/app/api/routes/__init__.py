from fastapi import APIRouter
from app.api.routes import health, students, lessons, auth, story, documents

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(students.router)
api_router.include_router(lessons.router)
api_router.include_router(story.router)
api_router.include_router(documents.router)



