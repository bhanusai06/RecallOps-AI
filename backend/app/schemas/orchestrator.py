from typing import Optional, List
from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    log: str
    engineer_notes: Optional[str] = None
    environment: str = "production"
    service: Optional[str] = None

class MemoryMatchSchema(BaseModel):
    incident_id: str
    similarity_score: float
    root_cause: str
    playbook: str
    engineer_notes: str

class MemorySchema(BaseModel):
    matches: List[MemoryMatchSchema]
    confidence: float

class RoutingSchema(BaseModel):
    selected_model: str
    reason: str
    estimated_cost: float
    estimated_latency: float

class AnalysisSchema(BaseModel):
    severity: str
    root_cause: str
    summary: str
    playbook: str
    confidence: float
    recommendation: str
    risk: str
    model_metadata: Optional[dict] = Field(None, serialization_alias="model_extra")

class PipelineTimingSchema(BaseModel):
    parser_ms: int
    memory_ms: int
    router_ms: int
    llm_ms: int
    total_ms: int

class AnalyzeResponse(BaseModel):
    incident_id: str
    parsed_incident: dict
    memory: MemorySchema
    routing: RoutingSchema
    analysis: AnalysisSchema
    pipeline: PipelineTimingSchema
