"""Q-Edge Guardian – Emergency API endpoints."""

from fastapi import APIRouter

from app.database.database import DbSession
from app.schemas.emergency import EmergencyEventCreate, EmergencyEventResponse
from app.services.emergency_service import EmergencyService

router = APIRouter(prefix="/emergency", tags=["Emergency"])


@router.post(
    "",
    response_model=EmergencyEventResponse,
    status_code=201,
    summary="Report an emergency event",
    description="Log an emergency vehicle detection along with its location.",
)
def create_emergency_event(payload: EmergencyEventCreate, db: DbSession) -> EmergencyEventResponse:
    service = EmergencyService(db)
    return service.create_event(payload)


@router.get(
    "",
    response_model=list[EmergencyEventResponse],
    summary="List all emergency events",
    description="Return every emergency event stored in the database, most recent first.",
)
def list_emergency_events(db: DbSession) -> list[EmergencyEventResponse]:
    service = EmergencyService(db)
    return service.get_all_events()
