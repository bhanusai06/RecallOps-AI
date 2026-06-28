from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

class MemoryDocument(BaseModel):
    """
    Structured operational knowledge document, retained by Hindsight.
    Evolves over time as similar incidents occur.
    """
    # Core Knowledge
    problem: str
    observed_symptoms: List[str]
    root_cause: str
    resolution: str
    playbook: str
    lessons_learned: str
    
    # Context & Tagging
    confidence: float
    affected_services: List[str]
    keywords: List[str]
    environment: str
    
    # Evolution Metadata
    created_timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    version: int = 1
    usage_count: int = 0
    last_retrieved: Optional[str] = None
    success_rate: float = 1.0
    memory_quality: int = 0
