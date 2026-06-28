import pytest
import sys
from unittest.mock import patch
from app.ai.memory.hindsight_memory_service import HindsightMemoryService
from app.ai.models.analysis_result import ParsedIncident

@pytest.fixture
def mock_parsed_incident():
    return ParsedIncident(
        raw_log="Mock Log",
        log_source="Mock Source",
        service="Mock Service",
        possible_language="Python",
        important_error_lines=[],
        stack_traces=[],
        timestamps=[]
    )

@pytest.mark.asyncio
async def test_hindsight_search(mock_parsed_incident):
    """Test memory search flow through mapper."""
    service = HindsightMemoryService()
    results = await service.search_similar_incidents(mock_parsed_incident)
    
    assert len(results) > 0
    assert results[0].incident_id == "inc_999_real_hindsight"
    assert results[0].similarity_score == 0.99

@pytest.mark.asyncio
async def test_hindsight_store():
    """Test memory storage flow."""
    service = HindsightMemoryService()
    result = await service.store_incident_memory("inc_1", "Full Report")
    assert result is True

@pytest.mark.asyncio
async def test_hindsight_failure_fallback(mock_parsed_incident):
    """Test that pipeline does not crash when Hindsight import fails."""
    # Temporarily remove hindsight from sys.modules to trigger failure
    original_hindsight = sys.modules.get('hindsight')
    if original_hindsight:
        del sys.modules['hindsight']
    
    with patch.dict('sys.modules', {'hindsight': None}):
        # Re-import to trigger the failure block
        import importlib
        import app.ai.memory.hindsight_memory_service
        importlib.reload(app.ai.memory.hindsight_memory_service)
        
        service = app.ai.memory.hindsight_memory_service.HindsightMemoryService()
        
        assert service.is_available is False
        results = await service.search_similar_incidents(mock_parsed_incident)
        assert len(results) == 0
        
        store_result = await service.store_incident_memory("inc_2", "Report")
        assert store_result is False

    # Restore module
    if original_hindsight:
        sys.modules['hindsight'] = original_hindsight
