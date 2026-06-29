export interface AnalyzeRequest {
  log: string;
  engineer_notes?: string;
  environment?: string;
  service?: string;
}

export interface MemoryMatch {
  incident_id: string;
  similarity_score: number;
  root_cause: string;
  playbook: string;
  engineer_notes: string;
}

export interface RoutingInfo {
  selected_model: string;
  reason: string;
  estimated_cost: number;
  estimated_latency: number;
}

export interface AnalysisInfo {
  severity: "Critical" | "High" | "Medium" | "Low" | string;
  root_cause: string;
  summary: string;
  playbook: string;
  confidence: number;
  recommendation: string;
  risk: string;
  category?: string;
  signature_json?: any;
  timeline_json?: any[];
  what_changed?: string;
  blast_radius_json?: any;
  prevention_json?: string[];
  verification_status?: string;
  recovery_time_sec?: number;
  verification_effectiveness?: string;
  model_metadata?: any;
  safety_gate?: {
    environment_match: boolean;
    service_match: boolean;
    service_version_match: boolean;
    deployment_version_match: boolean;
    config_hash_match: boolean;
    region_match: boolean;
    dependency_version_match: boolean;
    blast_radius_match: boolean;
    severity_match: boolean;
    is_safe: boolean;
  };
  preconditions?: {
    db_pool_healthy: boolean;
    active_migrations: boolean;
    pending_deployments: boolean;
    cluster_healthy: boolean;
    downstream_stable: boolean;
    is_ready: boolean;
  };
  reflection_quality?: {
    success_rate: number;
    recovery_speed: number;
    stability_after_fix: number;
    reflection_score: number;
  };
  false_reuse_risk?: string;
  symptom_match?: number;
  root_cause_match?: number;
}

export interface PipelineTiming {
  parser_ms: number;
  memory_ms: number;
  router_ms: number;
  llm_ms: number;
  total_ms: number;
}

export interface ParsedIncident {
  raw_log: string;
  log_source: string;
  service: string;
  possible_language: string;
  important_error_lines: string[];
  stack_traces: string[];
  timestamps: string[];
}

export interface AnalyzeResponse {
  incident_id: string;
  parsed_incident: ParsedIncident;
  memory: {
    matches: MemoryMatch[];
    confidence: number;
  };
  routing: RoutingInfo;
  analysis: AnalysisInfo;
  pipeline: PipelineTiming;
}
