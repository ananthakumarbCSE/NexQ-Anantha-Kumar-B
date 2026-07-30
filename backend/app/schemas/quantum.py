"""Q-Edge Guardian – Pydantic schemas for the quantum optimization API."""

from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────


class QuantumOptimizeRequest(BaseModel):
    """Payload accepted by POST /api/v1/quantum/optimize."""

    lane_A: int = Field(
        ..., ge=5, le=120, description="Current green-phase duration for Lane A (seconds)",
    )
    lane_B: int = Field(
        ..., ge=5, le=120, description="Current green-phase duration for Lane B (seconds)",
    )
    lane_C: int = Field(
        ..., ge=5, le=120, description="Current green-phase duration for Lane C (seconds)",
    )
    lane_D: int = Field(
        ..., ge=5, le=120, description="Current green-phase duration for Lane D (seconds)",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "lane_A": 35,
                    "lane_B": 15,
                    "lane_C": 50,
                    "lane_D": 20,
                }
            ]
        }
    }


# ── Response ─────────────────────────────────────────────────────────


class LaneTimings(BaseModel):
    """Green-phase durations keyed by lane label."""

    A: int = Field(..., description="Green-phase duration for Lane A (seconds)")
    B: int = Field(..., description="Green-phase duration for Lane B (seconds)")
    C: int = Field(..., description="Green-phase duration for Lane C (seconds)")
    D: int = Field(..., description="Green-phase duration for Lane D (seconds)")


class QuantumOptimizeResponse(BaseModel):
    """Result returned by the quantum optimization endpoint."""

    current_timings: LaneTimings
    optimized_timings: LaneTimings
    estimated_waiting_time_reduction: float = Field(
        ..., description="Estimated reduction in average waiting time (%)",
    )
    optimization_method: str = Field(
        ..., description="Description of the quantum method used",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "current_timings": {"A": 35, "B": 15, "C": 50, "D": 20},
                    "optimized_timings": {"A": 30, "B": 20, "C": 40, "D": 30},
                    "estimated_waiting_time_reduction": 18.0,
                    "optimization_method": "Qiskit AerSimulator (4-qubit Ry+CX circuit, 1024 shots)",
                }
            ]
        }
    }
