import uuid
import logging
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.incident import Incident
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
from pydantic import BaseModel

logger = logging.getLogger("incidentmind.api.incidents")
router = APIRouter()

class VerifyRequest(BaseModel):
    status: str
    recovery_time_sec: int
    effectiveness: str
    owner: Optional[str] = None
    feedback_notes: Optional[str] = None

class IngestRequest(BaseModel):
    source: str  # "kubernetes", "prometheus", "grafana", "elastic", "github", "slack", "jira"
    payload: str
    service: Optional[str] = None
    environment: Optional[str] = "production"

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_incident(
    request: AnalyzeRequest,
    orchestrator: IncidentOrchestrator = Depends(get_incident_orchestrator),
    db: AsyncSession = Depends(get_db)
):
    logger.info("Request received")
    
    if not request.log or not request.log.strip():
        logger.error("Empty log submitted.")
        raise AppException("Log content cannot be empty.", status_code=400)

    logger.info("Starting pipeline execution")
    report = await orchestrator.run_incident_pipeline(request.log, db=db)
    logger.info("Pipeline execution complete")
    
    return AnalyzeResponse(
        incident_id=report.parsed_incident.signature.get("timestamp", str(uuid.uuid4())) if report.parsed_incident.signature else str(uuid.uuid4()),
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
            category=report.analysis_result.category,
            signature_json=report.analysis_result.signature_json,
            timeline_json=report.analysis_result.timeline_json,
            what_changed=report.analysis_result.what_changed,
            blast_radius_json=report.analysis_result.blast_radius_json,
            prevention_json=report.analysis_result.prevention_json,
            verification_status=report.analysis_result.verification_status,
            recovery_time_sec=report.analysis_result.recovery_time_sec,
            verification_effectiveness=report.analysis_result.verification_effectiveness,
            model_metadata=report.analysis_result.model_metadata
        ),
        pipeline=PipelineTimingSchema(**report.pipeline_timing.model_dump())
    )

@router.post("/ingest")
async def ingest_logs(
    request: IngestRequest,
    orchestrator: IncidentOrchestrator = Depends(get_incident_orchestrator),
    db: AsyncSession = Depends(get_db)
):
    """
    Ingests live logs/events from external platforms (Kubernetes, Prometheus, Grafana, Slack, Jira, Elastic, GitHub).
    """
    logger.info(f"Ingesting live telemetry event from {request.source}")
    
    # Prefix log with source metadata for pipeline parser context
    ingested_log = f"[{request.source.upper()} INGESTION EVENT] Env: {request.environment} | Service: {request.service or 'unknown'}\n{request.payload}"
    
    # Run log analysis pipeline
    report = await orchestrator.run_incident_pipeline(ingested_log, db=db)
    
    return {
        "status": "success",
        "source": request.source,
        "incident_id": report.parsed_incident.signature.get("timestamp", str(uuid.uuid4())) if report.parsed_incident.signature else str(uuid.uuid4()),
        "category": report.analysis_result.category,
        "root_cause": report.analysis_result.root_cause
    }

@router.get("", response_model=List[dict])
async def list_incidents(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves all persistent incidents stored in the SQLite database history.
    """
    stmt = select(Incident).order_by(Incident.created_at.desc()).offset(skip).limit(limit)
    res = await db.execute(stmt)
    incidents = res.scalars().all()
    
    records = []
    for inc in incidents:
        sig = {}
        if inc.signature_json:
            try:
                sig = json.loads(inc.signature_json)
            except:
                pass
        timeline = []
        if inc.timeline_json:
            try:
                timeline = json.loads(inc.timeline_json)
            except:
                pass
        blast = {}
        if inc.blast_radius_json:
            try:
                blast = json.loads(inc.blast_radius_json)
            except:
                pass
        prev = []
        if inc.prevention_json:
            try:
                prev = json.loads(inc.prevention_json)
            except:
                pass
        links = []
        if inc.knowledge_links:
            try:
                links = json.loads(inc.knowledge_links)
            except:
                pass
        pm = {}
        if inc.postmortem_json:
            try:
                pm = json.loads(inc.postmortem_json)
            except:
                pass
        dep = {}
        if inc.deployment_correlation_json:
            try:
                dep = json.loads(inc.deployment_correlation_json)
            except:
                pass
        collab = {}
        if inc.collaboration_notes_json:
            try:
                collab = json.loads(inc.collaboration_notes_json)
            except:
                pass
        feedback = {}
        if inc.feedback_json:
            try:
                feedback = json.loads(inc.feedback_json)
            except:
                pass

        records.append({
            "id": inc.id,
            "title": inc.title,
            "status": inc.status.value,
            "created_at": inc.created_at.isoformat(),
            "category": inc.category,
            "root_cause": inc.root_cause,
            "environment": inc.environment,
            "severity": inc.severity,
            "signature": sig,
            "timeline": timeline,
            "blast_radius": blast,
            "prevention": prev,
            "verification_status": inc.verification_status,
            "recovery_time_sec": inc.recovery_time_sec,
            "verification_effectiveness": inc.verification_effectiveness,
            "knowledge_links": links,
            "owner": inc.owner or collab.get("owner", "Unassigned"),
            "postmortem": pm,
            "runbook": inc.runbook_markdown or "",
            "deployment_correlation": dep,
            "collaboration_notes": collab,
            "feedback": feedback
        })
    return records

@router.get("/{incident_id}/postmortem")
async def get_postmortem(
    incident_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Incident).filter(Incident.id == incident_id)
    res = await db.execute(stmt)
    inc = res.scalars().first()
    if not inc:
        raise AppException("Incident not found.", status_code=404)
        
    pm = {}
    if inc.postmortem_json:
        try:
            pm = json.loads(inc.postmortem_json)
        except:
            pass
    return pm

@router.get("/{incident_id}/runbook")
async def get_runbook(
    incident_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Incident).filter(Incident.id == incident_id)
    res = await db.execute(stmt)
    inc = res.scalars().first()
    if not inc:
        raise AppException("Incident not found.", status_code=404)
    return {"runbook": inc.runbook_markdown or ""}

@router.post("/{incident_id}/verify")
async def verify_incident(
    incident_id: str,
    payload: VerifyRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Verifies the incident recovery metrics and stores the feedback loop review.
    """
    stmt = select(Incident).filter(Incident.id == incident_id)
    res = await db.execute(stmt)
    incident = res.scalars().first()
    
    if not incident:
        raise AppException("Incident not found.", status_code=404)
        
    incident.verification_status = payload.status
    incident.recovery_time_sec = payload.recovery_time_sec
    incident.verification_effectiveness = payload.effectiveness
    
    if payload.owner:
        incident.owner = payload.owner
        
    # Store feedback details
    fb_data = {
        "status": payload.status,
        "effectiveness": payload.effectiveness,
        "recovery_time_sec": payload.recovery_time_sec,
        "owner": payload.owner,
        "notes": payload.feedback_notes or "RCA verified successfully."
    }
    incident.feedback_json = json.dumps(fb_data)
    
    await db.commit()
    return {
        "status": "success",
        "incident_id": incident_id,
        "verification_status": incident.verification_status,
        "recovery_time_sec": incident.recovery_time_sec,
        "verification_effectiveness": incident.verification_effectiveness,
        "owner": incident.owner
    }
