from typing import List, Optional
from pydantic import BaseModel

class ParsedIncident(BaseModel):
    raw_log: str
    log_source: str
    service: str
    possible_language: str
    important_error_lines: List[str]
    stack_traces: List[str]
    timestamps: List[str]

class MemoryResult(BaseModel):
    incident_id: str
    similarity_score: float
    root_cause: str
    playbook: str
    engineer_notes: str

class RoutingDecision(BaseModel):
    selected_model: str
    reason: str
    estimated_cost: float
    estimated_latency: float
    confidence: float

class AnalysisResult(BaseModel):
    severity: str
    root_cause: str
    summary: str
    playbook: str
    confidence: float
    recommendation: str
    risk: str
    model_metadata: Optional[dict] = None

class PipelineTiming(BaseModel):
    parser_ms: int
    memory_ms: int
    router_ms: int
    llm_ms: int
    total_ms: int

class FinalIncidentReport(BaseModel):
    parsed_incident: ParsedIncident
    memory_results: List[MemoryResult]
    routing_decision: RoutingDecision
    analysis_result: AnalysisResult
    pipeline_timing: PipelineTiming

