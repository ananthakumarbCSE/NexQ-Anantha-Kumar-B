"""Q-Edge Guardian – Pydantic schemas for video analysis."""

from pydantic import BaseModel, Field


class VehicleCounts(BaseModel):
    """Per-class vehicle counts."""

    car: int = Field(0, description="Number of cars detected")
    bus: int = Field(0, description="Number of buses detected")
    truck: int = Field(0, description="Number of trucks detected")
    motorcycle: int = Field(0, description="Number of motorcycles detected")
    bicycle: int = Field(0, description="Number of bicycles detected")
    total: int = Field(0, description="Total vehicles detected")


class DensityInfo(BaseModel):
    """Traffic density classification."""

    level: str = Field(..., description="Density level: LOW, MEDIUM, HIGH, VERY_HIGH")
    percentage: int = Field(..., ge=0, le=100, description="Density as percentage (0-100)")


class SignalRecommendation(BaseModel):
    """AI-generated signal timing recommendation."""

    lane: str = Field(..., description="Lane identifier")
    green_time: int = Field(..., description="Recommended green duration in seconds")
    reason: str = Field(..., description="Human-readable explanation")


class VideoAnalysisResponse(BaseModel):
    """Full analysis result returned by POST /api/v1/analyze/video."""

    vehicle_counts: VehicleCounts
    total_vehicles: int = Field(..., description="Total vehicles detected across sampled frames")
    density: DensityInfo
    recommendation: SignalRecommendation
    frames_processed: int = Field(..., description="Number of video frames analysed")
    inference_time_ms: float = Field(..., description="Total YOLO inference time in milliseconds")
