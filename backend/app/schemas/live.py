"""Q-Edge Guardian – Pydantic schemas for live traffic status."""

from pydantic import BaseModel, Field


class LiveStatusResponse(BaseModel):
    """Real-time traffic snapshot returned by GET /api/v1/live/status."""

    vehicles: int = Field(..., description="Current vehicle count")
    density: str = Field(..., description="Current density level")
    green_time: int = Field(..., description="Recommended green phase duration (seconds)")
    emergency: bool = Field(False, description="Whether an emergency corridor is active")
