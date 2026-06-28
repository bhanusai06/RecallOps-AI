from typing import TypeVar, Generic
from app.database.repositories.base import BaseRepository

R = TypeVar("R", bound=BaseRepository)

class BaseService(Generic[R]):
    """
    Base service providing repository injection and shared utilities.
    The service layer orchestrates repositories without knowing about HTTP or FastApi.
    """
    def __init__(self, repository: R):
        self.repository = repository
