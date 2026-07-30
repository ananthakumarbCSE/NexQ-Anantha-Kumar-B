"""Q-Edge Guardian – Quantum optimization API route."""

from fastapi import APIRouter

from app.database.database import DbSession
from app.quantum.service import QuantumService
from app.schemas.quantum import QuantumOptimizeRequest, QuantumOptimizeResponse

router = APIRouter(prefix="/quantum", tags=["Quantum"])


@router.post(
    "/optimize",
    response_model=QuantumOptimizeResponse,
    status_code=200,
    summary="Run quantum signal timing optimization",
    description=(
        "Accepts current green-phase durations for each of the four approach "
        "lanes and returns optimized timings computed by a real Qiskit quantum "
        "circuit executed on the AerSimulator. The result is persisted to the "
        "database for audit purposes."
    ),
)
def quantum_optimize(
    payload: QuantumOptimizeRequest, db: DbSession,
) -> QuantumOptimizeResponse:
    """Delegate to the quantum service layer – no logic in the router."""
    service = QuantumService(db)

    # Convert flat request fields into the dict format the optimizer expects
    timings = {
        "A": payload.lane_A,
        "B": payload.lane_B,
        "C": payload.lane_C,
        "D": payload.lane_D,
    }

    result = service.run_optimization(timings)

    return QuantumOptimizeResponse(
        current_timings=result["current_timings"],
        optimized_timings=result["optimized_timings"],
        estimated_waiting_time_reduction=result["estimated_waiting_time_reduction"],
        optimization_method=result["optimization_method"],
    )
