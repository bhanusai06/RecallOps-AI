# AI Design Document: IncidentMind AI

## 1. Prompt Engineering (Library)
Prompts are isolated in the `prompts/` directory to prevent hardcoding. Each serves a single responsibility.
- `incident_analysis.md`: Given a log and past context, generate RCA.
- `memory_retrieval.md`: Transform a raw log into a dense search query for Hindsight.
- `playbook_generation.md`: Given a root cause and context, generate step-by-step remediation.
- `severity_detection.md`: Extract severity and affected services (blast radius).
- `routing.md`: cascadeflow pre-flight prompt to estimate complexity.
- `summary.md`: Summarize a resolved incident for long-term memory storage.

## 2. Memory Strategy (Hindsight)
- **Retain:** After an incident is marked `RESOLVED`, the `summary.md` prompt generates a dense representation of the Incident + RCA + Playbook + Engineer Notes. This is embedded into Hindsight.
- **Recall:** On new upload, Hindsight is queried. If similarity > threshold, retrieved context is attached to the `incident_analysis.md` prompt.
- **Reflect:** The AI is explicitly instructed: "If past incidents are provided, state whether this matches a previous incident and reference its ID and successful playbook."

## 3. Model Routing & cascadeflow Logic
- **Tier 1 (Gemini Flash):** Default for all routing. Cost-effective and fast.
- **Tier 2 (GPT-4.1 Mini):** Escalation if Gemini returns Confidence < 90%.
- **Tier 3 (GPT-5.5):** Direct routing if `severity_detection.md` flags "Critical Production" or if Tier 2 fails to provide a cohesive JSON output.
- **Budget Control:** If daily token cost exceeds $X, Tier 3 is disabled, and Tier 2 acts as the ceiling.

## 4. Confidence Logic
The AI must score its own confidence (0-100%).
- **>95%:** AI knows exact cause (e.g., standard OutOfMemoryError).
- **80-95%:** Highly probable cause, multiple possible playbooks.
- **<80%:** Ambiguous log. Trigger cascadeflow escalation to a smarter model.

## 5. JSON Output Schema
Strict enforcement of output schema for dashboards.
```json
{
  "severity": "High|Medium|Low|Critical",
  "rootCause": "String description",
  "confidence": 94,
  "recommendations": ["string", "string"],
  "playbook": [
    {"step": 1, "action": "string"},
    {"step": 2, "action": "string"}
  ],
  "relatedIncidents": ["inc_id_1"],
  "blastRadius": {
    "servicesAffected": ["Auth", "Payments"],
    "riskLevel": "Medium"
  }
}
```

## 6. AI Error Handling
- **Hindsight Unavailable:** Fallback to stateless AI analysis. Add warning flag to output.
- **LLM Timeout/Rate Limit:** cascadeflow automatically retries with a fallback model (e.g., Claude).
- **Invalid JSON:** cascadeflow retry loop with a strict JSON-correction prompt (max 2 retries).
- **Memory Search Finds Nothing:** Proceed with zero-shot `incident_analysis.md` without RAG context.
- **Corrupted Log:** Reject at `PARSED` state; ask user for valid log file.
