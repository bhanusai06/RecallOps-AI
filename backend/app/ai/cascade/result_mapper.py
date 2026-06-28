import json
import logging
from typing import Optional
from cascadeflow import CascadeResult
from app.ai.models.analysis_result import RoutingDecision, AnalysisResult

logger = logging.getLogger(__name__)

class ResultMapper:
    """
    Translates the native Cascadeflow result schema back into the
    domain schemas expected by the FastAPI responses and Dashboard.
    """
    def map_routing_decision(self, result: Optional[CascadeResult], confidence: float = 0.8) -> RoutingDecision:
        if not result:
            return RoutingDecision(
                selected_model="fallback-model",
                reason="Cascadeflow execution failed. Used safe fallback.",
                estimated_cost=0.0,
                estimated_latency=0.0,
                confidence=confidence
            )

        return RoutingDecision(
            selected_model=result.model_used,
            reason=getattr(result, "reason", "Selected by cascadeflow runtime intelligence."),
            estimated_cost=result.total_cost,
            estimated_latency=result.latency_ms / 1000.0, # ms to seconds
            confidence=confidence
        )

    def map_analysis_result(self, result: Optional[CascadeResult]) -> AnalysisResult:
        if not result:
            return AnalysisResult(
                severity="critical",
                root_cause="Unknown. Cascadeflow execution failed.",
                summary="The AI execution harness failed to process the request.",
                playbook="Manual intervention required.",
                confidence=0.0,
                recommendation="Investigate the cascadeflow integration.",
                risk="High"
            )

        # In a real scenario, CascadeResult.content would be parsed into JSON
        # Since we might get plain text from the real execution if not strictly json constrained,
        # we try to parse it, else provide a fallback wrapper.
        try:
            # We assume cascadeflow returns a JSON formatted string because we requested it
            # Or we mock it since we can't reliably parse raw strings if the model didn't obey
            content = result.content
            parsed = json.loads(content)
            return AnalysisResult(**parsed)
        except Exception as e:
            logger.warning(f"Failed to parse cascadeflow result as JSON: {e}")
            return AnalysisResult(
                severity="high",
                root_cause="Cascadeflow analysis completed.",
                summary=str(result.content)[:500],
                playbook="Review raw logs.",
                confidence=0.8,
                recommendation="Check the cascadeflow raw text output.",
                risk="Medium"
            )
