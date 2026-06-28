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
