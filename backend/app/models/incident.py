import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.models.base import Base

class IncidentStatus(str, enum.Enum):
    UPLOADED = "UPLOADED"
    PARSED = "PARSED"
    MEMORY_SEARCH = "MEMORY_SEARCH"
    AI_ANALYSIS = "AI_ANALYSIS"
    HUMAN_REVIEW = "HUMAN_REVIEW"
    RESOLVED = "RESOLVED"
    STORED = "STORED"
    ARCHIVED = "ARCHIVED"

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(Enum(IncidentStatus), default=IncidentStatus.UPLOADED, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # New analytics & verification fields
    title = Column(String, nullable=True)
    category = Column(String, nullable=True)
    root_cause = Column(String, nullable=True)
    environment = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    signature_json = Column(String, nullable=True)
    embedding_vector = Column(String, nullable=True)
    timeline_json = Column(String, nullable=True)
    blast_radius_json = Column(String, nullable=True)
    prevention_json = Column(String, nullable=True)
    verification_status = Column(String, default="Unverified", nullable=True)
    recovery_time_sec = Column(Integer, nullable=True)
    verification_effectiveness = Column(String, nullable=True)
    
    uploaded_log = relationship("UploadedLog", back_populates="incident", uselist=False)
    resolution = relationship("Resolution", back_populates="incident", uselist=False)
    notes = relationship("EngineerNote", back_populates="incident")
    audit = relationship("AIAudit", back_populates="incident", uselist=False)

class UploadedLog(Base):
    __tablename__ = "uploaded_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False, unique=True)
    raw_content = Column(String, nullable=False)
    parsed_json = Column(String, nullable=True)
    
    incident = relationship("Incident", back_populates="uploaded_log")

class Resolution(Base):
    __tablename__ = "resolutions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False, unique=True)
    root_cause = Column(String, nullable=True)
    confidence_score = Column(Integer, nullable=True)
    severity = Column(String, nullable=True)
    
    incident = relationship("Incident", back_populates="resolution")
    playbook = relationship("Playbook", back_populates="resolution", uselist=False)

class Playbook(Base):
    __tablename__ = "playbooks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resolution_id = Column(String, ForeignKey("resolutions.id"), nullable=False, unique=True)
    steps = Column(String, nullable=False)
    
    resolution = relationship("Resolution", back_populates="playbook")

class EngineerNote(Base):
    __tablename__ = "engineer_notes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    content = Column(String, nullable=False)
    
    incident = relationship("Incident", back_populates="notes")

class AIAudit(Base):
    __tablename__ = "ai_audits"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False, unique=True)
    routing_reason = Column(String, nullable=True)
    
    incident = relationship("Incident", back_populates="audit")
