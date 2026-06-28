# Software Requirements Specification (SRS): IncidentMind AI

## 1. Business Problem
DevOps, SRE, and SOC teams spend thousands of hours diagnosing repeated or similar incidents. Current AI log analyzers forget past context and waste money on expensive models for simple errors. IncidentMind AI acts as an "organizational memory" that never forgets an outage, automatically routing between AI models (cost optimization) and retrieving past incident resolutions (memory) to slash Mean Time To Resolution (MTTR).

## 2. Functional Requirements
- **Incident Ingestion:** Upload logs (.log, .txt, .json) or paste text.
- **Incident Memory (Hindsight):** Store incident details, RCAs, and engineer notes; retrieve similar past incidents.
- **Intelligent Routing (cascadeflow):** Route queries to cheaper models for simple/confident incidents and escalate to advanced models for complex ones.
- **Structured AI Output:** AI must return structured JSON (severity, root cause, confidence, playbook).
- **State Management:** Track incidents through their lifecycle (Uploaded -> Parsed -> Memory Search -> AI Analysis -> Human Review -> Resolved -> Stored -> Archived).
- **Dashboard & Analytics:** Display metrics (total incidents, MTTR, AI accuracy, memory hit rate, cost, model usage, top root causes).

## 3. Non-Functional Requirements
- **Performance & Latency:** Resolve standard incidents using Gemini Flash in <2 seconds.
- **Cost Efficiency:** AI processing costs minimized using cascadeflow's budget enforcement.
- **Maintainability:** Separation of concerns across 7 core modules.
- **Resilience & Error Handling:** Graceful degradation if external services (Hindsight, LLMs) fail or timeout.

## 4. User Stories
1. **As an SRE**, I want to upload a raw Kubernetes log so that the system can automatically extract the error and suggest a root cause.
2. **As an SRE**, I want the system to remember how I fixed a similar issue last month so that I don't have to rewrite the playbook.
3. **As an Engineering Manager**, I want a dashboard showing AI token costs and model usage so that I can ensure we stay within budget.
4. **As an SRE**, I want to see the confidence score of the AI's recommendation so that I know whether to trust it or investigate further manually.
5. **As an SRE**, I want to view a timeline of past related incidents to understand the frequency of this specific failure.

## 5. Use Cases
- **New Incident Resolution:** User uploads log -> AI analyzes and provides RCA + Playbook.
- **Repeated Incident Resolution:** User uploads log -> Memory Engine finds match -> AI synthesizes past fix with current log.
- **Analytics Review:** Manager views dashboard to assess MTTR improvements and cost savings.
- **Feedback Loop:** User resolves incident -> Notes and final playbook are saved to Memory Engine for future use.

## 6. Incident State Machine
Every incident flows through these strict states:
1. `UPLOADED`: Raw log received.
2. `PARSED`: Log validated and structured.
3. `MEMORY_SEARCH`: Hindsight queried for similar incidents.
4. `AI_ANALYSIS`: cascadeflow routes to LLM; RCA and playbook generated.
5. `HUMAN_REVIEW`: (Optional) Engineer reviews and edits RCA/Playbook.
6. `RESOLVED`: Fix applied and confirmed.
7. `STORED`: Final RCA and notes embedded into Hindsight.
8. `ARCHIVED`: Closed incident, retained for historical analytics.
