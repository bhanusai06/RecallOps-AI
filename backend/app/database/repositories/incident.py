from app.database.repositories.base import BaseRepository
from app.models.incident import Incident

class IncidentRepository(BaseRepository[Incident]):
    def __init__(self):
        super().__init__(Incident)

incident_repo = IncidentRepository()
