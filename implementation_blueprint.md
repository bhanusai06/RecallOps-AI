# Implementation Blueprint v1: IncidentMind AI

This document serves as the master instruction manual for all AI coding agents involved in building IncidentMind AI.

## 1. Agent Assignments & Roles
- **Architect Agent:** Generates architecture, APIs, diagrams, and blueprints.
- **Backend Agent:** Builds FastAPI services, endpoints, state machine, and DB models.
- **Memory Agent:** Integrates Hindsight APIs (Store, Search, Embed).
- **Routing Agent:** Implements cascadeflow logic, cost tracking, and audit trails.
- **Prompt Agent:** Writes markdown prompts and Pydantic JSON schemas.
- **Frontend Agent:** Builds Next.js UI, Tailwind styling, and shadcn/ui components.
- **QA/DevOps Agent:** Writes tests, Dockerfiles, and deployment configs.

## 2. File-by-File Responsibilities (Backend)
```text
backend/
├── api/
│   ├── routes_incident.py  (Backend Agent: Upload, Analyze, History)
│   ├── routes_memory.py    (Memory Agent: Store, Search)
│   └── routes_analytics.py (Backend Agent: Dashboards)
├── services/
│   ├── incident_service.py (Backend Agent: State Machine logic)
│   └── playbook_service.py (Backend Agent: Playbook management)
├── memory/
│   └── hindsight_client.py (Memory Agent: API wrapper for Hindsight)
├── router/
│   └── cascadeflow_client.py (Routing Agent: Routing rules, budget)
├── llm/
│   ├── prompt_loader.py    (Prompt Agent: Load MD files)
│   └── schemas.py          (Prompt Agent: Pydantic schemas)
├── database/
│   ├── models.py           (Backend Agent: SQLAlchemy models from SAD)
│   └── session.py          (Backend Agent: DB Connection)
└── analytics/
    └── metrics.py          (Backend Agent: Aggregation functions)
```

## 3. Data Contracts
- The Frontend expects exact matching to the API Design JSON structures.
- The Backend expects Pydantic models for all incoming requests.
- cascadeflow expects a standard interface to call LLMs and return `(JSON_Result, Audit_Data)`.

## 4. Development Order (Strict Sequence)
1. **Phase 1: Foundation (Backend Agent)** - Setup FastAPI, Database Models (`models.py`), and Migrations.
2. **Phase 2: Prompts & Schemas (Prompt Agent)** - Create `prompts/` directory and Pydantic output schemas.
3. **Phase 3: Integration Layers (Memory & Routing Agents)** - Build `hindsight_client.py` and `cascadeflow_client.py` with mock external calls first, then real APIs.
4. **Phase 4: Core Logic (Backend Agent)** - Implement `incident_service.py` to tie Prompts + Memory + Router + DB together into the State Machine.
5. **Phase 5: API Endpoints (Backend Agent)** - Expose `routes_*.py`.
6. **Phase 6: UI (Frontend Agent)** - Build Next.js Dashboard, connect to APIs.
7. **Phase 7: Polish (QA Agent)** - Error handling and Docker.

## 5. Demo Script execution
The platform must perfectly execute this sequence for the hackathon judges:

1. **Upload Incident #1:** (Pod CrashLoopBackOff). AI gives a generic answer via Gemini Flash. Cost: $0.001. State flows to `RESOLVED` and `STORED`.
2. **Upload Incident #2:** (Same issue). Hindsight detects similarity. AI states: "Matches Incident #1 - Environment Variable Missing." Shows memory working.
3. **Upload Incident #3:** (Critical Production Payment Gateway Failure). cascadeflow detects "Critical" severity. Routes to GPT-5.5. AI Audit Log visually shows "Escalated due to severity."
4. **Dashboard:** Present dashboard showing: 3 Incidents, 1 Memory Hit, Average Cost $0.02, AI Accuracy 98%.

## 6. Coding Standards
- Python: `black`, `isort`, strict type hinting, docstrings.
- Next.js: App router, TypeScript strict mode, no `any`.
- Error Handling: Use standard HTTP exceptions. Return graceful JSON on external service failures.
