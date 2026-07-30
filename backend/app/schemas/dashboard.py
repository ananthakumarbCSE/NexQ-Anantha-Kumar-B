"""Q-Edge Guardian – Pydantic schemas for the dashboard endpoint."""

from pydantic import BaseModel, Field


class DashboardResponse(BaseModel):
    """Aggregate stats returned by GET /api/v1/dashboard."""

    active_signals: int = Field(..., description="Number of traffic signals in the database")
    traffic_records: int = Field(..., description="Total traffic snapshots recorded")
    emergency_events: int = Field(..., description="Total emergency events logged")
