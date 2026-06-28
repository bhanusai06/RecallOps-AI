from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
import logging
from app.utils.response import error_response

logger = logging.getLogger("incidentmind.exceptions")

class AppException(Exception):
    """Custom Base Exception for Application Errors."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

def setup_exception_handlers(app: FastAPI) -> None:
    """Registers global exception handlers for the FastAPI app."""
    
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(error=exc.message)
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content=error_response(error="Internal Server Error")
        )
