from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.incidents import router as incidents_router

api_router = APIRouter()

# Include feature routers here
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(incidents_router, prefix="/incidents", tags=["Incidents"])
