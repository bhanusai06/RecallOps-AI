class BusinessException(Exception):
    """Base class for all business logic exceptions."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class InvalidStateTransition(BusinessException):
    """Raised when an invalid state transition is attempted."""
    pass

class IncidentNotFound(BusinessException):
    """Raised when an incident cannot be found."""
    pass

class IncidentAlreadyResolved(BusinessException):
    """Raised when attempting to modify a resolved incident."""
    pass

class ValidationException(BusinessException):
    """Raised when business validation fails."""
    pass
