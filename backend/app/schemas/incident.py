from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.incident import IncidentStatus

class UploadedLogBase(BaseModel):
    raw_content: str
    parsed_json: Optional[str] = None

class ResolutionBase(BaseModel):
    root_cause: Optional[str] = None
    confidence_score: Optional[int] = None
    severity: Optional[str] = None

class PlaybookBase(BaseModel):
    steps: str

class EngineerNoteBase(BaseModel):
    content: str

class AIAuditBase(BaseModel):
    routing_reason: Optional[str] = None

class IncidentBase(BaseModel):
    status: IncidentStatus = IncidentStatus.UPLOADED

class IncidentCreate(IncidentBase):
    pass

class IncidentResponse(IncidentBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
