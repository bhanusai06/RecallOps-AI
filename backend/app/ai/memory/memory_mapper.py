from typing import Any
from app.ai.models.analysis_result import MemoryResult

def map_hindsight_to_memory_result(hindsight_result: Any) -> MemoryResult:
    """
    Safely converts a raw Hindsight SDK dictionary/object to the domain MemoryResult model.
    This shields the rest of the application from SDK schema changes.
    """
    if not isinstance(hindsight_result, dict):
        # Fallback if SDK returns an object rather than a dict
        hindsight_result = getattr(hindsight_result, "__dict__", {})

    metadata = hindsight_result.get("metadata", {})
    
    return MemoryResult(
        incident_id=str(hindsight_result.get("id", "unknown")),
        similarity_score=float(hindsight_result.get("score", 0.0)),
        root_cause=str(metadata.get("root_cause", "Unknown")),
        playbook=str(metadata.get("playbook", "No playbook available.")),
        engineer_notes=str(metadata.get("engineer_notes", ""))
    )
