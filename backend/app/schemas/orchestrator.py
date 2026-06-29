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
    category: Optional[str] = None
    environment: Optional[str] = None
    severity: Optional[str] = None
    signature: Optional[dict] = None

class MemorySchema(BaseModel):
    matches: List[MemoryMatchSchema]
    confidence: float

class RoutingSchema(BaseModel):
    selected_model: str
    reason: str
    estimated_cost: float
    estimated_latency: float

class SafetyGateSchema(BaseModel):
    environment_match: bool
    service_match: bool
    service_version_match: bool
    deployment_version_match: bool
    config_hash_match: bool
    region_match: bool
    dependency_version_match: bool
    blast_radius_match: bool
    severity_match: bool
    is_safe: bool

class PreconditionSchema(BaseModel):
    db_pool_healthy: bool
    active_migrations: bool
    pending_deployments: bool
    cluster_healthy: bool
    downstream_stable: bool
    is_ready: bool

class ReflectionQualitySchema(BaseModel):
    success_rate: float
    recovery_speed: float
    stability_after_fix: float
    reflection_score: float

class AnalysisSchema(BaseModel):
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
    model_metadata: Optional[dict] = Field(None, serialization_alias="model_extra")
    
    # New Deterministic Engine Fields
    safety_gate: Optional[SafetyGateSchema] = None
    preconditions: Optional[PreconditionSchema] = None
    reflection_quality: Optional[ReflectionQualitySchema] = None
    false_reuse_risk: Optional[str] = None
    symptom_match: Optional[float] = None
    root_cause_match: Optional[float] = None

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
