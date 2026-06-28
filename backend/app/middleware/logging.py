import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

logger = logging.getLogger("incidentmind.request")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log request execution time, method, path, and status code.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        request_id = getattr(request.state, "request_id", "unknown")
        
        logger.info(
            f"req_id={request_id} method={request.method} path={request.url.path} "
            f"status={response.status_code} duration={process_time:.4f}s"
        )
        
        return response
