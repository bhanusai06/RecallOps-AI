from typing import List
from app.ai.memory.memory_interface import IMemoryService
from app.ai.models.analysis_result import MemoryResult, ParsedIncident

class MockMemoryService(IMemoryService):
    """
    Mock implementation of Hindsight Memory Service.
    """
    async def search_similar_incidents(self, parsed_incident: ParsedIncident, db = None) -> List[MemoryResult]:
        log_lower = parsed_incident.raw_log.lower()
        if "strong" in log_lower:
            return [
                MemoryResult(
                    incident_id="inc_42",
                    similarity_score=0.98,
                    root_cause="Database password rotated and not synced.",
                    playbook="Restart the authentication pod to fetch new secrets.",
                    engineer_notes="This happens every 90 days."
                )
            ]
        elif "weak" in log_lower:
            return [
                MemoryResult(
                    incident_id="inc_12",
                    similarity_score=0.65,
                    root_cause="Generic timeout.",
                    playbook="Check database CPU.",
                    engineer_notes="Maybe related to high load."
                )
            ]
        return []

    async def store_incident_memory(self, incident_id: str, report: str) -> bool:
        return True

    async def delete_memory(self, incident_id: str) -> bool:
        return True
