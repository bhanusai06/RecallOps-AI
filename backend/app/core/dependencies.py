# Dependency Injection module for FastAPI
# Future dependencies (e.g., Database Session, Authentication) will be placed here.

from app.ai.memory.hindsight_memory_service import HindsightMemoryService
from app.ai.cascade.cascade_agent import CascadeflowAgentWrapper
from app.ai.reflection.reflection_service import ReflectionService
from app.ai.orchestrator.incident_orchestrator import IncidentOrchestrator

def get_incident_orchestrator() -> IncidentOrchestrator:
    """Provides the AI Orchestrator with memory replaced by real Hindsight, LLM execution via Cascadeflow, and reflection active."""
    return IncidentOrchestrator(
        memory_service=HindsightMemoryService(),
        cascade_agent=CascadeflowAgentWrapper(),
        reflection_service=ReflectionService()
    )

def get_db():
    """Placeholder for database session dependency."""
    pass
