"""Q-Edge Guardian – Pydantic schemas for TrafficRecord."""

from datetime import datetime

from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────

class TrafficRecordCreate(BaseModel):
    """Payload accepted by POST /api/v1/traffic."""

    vehicle_count: int = Field(..., ge=0, description="Number of vehicles detected")
    congestion_level: str = Field(..., min_length=1, max_length=32, description="e.g. Low, Medium, High")


# ── Response ─────────────────────────────────────────────────────────

class TrafficRecordResponse(BaseModel):
    """Single traffic record returned to the client."""

    model_config = {"from_attributes": True}

    id: int
    timestamp: datetime
    vehicle_count: int
    congestion_level: str
    recommendation: str
