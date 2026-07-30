"""Q-Edge Guardian – Pydantic schemas for TrafficSignal."""

from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────

class TrafficSignalCreate(BaseModel):
    """Payload accepted by POST /api/v1/signal."""

    lane: str = Field(..., min_length=1, max_length=32, description="Lane identifier, e.g. A")
    signal_color: str = Field(..., min_length=1, max_length=16, description="e.g. GREEN, RED, YELLOW")
    green_duration: int = Field(..., ge=1, description="Green phase duration in seconds")


# ── Response ─────────────────────────────────────────────────────────

class TrafficSignalResponse(BaseModel):
    """Single traffic signal returned to the client."""

    model_config = {"from_attributes": True}

    id: int
    lane: str
    signal_color: str
    green_duration: int
