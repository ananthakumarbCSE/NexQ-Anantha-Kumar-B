"""Q-Edge Guardian – Pydantic schemas for system status."""

from pydantic import BaseModel, Field


class SystemStatusResponse(BaseModel):
    """System health and performance metrics returned by GET /api/v1/system."""

    yolo_loaded: bool = Field(..., description="Whether the YOLO model is loaded and ready")
    model_name: str = Field(..., description="Name of the loaded YOLO model")
    database_connected: bool = Field(..., description="Whether the database is reachable")
    inference_time_ms: float = Field(0.0, description="Last YOLO inference time in milliseconds")
