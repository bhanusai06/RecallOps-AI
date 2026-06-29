from typing import List, Optional, Any
from pydantic import BaseModel

class ParsedIncident(BaseModel):
    raw_log: str
    log_source: str
    service: str
    possible_language: str
    important_error_lines: List[str]
    stack_traces: List[str]
    timestamps: List[str]
    category: Optional[str] = "UNKNOWN"
    signature: Optional[dict] = None

class MemoryResult(BaseModel):
    incident_id: str
    similarity_score: float
    root_cause: str
    playbook: str
    engineer_notes: str
    category: Optional[str] = None
    environment: Optional[str] = None
    severity: Optional[str] = None
    signature: Optional[dict] = None

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
    category: Optional[str] = "UNKNOWN"
    signature_json: Optional[dict] = None
    timeline_json: Optional[List[dict]] = None
    what_changed: Optional[str] = None
    blast_radius_json: Optional[dict] = None
    prevention_json: Optional[List[str]] = None
    verification_status: Optional[str] = "Unverified"
    recovery_time_sec: Optional[int] = None
    verification_effectiveness: Optional[str] = None
    model_metadata: Optional[dict] = None
    
    # Deterministic Engine Verification Fields
    safety_gate: Optional[Any] = None
    preconditions: Optional[Any] = None
    reflection_quality: Optional[Any] = None
    false_reuse_risk: Optional[str] = "UNKNOWN"
    symptom_match: Optional[float] = 0.0
    root_cause_match: Optional[float] = 0.0

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

