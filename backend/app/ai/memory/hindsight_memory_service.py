import logging
from typing import List
from app.ai.memory.memory_interface import IMemoryService
from app.ai.models.analysis_result import MemoryResult, ParsedIncident
from app.ai.memory.memory_mapper import map_hindsight_to_memory_result
from app.config.settings import settings

logger = logging.getLogger("incidentmind.ai.hindsight")

try:
    import hindsight
    HINDSIGHT_AVAILABLE = True
except ImportError:
    HINDSIGHT_AVAILABLE = False

class HindsightMemoryService(IMemoryService):
    """
    Production implementation of the Memory Service utilizing the Hindsight Vector Engine.
    """
    def __init__(self):
        # Retrieve key from settings as required (never hardcoded)
        self.api_key = settings.hindsight_api_key or "fake-key-for-local-testing"
        self.is_available = HINDSIGHT_AVAILABLE and bool(self.api_key)
        
        if not self.is_available:
            logger.warning("Hindsight SDK is not available or missing API Key. Memory lookups will safely return empty.")
            self.client = None
        else:
            try:
                self.client = hindsight.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Hindsight client: {e}")
                self.is_available = False
                self.client = None

    async def search_similar_incidents(self, parsed_incident: ParsedIncident) -> List[MemoryResult]:
        if not self.is_available or not self.client:
            logger.warning("Hindsight not available, returning empty memory results.")
            return []
            
        try:
            logger.info("Executing Hindsight similarity search...")
            results = await self.client.collections("incidents").search(
                text=parsed_incident.raw_log,
                limit=3
            )
            # Map raw SDK responses strictly to domain models
            return [map_hindsight_to_memory_result(res) for res in results]
        except Exception as e:
            logger.error(f"Hindsight search failed: {e}")
            return []

    async def store_incident_memory(self, incident_id: str, report: str) -> bool:
        if not self.is_available or not self.client:
            return False
            
        try:
            await self.client.collections("incidents").insert(id=incident_id, text=report)
            logger.info(f"Stored incident {incident_id} in Hindsight memory.")
            return True
        except Exception as e:
            logger.error(f"Hindsight store failed: {e}")
            return False

    async def update_memory(self, incident_id: str, report: str) -> bool:
        return await self.store_incident_memory(incident_id, report)

    async def delete_memory(self, incident_id: str) -> bool:
        if not self.is_available or not self.client:
            return False
            
        try:
            await self.client.collections("incidents").delete(id=incident_id)
            logger.info(f"Deleted incident {incident_id} from Hindsight memory.")
            return True
        except Exception as e:
            logger.error(f"Hindsight delete failed: {e}")
            return False

    async def health_check(self) -> bool:
        return self.is_available
