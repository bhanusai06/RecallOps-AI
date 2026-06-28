from typing import Protocol, List
from app.ai.models.analysis_result import MemoryResult, ParsedIncident

class IMemoryService(Protocol):
    """
    Interface for Hindsight memory integration.
    """
    async def search_similar_incidents(self, parsed_incident: ParsedIncident, db = None) -> List[MemoryResult]: ...
    async def store_incident_memory(self, incident_id: str, report: str) -> bool: ...
    async def delete_memory(self, incident_id: str) -> bool: ...
