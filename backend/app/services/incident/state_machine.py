from app.models.incident import IncidentStatus
from app.exceptions.business_exceptions import InvalidStateTransition

# Define allowed transitions for the strict state machine
ALLOWED_TRANSITIONS = {
    IncidentStatus.UPLOADED: [IncidentStatus.PARSED],
    IncidentStatus.PARSED: [IncidentStatus.MEMORY_SEARCH],
    IncidentStatus.MEMORY_SEARCH: [IncidentStatus.AI_ANALYSIS],
    IncidentStatus.AI_ANALYSIS: [IncidentStatus.HUMAN_REVIEW, IncidentStatus.RESOLVED],
    IncidentStatus.HUMAN_REVIEW: [IncidentStatus.RESOLVED],
    IncidentStatus.RESOLVED: [IncidentStatus.STORED],
    IncidentStatus.STORED: [IncidentStatus.ARCHIVED],
    IncidentStatus.ARCHIVED: []
}

def validate_transition(current_status: IncidentStatus, next_status: IncidentStatus) -> None:
    """
    Validates if a transition from current_status to next_status is allowed.
    Raises InvalidStateTransition if the transition violates the state machine.
    """
    allowed_next_states = ALLOWED_TRANSITIONS.get(current_status, [])
    if next_status not in allowed_next_states:
        raise InvalidStateTransition(
            f"Cannot transition from {current_status.value} to {next_status.value}."
        )
