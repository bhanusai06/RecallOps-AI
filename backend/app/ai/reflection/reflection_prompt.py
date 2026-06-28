from app.ai.models.analysis_result import ParsedIncident, AnalysisResult

class ReflectionPromptBuilder:
    """
    Constructs the prompt required for the LLM to reflect on a completed incident.
    """
    def build_reflection_prompt(
        self, 
        incident: ParsedIncident, 
        analysis: AnalysisResult,
        engineer_notes: str = ""
    ) -> str:
        prompt = f"""
        You are a Principal AI Architect reflecting on a recently resolved incident.
        Your goal is to extract reusable operational knowledge and build a structured memory document.
        Do not retain noisy, instance-specific details (like UUIDs or specific IPs).
        Extract generalized symptoms, root causes, and playbook steps.
        
        INCIDENT:
        Service: {incident.service}
        Environment: Production
        Log: {incident.raw_log[:1000]} # Truncated for noise reduction
        
        ANALYSIS PRODUCED:
        Severity: {analysis.severity}
        Root Cause: {analysis.root_cause}
        Playbook: {analysis.playbook}
        Lessons Learned: {analysis.recommendation}
        """

        if engineer_notes and engineer_notes.lower() != "none":
            prompt += f"\n\nENGINEER OVERRIDE/NOTES:\n{engineer_notes}\n(Prioritize these notes heavily as they contain ground truth)."

        prompt += """
        
        OUTPUT FORMAT (JSON strictly matching the MemoryDocument schema):
        {
            "problem": "...",
            "observed_symptoms": ["..."],
            "root_cause": "...",
            "resolution": "...",
            "playbook": "...",
            "lessons_learned": "...",
            "confidence": 0.0 - 1.0,
            "affected_services": ["..."],
            "keywords": ["..."],
            "environment": "..."
        }
        """
        return prompt
