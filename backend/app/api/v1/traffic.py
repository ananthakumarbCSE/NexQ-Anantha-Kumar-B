"""Q-Edge Guardian – Traffic API endpoints."""

from fastapi import APIRouter

from app.database.database import DbSession
from app.schemas.traffic import TrafficRecordCreate, TrafficRecordResponse
from app.services.traffic_service import TrafficService

router = APIRouter(prefix="/traffic", tags=["Traffic"])


@router.post(
    "",
    response_model=TrafficRecordResponse,
    status_code=201,
    summary="Create a traffic record",
    description="Accept a traffic snapshot and persist it to the database. "
    "A recommendation is generated automatically based on the congestion level.",
)
def create_traffic_record(payload: TrafficRecordCreate, db: DbSession) -> TrafficRecordResponse:
    service = TrafficService(db)
    return service.create_record(payload)


@router.get(
    "",
    response_model=list[TrafficRecordResponse],
    summary="List all traffic records",
    description="Return every traffic record stored in the database, most recent first.",
)
def list_traffic_records(db: DbSession) -> list[TrafficRecordResponse]:
    service = TrafficService(db)
    return service.get_all_records()
