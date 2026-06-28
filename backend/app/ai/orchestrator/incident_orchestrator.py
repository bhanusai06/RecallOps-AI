from app.ai.parser.log_parser import LogParser
from app.ai.memory.memory_interface import IMemoryService
from app.ai.models.analysis_result import FinalIncidentReport, PipelineTiming
from app.ai.cascade.cascade_agent import CascadeflowAgentWrapper
from app.ai.cascade.prompt_adapter import PromptBuilder
from app.ai.cascade.result_mapper import ResultMapper
from app.ai.reflection.reflection_service import ReflectionService
from app.ai.analytics.incident_classifier import IncidentClassifier
from app.ai.analytics.signature_extractor import SignatureExtractor
from app.ai.analytics.timeline_reconstructor import TimelineReconstructor
from app.ai.analytics.change_detector import ChangeDetector
from app.ai.analytics.blast_radius import BlastRadiusMapper
from app.ai.analytics.preventive_ai import PreventiveAI
import uuid
import logging

logger = logging.getLogger("incidentmind.ai.orchestrator")

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
        
        # Instantiate analytic and intelligence engines
        self.classifier = IncidentClassifier()
        self.extractor = SignatureExtractor()
        self.timeline_reconstructor = TimelineReconstructor()
        self.change_detector = ChangeDetector()
        self.blast_mapper = BlastRadiusMapper()
        self.preventive_ai = PreventiveAI()

    async def run_incident_pipeline(self, raw_log: str, db = None) -> FinalIncidentReport:
        import time
        import json
        start_total = time.perf_counter()
        
        # 1. Parse Log
        start_parse = time.perf_counter()
        parsed_incident = self.parser.parse(raw_log)
        
        # Inject classification & signature extraction
        parsed_incident.category = self.classifier.classify(raw_log)
        parsed_incident.signature = self.extractor.extract_signature(
            raw_log, 
            default_env="production", 
            default_service=parsed_incident.service
        )
        
        parser_ms = int((time.perf_counter() - start_parse) * 1000)

        # 2. Search Similar Memory (weighted scoring + hard filters)
        start_memory = time.perf_counter()
        memory_results = await self.memory_service.search_similar_incidents(parsed_incident, db=db)
        memory_ms = int((time.perf_counter() - start_memory) * 1000)

        estimated_confidence = memory_results[0].similarity_score if memory_results else 0.5

        # 3. Build Final Prompt
        start_routing = time.perf_counter()
        prompt = self.prompt_builder.build_prompt(parsed_incident, memory_results)
        
        # 4. Cascadeflow Dynamic Run (Combines Routing & LLM Execution)
        start_llm = time.perf_counter()
        cascade_result = await self.cascade_agent.execute(prompt)
        llm_ms = int((time.perf_counter() - start_llm) * 1000)
        
        router_ms = int((time.perf_counter() - start_routing) * 1000) - llm_ms

        # 5. Map Results
        routing_decision = self.result_mapper.map_routing_decision(cascade_result, estimated_confidence)
        analysis_result = self.result_mapper.map_analysis_result(cascade_result)

        # 6. Reconstruct Timeline, What Changed, Blast Radius, and Preventive AI
        analysis_result.category = parsed_incident.category
        analysis_result.signature_json = parsed_incident.signature
        analysis_result.timeline_json = self.timeline_reconstructor.reconstruct_timeline(
            raw_log, 
            parsed_incident.category
        )
        analysis_result.what_changed = self.change_detector.detect_changes(
            parsed_incident.signature.get("affected_service", "unknown"),
            parsed_incident.category
        )
        analysis_result.blast_radius_json = self.blast_mapper.map_blast_radius(
            parsed_incident.signature.get("affected_service", "unknown"),
            parsed_incident.category
        )
        analysis_result.prevention_json = self.preventive_ai.generate_recommendations(
            parsed_incident.category,
            parsed_incident.signature.get("affected_service", "unknown")
        )

        # 7. Memory Reflection & Storage
        incident_id = str(uuid.uuid4())
        memory_doc = await self.reflection_service.process_reflection(
            incident=parsed_incident,
            analysis=analysis_result
        )
        
        if memory_doc:
            await self.memory_service.store_incident_memory(
                incident_id=incident_id, 
                report=memory_doc.model_dump_json()
            )
            analysis_result.model_metadata = {
                "memory_quality": memory_doc.memory_quality,
                "version": memory_doc.version,
                "usage_count": memory_doc.usage_count
            }

        # 8. Persist fully analyzed incident to local SQLite database
        if db:
            try:
                from app.models.incident import Incident, IncidentStatus, UploadedLog, Resolution
                
                # Check for environment
                db_env = parsed_incident.signature.get("environment", "production")
                
                new_inc = Incident(
                    id=incident_id,
                    status=IncidentStatus.RESOLVED,
                    title=f"Incident {parsed_incident.category} in {parsed_incident.signature.get('affected_service', 'unknown')}",
                    category=parsed_incident.category,
                    root_cause=analysis_result.root_cause,
                    environment=db_env,
                    severity=analysis_result.severity,
                    signature_json=json.dumps(parsed_incident.signature),
                    timeline_json=json.dumps(analysis_result.timeline_json),
                    blast_radius_json=json.dumps(analysis_result.blast_radius_json),
                    prevention_json=json.dumps(analysis_result.prevention_json),
                    verification_status="Unverified"
                )
                db.add(new_inc)
                
                db_log = UploadedLog(incident_id=incident_id, raw_content=raw_log)
                db.add(db_log)
                
                db_res = Resolution(
                    incident_id=incident_id,
                    root_cause=analysis_result.root_cause,
                    severity=analysis_result.severity,
                    confidence_score=int(analysis_result.confidence * 100)
                )
                db.add(db_res)
                
                await db.commit()
                logger.info(f"Successfully persisted incident {incident_id} to database.")
            except Exception as db_err:
                logger.error(f"Failed to persist incident in database: {db_err}")
                await db.rollback()

        total_ms = int((time.perf_counter() - start_total) * 1000)
        timing = PipelineTiming(
            parser_ms=parser_ms,
            memory_ms=memory_ms,
            router_ms=max(router_ms, 5),
            llm_ms=llm_ms,
            total_ms=total_ms
        )

        return FinalIncidentReport(
            parsed_incident=parsed_incident,
            memory_results=memory_results,
            routing_decision=routing_decision,
            analysis_result=analysis_result,
            pipeline_timing=timing
        )
