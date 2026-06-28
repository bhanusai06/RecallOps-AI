import { AnalyzeResponse } from "@/types/api";

export type DemoIncident = {
  id: string;
  name: string;
  logText: string;
  narrativeSteps: string[];
  response: AnalyzeResponse & { model_extra?: any };
};

export const demoIncidents: Record<string, DemoIncident> = {
  "1": {
    id: "1",
    name: "Incident 1 (New Issue)",
    logText: "[2026-06-27T12:00:00Z] ERROR: Database Connection Timeout in payments-service. Pool exhausted.",
    narrativeSteps: [
      "Parsing raw incident log...",
      "Searching Hindsight vector database...",
      "No similar incidents found. Initiating full analysis.",
      "cascadeflow selected Premium Model (gpt-4-turbo) due to low confidence.",
      "Analyzing root cause and generating playbook...",
      "Reflection Engine creating first operational memory...",
      "Memory Quality evaluated at 62. Stored to Hindsight."
    ],
    response: {
      incident_id: "demo-inc-1",
      parsed_incident: {
        raw_log: "[2026-06-27T12:00:00Z] ERROR: Database Connection Timeout in payments-service. Pool exhausted.",
        log_source: "payment-service",
        service: "payments",
        possible_language: "Java",
        important_error_lines: ["ERROR: Database Connection Timeout"],
        stack_traces: [],
        timestamps: ["2026-06-27T12:00:00Z"]
      },
      memory: {
        matches: [],
        confidence: 0.1
      },
      routing: {
        selected_model: "gpt-4-turbo",
        reason: "Low memory confidence. Complex reasoning required.",
        estimated_cost: 0.045,
        estimated_latency: 3.2
      },
      analysis: {
        severity: "critical",
        root_cause: "Connection pool exhausted due to spike in payment requests.",
        summary: "The payment service ran out of database connections.",
        playbook: "1. Increase MAX_CONNECTIONS in config.\n2. Restart payment pods.\n3. Monitor pool metrics.",
        confidence: 0.85,
        recommendation: "Implement connection queuing or PgBouncer.",
        risk: "High",
        category: "DB_TIMEOUT",
        signature_json: {
          exit_code: 137,
          resource_type: "database_instance",
          memory_limit: "512Mi",
          restart_count: 2,
          environment: "production",
          severity: "critical",
          affected_service: "payments-service",
          timestamp: "2026-06-27 12:00:00"
        },
        timeline_json: [
          { time: "12:00", event: "Memory utilization spikes above 85%" },
          { time: "12:01", event: "GC execution pauses increase to >2s" },
          { time: "12:02", event: "API latency degradation on payments endpoint" },
          { time: "12:03", event: "OOMKill terminates pod process" },
          { time: "12:04", event: "Restart initiated" }
        ],
        what_changed: "Deployment v2.4.1 (updated checkout payment gateway integrations) happened 7 minutes before the incident.",
        blast_radius_json: {
          nodes: [
            { id: "checkout-ui", label: "Checkout Frontend", status: "degraded" },
            { id: "payments-service", label: "Payments Service (Root)", status: "failed" },
            { id: "database", label: "Postgres DB", status: "healthy" },
            { id: "notification-svc", label: "Notification Svc", status: "degraded" }
          ],
          edges: [
            { source: "checkout-ui", target: "payments-service" },
            { source: "payments-service", target: "database" },
            { source: "payments-service", target: "notification-svc" }
          ]
        },
        prevention_json: [
          "Configure Horizontal Pod Autoscaler (HPA) to scale dynamically on CPU/Memory thresholds above 80%.",
          "Increase container memory request limit to 1Gi in Helm templates to allow room for GC overhead.",
          "Adjust JVM max heap size (-Xmx) to occupy 75% of container memory limits to prevent native memory exhaustion."
        ],
        verification_status: "Unverified",
        //@ts-ignore - injecting extra fields for UI
        model_extra: { memory_quality: 62, version: 1, usage_count: 0 }
      },
      pipeline: {
        parser_ms: 12,
        memory_ms: 45,
        router_ms: 15,
        llm_ms: 3200,
        total_ms: 3272
      }
    }
  },
  "2": {
    id: "2",
    name: "Incident 2 (Similar Issue)",
    logText: "[2026-06-28T09:15:00Z] ERROR: Database Connection Timeout in payments-service during migration.",
    narrativeSteps: [
      "Parsing raw incident log...",
      "Searching Hindsight vector database...",
      "1 Similar Incident Found (94% Match).",
      "cascadeflow selected Cheap Model (gemini-flash) due to high confidence.",
      "Reusing and adapting previous playbook...",
      "Reflection Engine updating stored memory...",
      "Memory Quality improved to 81. Hindsight updated."
    ],
    response: {
      incident_id: "demo-inc-2",
      parsed_incident: {
        raw_log: "[2026-06-28T09:15:00Z] ERROR: Database Connection Timeout in payments-service during migration.",
        log_source: "payment-service",
        service: "payments",
        possible_language: "Java",
        important_error_lines: ["ERROR: Database Connection Timeout"],
        stack_traces: [],
        timestamps: ["2026-06-28T09:15:00Z"]
      },
      memory: {
        matches: [
          {
            incident_id: "demo-inc-1",
            similarity_score: 0.94,
            root_cause: "Connection pool exhausted",
            playbook: "1. Increase MAX_CONNECTIONS in config.\n2. Restart payment pods.",
            engineer_notes: "Worked perfectly last time."
          }
        ],
        confidence: 0.94
      },
      routing: {
        selected_model: "gemini-flash",
        reason: "High memory confidence. Fast summarization sufficient.",
        estimated_cost: 0.001,
        estimated_latency: 0.8
      },
      analysis: {
        severity: "critical",
        root_cause: "Connection pool exhausted, exacerbated by active database migration.",
        summary: "The payment service ran out of database connections.",
        playbook: "1. Pause migration.\n2. Increase MAX_CONNECTIONS in config.\n3. Restart payment pods.\n4. Resume migration slowly.",
        confidence: 0.95,
        recommendation: "Do not run migrations during peak payment hours.",
        risk: "Medium",
        category: "DB_TIMEOUT",
        signature_json: {
          exit_code: 137,
          resource_type: "database_instance",
          memory_limit: "512Mi",
          restart_count: 3,
          environment: "production",
          severity: "critical",
          affected_service: "payments-service",
          timestamp: "2026-06-28 09:15:00"
        },
        timeline_json: [
          { time: "09:10", event: "Database migration script connection acquired" },
          { time: "09:12", event: "GC execution pauses increase to >3s due to transaction locks" },
          { time: "09:13", event: "API latency degradation on payments endpoint" },
          { time: "09:14", event: "Database connection pool exhaustion detected" },
          { time: "09:15", event: "Incident triggered" }
        ],
        what_changed: "Database connection pool scale-down policy was applied via AWS AutoScaling 4 minutes before the incident.",
        blast_radius_json: {
          nodes: [
            { id: "checkout-ui", label: "Checkout Frontend", status: "degraded" },
            { id: "payments-service", label: "Payments Service (Root)", status: "failed" },
            { id: "database", label: "Postgres DB", status: "healthy" }
          ],
          edges: [
            { source: "checkout-ui", target: "payments-service" },
            { source: "payments-service", target: "database" }
          ]
        },
        prevention_json: [
          "Increase database connection pool size limits in payment-service configuration (e.g. max_connections=50).",
          "Implement a circuit breaker pattern (e.g. Resilience4j) to fail fast when database queries begin timing out.",
          "Establish read replicas to offload read-heavy queries."
        ],
        verification_status: "Unverified",
        //@ts-ignore
        model_extra: { memory_quality: 81, version: 2, usage_count: 1 }
      },
      pipeline: {
        parser_ms: 10,
        memory_ms: 42,
        router_ms: 8,
        llm_ms: 800,
        total_ms: 860
      }
    }
  },
  "3": {
    id: "3",
    name: "Incident 3 (Identical Issue)",
    logText: "[2026-06-29T14:30:00Z] ERROR: Database Connection Timeout in payments-service.",
    narrativeSteps: [
      "Parsing raw incident log...",
      "Searching Hindsight vector database...",
      "Identical Incident Found (99% Match).",
      "cascadeflow bypassing LLM generation entirely.",
      "Instantly applying known high-quality playbook...",
      "Memory reused successfully. No reflection needed.",
      "Resolution time & cost dramatically reduced. (Quality: 94)"
    ],
    response: {
      incident_id: "demo-inc-3",
      parsed_incident: {
        raw_log: "[2026-06-29T14:30:00Z] ERROR: Database Connection Timeout in payments-service.",
        log_source: "payment-service",
        service: "payments",
        possible_language: "Java",
        important_error_lines: ["ERROR: Database Connection Timeout"],
        stack_traces: [],
        timestamps: ["2026-06-29T14:30:00Z"]
      },
      memory: {
        matches: [
          {
            incident_id: "demo-inc-2",
            similarity_score: 0.99,
            root_cause: "Connection pool exhausted",
            playbook: "1. Pause migration.\n2. Increase MAX_CONNECTIONS in config.\n3. Restart payment pods.\n4. Resume migration slowly.",
            engineer_notes: "Standard procedure now."
          }
        ],
        confidence: 0.99
      },
      routing: {
        selected_model: "cache-hit",
        reason: "Near exact match. Bypassing LLM execution.",
        estimated_cost: 0.000,
        estimated_latency: 0.05
      },
      analysis: {
        severity: "critical",
        root_cause: "Connection pool exhausted.",
        summary: "The payment service ran out of database connections.",
        playbook: "1. Pause migration.\n2. Increase MAX_CONNECTIONS in config.\n3. Restart payment pods.\n4. Resume migration slowly.",
        confidence: 0.99,
        recommendation: "Implement PgBouncer immediately.",
        risk: "Low",
        category: "DB_TIMEOUT",
        signature_json: {
          exit_code: 137,
          resource_type: "database_instance",
          memory_limit: "512Mi",
          restart_count: 0,
          environment: "production",
          severity: "critical",
          affected_service: "payments-service",
          timestamp: "2026-06-29 14:30:00"
        },
        timeline_json: [
          { time: "14:25", event: "Memory utilization spikes above 85%" },
          { time: "14:27", event: "GC execution pauses increase to >3s" },
          { time: "14:28", event: "API latency degradation on payments endpoint" },
          { time: "14:29", event: "OOMKill terminates pod process" },
          { time: "14:30", event: "Incident triggered" }
        ],
        what_changed: "No recent system deployment or configuration changes detected in the 30-minute window prior to the incident.",
        blast_radius_json: {
          nodes: [
            { id: "checkout-ui", label: "Checkout Frontend", status: "degraded" },
            { id: "payments-service", label: "Payments Service (Root)", status: "failed" },
            { id: "database", label: "Postgres DB", status: "healthy" }
          ],
          edges: [
            { source: "checkout-ui", target: "payments-service" },
            { source: "payments-service", target: "database" }
          ]
        },
        prevention_json: [
          "Increase database connection pool size limits in payment-service configuration (e.g. max_connections=50).",
          "Implement PgBouncer connection queuing agent immediately."
        ],
        verification_status: "Unverified",
        //@ts-ignore
        model_extra: { memory_quality: 94, version: 3, usage_count: 2 }
      },
      pipeline: {
        parser_ms: 8,
        memory_ms: 38,
        router_ms: 2,
        llm_ms: 0,
        total_ms: 48
      }
    }
  }
};
