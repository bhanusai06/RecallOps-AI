import time
from fastapi import APIRouter
from app.config.settings import settings

router = APIRouter()

START_TIME = time.time()

@router.get("/health")
def health_check():
    """
    Returns the application's health status, version, environment, and uptime.
    """
    uptime = time.time() - START_TIME
    return {
        "status": "healthy",
        "version": settings.version,
        "environment": settings.app_env,
        "uptime": f"{uptime:.2f}s"
    }
