import json
import logging
from typing import Optional
from app.ai.reflection.reflection_models import MemoryDocument

logger = logging.getLogger(__name__)

class ReflectionMapper:
    """
    Parses LLM JSON output into a validated MemoryDocument.
    """
    def parse_reflection(self, llm_output: str) -> Optional[MemoryDocument]:
        try:
            # Simple extraction strategy (in prod, use regex to find JSON blocks if surrounded by markdown)
            start_idx = llm_output.find("{")
            end_idx = llm_output.rfind("}")
            if start_idx != -1 and end_idx != -1:
                json_str = llm_output[start_idx:end_idx+1]
                parsed = json.loads(json_str)
                return MemoryDocument(**parsed)
            return None
        except Exception as e:
            logger.error(f"Failed to parse reflection output: {e}")
            return None
