from typing import List
from app.ai.models.analysis_result import ParsedIncident, MemoryResult

class PromptBuilder:
    """
    Builds the final prompt combining parsed incident and retrieved memories.
    """
    def build_prompt(self, incident: ParsedIncident, memories: List[MemoryResult]) -> str:
        prompt = f"""
        You are RecallOps AI, an elite incident response assistant.
        Analyze the following incident:
        
        Log Source: {incident.log_source}
        Service: {incident.service}
        Raw Log:
        {incident.raw_log}
        """

        if memories:
            prompt += "\n\nHISTORICAL CONTEXT (HINDSIGHT MEMORY):\n"
            for mem in memories:
                prompt += f"""
                - Similarity: {mem.similarity_score}
                - Root Cause: {mem.root_cause}
                - Playbook: {mem.playbook}
                - Notes: {mem.engineer_notes}
                """
        else:
            prompt += "\n\nNo historical context found."

        prompt += "\n\nProvide a structured JSON analysis."
        return prompt
