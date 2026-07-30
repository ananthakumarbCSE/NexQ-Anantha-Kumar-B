"""Q-Edge Guardian – Pydantic schemas for EmergencyEvent."""

from datetime import datetime

from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────

class EmergencyEventCreate(BaseModel):
    """Payload accepted by POST /api/v1/emergency."""

    vehicle_type: str = Field(..., min_length=1, max_length=64, description="e.g. Ambulance, Fire Truck")
    location: str = Field(..., min_length=1, max_length=128, description="e.g. Lane A")


# ── Response ─────────────────────────────────────────────────────────

class EmergencyEventResponse(BaseModel):
    """Single emergency event returned to the client."""

    model_config = {"from_attributes": True}

    id: int
    timestamp: datetime
    vehicle_type: str
    status: str
    location: str
