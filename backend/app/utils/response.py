from typing import Any, Dict, Optional

def success_response(data: Any = None, message: str = "Success") -> Dict[str, Any]:
    """Formats a standard success response."""
    response = {
        "success": True,
        "message": message
    }
    if data is not None:
        response["data"] = data
    return response

def error_response(error: str, code: Optional[str] = None) -> Dict[str, Any]:
    """Formats a standard error response."""
    response = {
        "success": False,
        "error": error
    }
    if code:
        response["code"] = code
    return response
