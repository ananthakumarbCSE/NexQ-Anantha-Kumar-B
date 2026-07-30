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


# ── Priority (Green Corridor) ───────────────────────────────────────

class EmergencyPriorityRequest(BaseModel):
    """Payload accepted by POST /api/v1/emergency/priority."""

    vehicle_type: str = Field(..., min_length=1, max_length=64, description="e.g. Ambulance, Fire Truck")
    lane: str = Field(..., min_length=1, max_length=32, description="Lane to grant green corridor, e.g. B")


class EmergencyPriorityResponse(BaseModel):
    """Green corridor response returned by the priority endpoint."""

    mode: str = Field(..., description="Corridor mode, e.g. GREEN_CORRIDOR")
    green_lane: str = Field(..., description="Lane that receives green signal")
    other_lanes: str = Field(..., description="Status of all other lanes")
    estimated_clearance: str = Field(..., description="Estimated time for vehicle to clear")

