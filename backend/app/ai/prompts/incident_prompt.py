def generate_incident_prompt(raw_log: str, memory_context: str, engineer_notes: str) -> str:
    """
    Generates the centralized prompt template for LLM analysis.
    """
    return f"""
    Analyze the following incident log and provide a structured JSON response.

    CURRENT INCIDENT LOG:
    {raw_log}

    PAST SIMILAR INCIDENTS (Hindsight Memory):
    {memory_context if memory_context else "No past incidents found."}

    ENGINEER NOTES ON PAST INCIDENTS:
    {engineer_notes if engineer_notes else "None."}

    EXPECTED JSON SCHEMA:
    {{
      "severity": "High|Medium|Low|Critical",
      "root_cause": "string",
      "summary": "string",
      "playbook": "string",
      "confidence": 0.0 to 1.0,
      "recommendation": "string",
      "risk": "string"
    }}
    """
