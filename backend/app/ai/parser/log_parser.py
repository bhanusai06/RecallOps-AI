from app.ai.models.analysis_result import ParsedIncident

class LogParser:
    """
    Parses raw uploaded logs into a structured ParsedIncident.
    """
    def parse(self, raw_log: str) -> ParsedIncident:
        # Mock logic
        return ParsedIncident(
            raw_log=raw_log,
            log_source="Kubernetes",
            service="unknown-service",
            possible_language="Unknown",
            important_error_lines=["Extracted mock error"],
            stack_traces=[],
            timestamps=[]
        )
