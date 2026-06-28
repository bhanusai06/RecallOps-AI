# Software Architecture Document (SAD): IncidentMind AI

## 1. Components
1. **Frontend:** Next.js, Tailwind CSS, shadcn/ui.
2. **Backend API:** FastAPI.
3. **Memory Engine:** Hindsight integration layer.
4. **Router Engine:** cascadeflow integration layer.
5. **AI Engine:** Prompt management and LLM parsing.
6. **Analytics Engine:** Aggregates DB metrics.
7. **Database:** PostgreSQL.

## 2. Folder Structure
```text
incident-intelligence/
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/
│   ├── api/
│   ├── services/
│   ├── memory/
│   ├── router/
│   ├── llm/
│   ├── database/
│   └── analytics/
├── prompts/
│   ├── incident_analysis.md
│   ├── memory_retrieval.md
│   ├── playbook_generation.md
│   ├── severity_detection.md
│   ├── routing.md
│   └── summary.md
├── docs/
└── tests/
```

## 3. Database Schema (PostgreSQL)
Expanded for flexibility and cleaner relationships.

```mermaid
erDiagram
    Incident {
        string id PK
        string status
        timestamp created_at
    }
    UploadedLog {
        string id PK
        string incident_id FK
        string raw_content
        string parsed_json
    }
    MemoryRecord {
        string id PK
        string incident_id FK
        string vector_id
        timestamp stored_at
    }
    SimilarIncident {
        string id PK
        string current_incident_id FK
        string past_incident_id FK
        float similarity_score
    }
    Resolution {
        string id PK
        string incident_id FK
        string root_cause
        int confidence_score
        string severity
    }
    Playbook {
        string id PK
        string resolution_id FK
        string steps
    }
    EngineerNote {
        string id PK
        string incident_id FK
        string content
    }
    AIAudit {
        string id PK
        string incident_id FK
        string routing_reason
    }
    ModelUsage {
        string id PK
        string audit_id FK
        string model_name
        int tokens
        float latency_ms
        float cost
    }
    AnalyticsSnapshot {
        string id PK
        date snapshot_date
        int total_incidents
        float avg_mttr
    }
    
    Incident ||--o| UploadedLog : has
    Incident ||--o| MemoryRecord : stores
    Incident ||--o{ SimilarIncident : finds
    Incident ||--o| Resolution : has
    Resolution ||--o| Playbook : recommends
    Incident ||--o{ EngineerNote : has
    Incident ||--o| AIAudit : tracks
    AIAudit ||--o| ModelUsage : consumes
```

## 4. API Design (Contracts)
Around 12-15 focused endpoints.

- **Incident Management**
  - `POST /api/v1/incident/upload` - Upload log file/text.
  - `POST /api/v1/incident/analyze` - Trigger AI analysis pipeline.
  - `GET /api/v1/incident/{id}` - Get full incident details.
  - `GET /api/v1/incident/history` - List past incidents (paginated).
  - `GET /api/v1/incident/{id}/similar` - Get similar incidents from DB.
  - `PATCH /api/v1/incident/{id}/status` - Update state machine status.

- **Memory (Hindsight)**
  - `POST /api/v1/memory/store` - Manually trigger storing an RCA to memory.
  - `GET /api/v1/memory/search` - Direct semantic search endpoint.

- **Playbook & Feedback**
  - `GET /api/v1/playbook/{id}` - Get playbook steps.
  - `POST /api/v1/feedback` - Engineer notes/feedback on AI accuracy.

- **Analytics**
  - `GET /api/v1/analytics/dashboard` - High-level metrics.
  - `GET /api/v1/analytics/cost` - Cost aggregation.
  - `GET /api/v1/analytics/models` - Model usage breakdown.

## 5. Sequence Diagrams

### 5.1 Incident Analysis Flow
```mermaid
sequenceDiagram
    participant User
    participant API
    participant Hindsight
    participant cascadeflow
    participant LLM
    participant DB

    User->>API: Upload Log
    API->>DB: Store UploadedLog (Status: UPLOADED)
    API->>Hindsight: Search similar logs
    Hindsight-->>API: Return Top 3 matches
    API->>DB: Store SimilarIncident records (Status: MEMORY_SEARCH)
    API->>cascadeflow: Request Routing (Log + Matches)
    cascadeflow->>cascadeflow: Estimate Complexity
    cascadeflow->>LLM: Choose Model (e.g., Gemini)
    LLM-->>cascadeflow: JSON RCA + Playbook
    cascadeflow-->>API: Result + Audit Data
    API->>DB: Store Resolution, Playbook, AIAudit (Status: AI_ANALYSIS)
    API-->>User: Return RCA + Playbook
```

### 5.2 Memory Learning Flow
```mermaid
sequenceDiagram
    participant Engineer
    participant API
    participant DB
    participant Hindsight

    Engineer->>API: Mark Incident Resolved & Add Notes
    API->>DB: Update Status to RESOLVED
    API->>DB: Store EngineerNote
    API->>Hindsight: Embed Log + RCA + Playbook + Notes
    Hindsight-->>API: Vector ID confirmed
    API->>DB: Store MemoryRecord (Status: STORED)
    API-->>Engineer: Acknowledged
```

### 5.3 cascadeflow Routing Flow
```mermaid
sequenceDiagram
    participant API
    participant cascadeflow
    participant Gemini Flash
    participant GPT-5.5
    participant DB

    API->>cascadeflow: Route Incident Analysis
    cascadeflow->>cascadeflow: Evaluate Rules (Budget, Complexity)
    cascadeflow->>Gemini Flash: Try simple model
    Gemini Flash-->>cascadeflow: Confidence 85%
    cascadeflow->>cascadeflow: Check Threshold (>90%)
    alt Confidence Low
        cascadeflow->>GPT-5.5: Escalate
        GPT-5.5-->>cascadeflow: High Confidence RCA
        cascadeflow->>DB: Log Audit (Escalated, GPT-5.5)
    else Confidence High
        cascadeflow->>DB: Log Audit (Gemini Flash)
    end
    cascadeflow-->>API: Final RCA
```

## 6. Deployment
- **Frontend:** Vercel (Next.js).
- **Backend:** Render or Railway (FastAPI).
- **Database:** Supabase (PostgreSQL).
- **Memory:** Hindsight Cloud.
