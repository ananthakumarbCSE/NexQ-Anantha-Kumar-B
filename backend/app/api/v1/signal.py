"""Q-Edge Guardian – Signal API endpoints."""

from fastapi import APIRouter

from app.database.database import DbSession
from app.schemas.signal import TrafficSignalCreate, TrafficSignalResponse
from app.services.signal_service import SignalService

router = APIRouter(prefix="/signal", tags=["Signal"])


@router.post(
    "",
    response_model=TrafficSignalResponse,
    status_code=201,
    summary="Create a traffic signal",
    description="Register a new traffic signal configuration for a given lane.",
)
def create_signal(payload: TrafficSignalCreate, db: DbSession) -> TrafficSignalResponse:
    service = SignalService(db)
    return service.create_signal(payload)


@router.get(
    "",
    response_model=list[TrafficSignalResponse],
    summary="List all traffic signals",
    description="Return every traffic signal stored in the database, ordered by lane.",
)
def list_signals(db: DbSession) -> list[TrafficSignalResponse]:
    service = SignalService(db)
    return service.get_all_signals()
