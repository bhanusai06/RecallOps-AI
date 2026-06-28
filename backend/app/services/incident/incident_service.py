from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.common.base_service import BaseService
from app.database.repositories.incident import IncidentRepository, incident_repo
from app.models.incident import Incident, IncidentStatus, EngineerNote
from app.services.incident.validators import (
    validate_incident_exists,
    validate_status_transition,
    validate_resolution_allowed
)

class IncidentService(BaseService[IncidentRepository]):
    """
    Application Service orchestrating the business rules for Incidents.
    Completely decoupled from FastAPI, JSON, and external APIs.
    """
    
    async def create_incident(self, db: AsyncSession, raw_log: str) -> Incident:
        """Creates a new incident starting in the UPLOADED state."""
        return await self.repository.create(db, {"status": IncidentStatus.UPLOADED})

    async def get_incident(self, db: AsyncSession, incident_id: str) -> Incident:
        """Retrieves an incident by ID, applying existence validation."""
        incident = await self.repository.get(db, incident_id)
        return validate_incident_exists(incident, incident_id)

    async def update_status(self, db: AsyncSession, incident_id: str, new_status: IncidentStatus) -> Incident:
        """Updates the status of an incident, strictly adhering to the state machine."""
        incident = await self.get_incident(db, incident_id)
        validate_status_transition(incident.status, new_status)
        return await self.repository.update(db, incident, {"status": new_status})

    async def mark_resolved(self, db: AsyncSession, incident_id: str) -> Incident:
        """Advances an incident to the RESOLVED state after validating it is allowed."""
        incident = await self.get_incident(db, incident_id)
        validate_resolution_allowed(incident)
        return await self.update_status(db, incident_id, IncidentStatus.RESOLVED)

    async def archive_incident(self, db: AsyncSession, incident_id: str) -> Incident:
        """Archives a STORED incident."""
        return await self.update_status(db, incident_id, IncidentStatus.ARCHIVED)

    async def add_engineer_note(self, db: AsyncSession, incident_id: str, content: str) -> Incident:
        """Appends an engineer note to the specified incident."""
        incident = await self.get_incident(db, incident_id)
        # Assuming SQLAlchemy tracks the association; in a fuller implementation, 
        # an EngineerNoteRepository would handle this persistence directly.
        note = EngineerNote(incident_id=incident_id, content=content)
        db.add(note)
        await db.commit()
        await db.refresh(incident)
        return incident

    async def get_incident_history(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Incident]:
        """Retrieves paginated history of all incidents."""
        return await self.repository.get_all(db, skip=skip, limit=limit)

incident_service = IncidentService(incident_repo)
