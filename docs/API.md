# API Documentation

The RecallOps AI backend provides a simple, structured REST API built with FastAPI.

## Base URL
`http://localhost:8000/api/v1`

---

## Endpoints

### 1. Analyze Incident
**Endpoint:** `POST /incidents/analyze`
**Description:** Analyzes a raw production log, searches Hindsight for memory, queries the cascadeflow runtime, runs reflection, and returns a comprehensive incident report.

#### Request Schema
`Content-Type: application/json`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `log` | string | Yes | The raw log output from the failing service. |
| `engineer_notes` | string | No | Optional context provided by the submitting engineer. |
| `environment` | string | No | The environment where the crash occurred (default: `"production"`). |
| `service` | string | No | The name of the failing service. |

**Example Request:**
```json
{
  "log": "[2026-06-27T12:00:00Z] ERROR: Database Connection Timeout in payments-service. Pool exhausted.",
  "environment": "production",
  "service": "payments-service"
}
```

#### Response Schema
Returns an `AnalyzeResponse` object containing the parsed incident, memory matches, routing decision, and final analysis.

**Example Response (200 OK):**
```json
{
  "incident_id": "b04cbacc-5eab-419e-84a8-a6abec7d4406",
  "parsed_incident": {
    "raw_log": "[2026-06-27T12:00:00Z] ERROR: Database Connection Timeout in payments-service...",
    "log_source": "payments-service",
    "service": "payments-service",
    "possible_language": "Unknown",
    "important_error_lines": ["ERROR: Database Connection Timeout"],
    "stack_traces": [],
    "timestamps": ["2026-06-27T12:00:00Z"]
  },
  "memory": {
    "matches": [
      {
        "incident_id": "demo-inc-1",
        "similarity_score": 0.94,
        "root_cause": "Connection pool exhausted",
        "playbook": "Increase MAX_CONNECTIONS in config.",
        "engineer_notes": "Worked perfectly last time."
      }
    ],
    "confidence": 0.94
  },
  "routing": {
    "selected_model": "gemini-flash",
    "reason": "High memory confidence. Fast summarization sufficient.",
    "estimated_cost": 0.001,
    "estimated_latency": 0.8
  },
  "analysis": {
    "severity": "critical",
    "root_cause": "Connection pool exhausted due to spike in requests.",
    "summary": "The payment service ran out of available database connections.",
    "playbook": "1. Pause migration.\n2. Increase MAX_CONNECTIONS.\n3. Restart pods.",
    "confidence": 0.95,
    "recommendation": "Implement PgBouncer.",
    "risk": "High"
  },
  "pipeline": {
    "parser_ms": 10,
    "memory_ms": 45,
    "router_ms": 15,
    "llm_ms": 800,
    "total_ms": 870
  }
}
```

#### Error Responses
**400 Bad Request:**
```json
{
  "error": "Log content cannot be empty."
}
```
**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error"
}
```

---

### 2. Health Check
**Endpoint:** `GET /`
**Description:** Verifies that the backend infrastructure is running.

**Example Response (200 OK):**
```json
{
  "project": "IncidentMind AI",
  "status": "Backend Infrastructure Ready",
  "version": "0.1.0"
}
```
