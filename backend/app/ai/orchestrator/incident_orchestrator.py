from app.ai.parser.log_parser import LogParser
from app.ai.memory.memory_interface import IMemoryService
from app.ai.models.analysis_result import FinalIncidentReport, PipelineTiming
from app.ai.cascade.cascade_agent import CascadeflowAgentWrapper
from app.ai.cascade.prompt_adapter import PromptBuilder
from app.ai.cascade.result_mapper import ResultMapper
from app.ai.reflection.reflection_service import ReflectionService
import uuid

class IncidentOrchestrator:
    """
    Orchestrates the AI pipeline for incident analysis.
    Dependencies are injected to allow seamless replacement of mock/real integrations.
    """
    def __init__(
        self,
        memory_service: IMemoryService,
        cascade_agent: CascadeflowAgentWrapper,
        reflection_service: ReflectionService
    ):
        self.parser = LogParser()
        self.memory_service = memory_service
        self.cascade_agent = cascade_agent
        self.reflection_service = reflection_service
        self.prompt_builder = PromptBuilder()
        self.result_mapper = ResultMapper()

    async def run_incident_pipeline(self, raw_log: str) -> FinalIncidentReport:
        import time
        start_total = time.perf_counter()
        
        # 1. Parse Log
        start_parse = time.perf_counter()
        parsed_incident = self.parser.parse(raw_log)
        parser_ms = int((time.perf_counter() - start_parse) * 1000)

        # 2. Search Similar Memory
        start_memory = time.perf_counter()
        memory_results = await self.memory_service.search_similar_incidents(parsed_incident)
        memory_ms = int((time.perf_counter() - start_memory) * 1000)

        estimated_confidence = memory_results[0].similarity_score if memory_results else 0.5

        # 3. Build Final Prompt
        start_routing = time.perf_counter() # Grouping builder time under router for legacy metrics compatibility
        prompt = self.prompt_builder.build_prompt(parsed_incident, memory_results)
        
        # 4. Cascadeflow Dynamic Run (Combines Routing & LLM Execution)
        start_llm = time.perf_counter()
        cascade_result = await self.cascade_agent.execute(prompt)
        llm_ms = int((time.perf_counter() - start_llm) * 1000)
        
        router_ms = int((time.perf_counter() - start_routing) * 1000) - llm_ms

        # 5. Map Results
        routing_decision = self.result_mapper.map_routing_decision(cascade_result, estimated_confidence)
        analysis_result = self.result_mapper.map_analysis_result(cascade_result)

        # 6. Memory Reflection & Storage
        # We generate a unique ID for this execution if it gets stored
        incident_id = str(uuid.uuid4())
        memory_doc = await self.reflection_service.process_reflection(
            incident=parsed_incident,
            analysis=analysis_result
        )
        if memory_doc:
            # Send structured knowledge to Hindsight
            await self.memory_service.store_incident_memory(
                incident_id=incident_id, 
                report=memory_doc.model_dump_json()
            )
            # Inject reflection metadata into analysis_result dynamically for frontend
            analysis_result.model_metadata = {
                "memory_quality": memory_doc.memory_quality,
                "version": memory_doc.version,
                "usage_count": memory_doc.usage_count
            }

        total_ms = int((time.perf_counter() - start_total) * 1000)
        timing = PipelineTiming(
            parser_ms=parser_ms,
            memory_ms=memory_ms,
            router_ms=max(router_ms, 5),
            llm_ms=llm_ms,
            total_ms=total_ms
        )

        # 7. Return Final Analysis
        return FinalIncidentReport(
            parsed_incident=parsed_incident,
            memory_results=memory_results,
            routing_decision=routing_decision,
            analysis_result=analysis_result,
            pipeline_timing=timing
        )
