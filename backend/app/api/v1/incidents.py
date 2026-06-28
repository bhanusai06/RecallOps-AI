import uuid
import logging
from fastapi import APIRouter, Depends
from app.schemas.orchestrator import (
    AnalyzeRequest, 
    AnalyzeResponse, 
    MemorySchema, 
    RoutingSchema, 
    AnalysisSchema, 
    PipelineTimingSchema, 
    MemoryMatchSchema
)
from app.core.dependencies import get_incident_orchestrator
from app.ai.orchestrator.incident_orchestrator import IncidentOrchestrator
from app.core.exceptions import AppException

logger = logging.getLogger("incidentmind.api.incidents")
router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_incident(
    request: AnalyzeRequest,
    orchestrator: IncidentOrchestrator = Depends(get_incident_orchestrator)
):
    logger.info("Request received")
    
    if not request.log or not request.log.strip():
        logger.error("Empty log submitted.")
        raise AppException("Log content cannot be empty.", status_code=400)

    logger.info("Starting pipeline execution")
    
    # Run Orchestrator Pipeline
    report = await orchestrator.run_incident_pipeline(request.log)
    
    logger.info("Pipeline execution complete")
    
    # Map to expected AnalyzeResponse schema
    return AnalyzeResponse(
        incident_id=str(uuid.uuid4()),
        parsed_incident=report.parsed_incident.model_dump(),
        memory=MemorySchema(
            matches=[MemoryMatchSchema(**m.model_dump()) for m in report.memory_results],
            confidence=report.memory_results[0].similarity_score if report.memory_results else 0.5
        ),
        routing=RoutingSchema(
            selected_model=report.routing_decision.selected_model,
            reason=report.routing_decision.reason,
            estimated_cost=report.routing_decision.estimated_cost,
            estimated_latency=report.routing_decision.estimated_latency
        ),
        analysis=AnalysisSchema(
            severity=report.analysis_result.severity,
            root_cause=report.analysis_result.root_cause,
            summary=report.analysis_result.summary,
            playbook=report.analysis_result.playbook,
            confidence=report.analysis_result.confidence,
            recommendation=report.analysis_result.recommendation,
            risk=report.analysis_result.risk,
            model_metadata=report.analysis_result.model_metadata
        ),
        pipeline=PipelineTimingSchema(**report.pipeline_timing.model_dump())
    )
