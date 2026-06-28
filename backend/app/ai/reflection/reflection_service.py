import logging
from typing import Optional
from app.ai.models.analysis_result import ParsedIncident, AnalysisResult
from app.ai.reflection.reflection_models import MemoryDocument
from app.ai.reflection.reflection_prompt import ReflectionPromptBuilder
from app.ai.reflection.reflection_mapper import ReflectionMapper
from app.ai.reflection.memory_compressor import MemoryCompressor

logger = logging.getLogger(__name__)

class ReflectionService:
    """
    Orchestrates the reflection phase to extract reusable knowledge from raw incidents.
    This service operates independently of Cascadeflow.
    """
    def __init__(self, llm_callable=None):
        self.prompt_builder = ReflectionPromptBuilder()
        self.mapper = ReflectionMapper()
        self.compressor = MemoryCompressor()
        # Allows dependency injection of a basic LLM call just for reflection extraction
        # If none provided, we will mock the reflection LLM output for the foundation setup
        self.llm_callable = llm_callable

    def score_memory_quality(self, doc: MemoryDocument) -> int:
        """
        Evaluates memory quality from 0 to 100 based on novelty, confidence, and specificity.
        """
        score = 50  # Base score
        
        # Confidence boosts score
        score += int(doc.confidence * 20)
        
        # Specificity boosts score (having multiple symptoms)
        if len(doc.observed_symptoms) > 1:
            score += 10
            
        # Reusability (clear playbook)
        if len(doc.playbook) > 20:
            score += 10
            
        # Novelty (lessons learned provided)
        if doc.lessons_learned and len(doc.lessons_learned) > 10:
            score += 10

        return min(100, max(0, score))

    def should_store(self, doc: MemoryDocument) -> tuple[bool, str]:
        """
        Determines whether the memory is high quality enough to pollute the Hindsight index.
        """
        if doc.confidence < 0.4:
            return False, "Low confidence memory rejected."
        
        if doc.memory_quality < 40:
            return False, "Memory quality too low to be useful."
            
        return True, "Approved for Hindsight storage."

    async def process_reflection(
        self, 
        incident: ParsedIncident, 
        analysis: AnalysisResult,
        engineer_notes: str = ""
    ) -> Optional[MemoryDocument]:
        """
        Main execution flow: Prompt -> Extract -> Compress -> Score -> Decide.
        """
        # 1. Build prompt
        prompt = self.prompt_builder.build_reflection_prompt(incident, analysis, engineer_notes)
        
        # 2. Call LLM
        if self.llm_callable:
            llm_output = await self.llm_callable(prompt)
        else:
            # Mock the extraction for foundation if no API keys exist
            logger.info("No reflection LLM provided. Using mock reflection extraction.")
            import json
            mock_data = {
                "problem": analysis.summary,
                "observed_symptoms": [str(line) for line in incident.important_error_lines],
                "root_cause": analysis.root_cause,
                "resolution": "Applied standard fix.",
                "playbook": analysis.playbook,
                "lessons_learned": analysis.recommendation,
                "confidence": analysis.confidence,
                "affected_services": [incident.service],
                "keywords": [incident.log_source, "error"],
                "environment": "production"
            }
            llm_output = json.dumps(mock_data)

        # 3. Map to structured document
        doc = self.mapper.parse_reflection(llm_output)
        if not doc:
            return None

        # 4. Compress
        doc = self.compressor.compress(doc)

        # 5. Score Quality
        doc.memory_quality = self.score_memory_quality(doc)

        # 6. Should Store?
        store, reason = self.should_store(doc)
        if not store:
            logger.info(f"Memory discarded: {reason}")
            return None

        # Return document ready for Hindsight
        logger.info(f"Memory finalized with quality score: {doc.memory_quality}")
        return doc
