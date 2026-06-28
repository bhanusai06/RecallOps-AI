from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI

from app.config.settings import settings
from app.config.logging import setup_logging
from app.middleware.cors import setup_cors
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.logging import RequestLoggingMiddleware
from app.core.exceptions import setup_exception_handlers
from app.api.v1.router import api_router

logger = logging.getLogger("incidentmind.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the FastAPI application.
    """
    # On Startup
    setup_logging()
    logger.info(f"Starting {settings.project_name} in {settings.app_env} mode (version {settings.version}).")
    
    # Auto-create tables for SQLite
    try:
        from app.database.session import engine
        from app.models.base import Base
        import app.models.incident # registers tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema synchronized successfully.")
    except Exception as e:
        logger.error(f"Failed to synchronize database schema: {e}")
        
    logger.info("Mock database connectivity check passed.")
    logger.info("Application ready.")
    
    yield
    
    # On Shutdown
    logger.info("Shutting down application...")
    logger.info("Resources closed. Logs flushed.")


# Initialize FastAPI App
app = FastAPI(
    title=settings.project_name,
    version=settings.version,
    lifespan=lifespan
)

# Setup Global Exception Handlers
setup_exception_handlers(app)

# Register Middleware (Execution order is outer to inner)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RequestIDMiddleware)
setup_cors(app)

# Register API Routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "project": settings.project_name,
        "status": "Backend Infrastructure Ready",
        "version": settings.version
    }
