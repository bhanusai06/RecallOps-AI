# System Architecture

RecallOps AI is built around a centralized AI orchestration pipeline that intercepts incoming logs, searches for historical context, makes intelligent routing decisions, and reflects on the outcome to store improved memories.

## Core Flow

1. **Incident Intake:** Raw string logs are received via the FastAPI endpoint `/api/v1/incidents/analyze`.
2. **Log Parser:** Extracts critical error lines, stack traces, and timestamps to formulate a structured incident.
3. **Memory Search (Hindsight):** Searches the Hindsight vector engine for similar past incidents to provide context.
4. **Prompt Builder:** Combines the parsed incident and historical context into a dense system prompt.
5. **Intelligent Router (CascadeAgent):** Uses the `cascadeflow` SDK to route the prompt to either a premium or cheap model depending on the confidence of the memory match.
6. **Reflection Engine:** Evaluates the generated playbook and maps it to a `memory_quality` score before saving it.
7. **Dashboard:** The Next.js frontend visually animates this entire pipeline for the user.

---

## 1. Log Parser (`app.ai.parser.log_parser`)
**Responsibility:** Transforms noisy, unstructured logs into a highly structured `ParsedIncident` model.
**Details:**
* Uses regex to identify timestamps, standard error prefixes (e.g., `Exception:`, `ERROR:`), and potential languages.
* Isolates the specific line causing the crash, ignoring boilerplate stack trace frames.

## 2. Hindsight Memory (`app.ai.memory.hindsight_memory_service`)
**Responsibility:** Acts as the long-term, non-ephemeral memory bank of the AI.
**Details:**
* Integrates directly with the `hindsight` SDK.
* Performs semantic vector search on historical incidents.
* Maps Hindsight's native responses into our domain-specific `MemoryResult` schema.
* Handles graceful degradation (returning empty arrays if the database is locked or offline).

## 3. Prompt Builder (`app.ai.cascade.prompt_adapter`)
**Responsibility:** Constructs the final system and user prompts sent to the LLM.
**Details:**
* If Hindsight returns high-confidence matches, the prompt focuses on *adapting* the historical playbook to the current context.
* If Hindsight returns nothing, the prompt instructs the LLM to perform *deep reasoning* from scratch.
* Enforces strict JSON output schema formatting.

## 4. CascadeAgent (`app.ai.cascade.cascade_agent`)
**Responsibility:** Executes the LLM query while enforcing cost budgets and dynamic routing.
**Details:**
* Initializes the `cascadeflow.CascadeAgent` with multiple `ModelConfig` objects.
* If the prompt implies high historical confidence, the agent naturally favors `gemini-flash` (or similar cheap models).
* If the prompt requires deep reasoning, it favors `gpt-4-turbo` (or similar premium models).
* Automatically falls back and maps results cleanly in case of budget exhaustion.

## 5. Reflection Engine (`app.ai.reflection.reflection_service`)
**Responsibility:** Evaluates AI responses before they become permanent memories.
**Details:**
* An asynchronous service that evaluates the `AnalysisResult` against the `ParsedIncident`.
* Calculates a `memory_quality` score based on heuristic checks:
  * **Specificity:** Are there distinct playbook steps?
  * **Confidence:** Did the LLM express high confidence in its root cause?
* Increments usage counters and versions for duplicate incidents, preventing vector database bloat.

## 6. Frontend Dashboard (`frontend/src/app`)
**Responsibility:** Visualizes the backend processing states.
**Details:**
* Next.js 14 App Router application.
* Uses Framer Motion to stagger the appearance of the Analysis, Routing, and Memory cards, simulating the real-time processing of the pipeline.
* Built-in resilience: In demo scenarios, it contains a fallback mechanism to render static data if the backend is unreachable.
