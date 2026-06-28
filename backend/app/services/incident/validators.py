from typing import Optional
from app.models.incident import Incident, IncidentStatus
from app.exceptions.business_exceptions import IncidentNotFound, IncidentAlreadyResolved
from app.services.incident.state_machine import validate_transition

def validate_incident_exists(incident: Optional[Incident], incident_id: str) -> Incident:
    """Ensures an incident exists, otherwise raises IncidentNotFound."""
    if not incident:
        raise IncidentNotFound(f"Incident with ID {incident_id} not found.")
    return incident

def validate_status_transition(current_status: IncidentStatus, next_status: IncidentStatus) -> None:
    """Validates the state transition using the state machine rules."""
    validate_transition(current_status, next_status)

def validate_resolution_allowed(incident: Incident) -> None:
    """Ensures that the incident is not already resolved before modifying."""
    if incident.status in [IncidentStatus.RESOLVED, IncidentStatus.STORED, IncidentStatus.ARCHIVED]:
        raise IncidentAlreadyResolved(f"Incident {incident.id} is already resolved or archived.")
