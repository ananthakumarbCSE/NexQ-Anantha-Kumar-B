"""Q-Edge Guardian – Emergency API endpoints."""

from fastapi import APIRouter

from app.database.database import DbSession
from app.schemas.emergency import (
    EmergencyEventCreate,
    EmergencyEventResponse,
    EmergencyPriorityRequest,
    EmergencyPriorityResponse,
)
from app.services.emergency_service import EmergencyService
from app.services.traffic_analysis_service import traffic_analysis

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


@router.post(
    "/priority",
    response_model=EmergencyPriorityResponse,
    status_code=201,
    summary="Activate emergency green corridor",
    description=(
        "Immediately generate a GREEN_CORRIDOR for the specified emergency vehicle "
        "and lane. All other lanes are set to RED. The event is persisted to the database."
    ),
)
def activate_emergency_priority(
    payload: EmergencyPriorityRequest, db: DbSession
) -> EmergencyPriorityResponse:
    service = EmergencyService(db)
    corridor = service.create_priority_event(payload)

    # Toggle emergency mode on the live status tracker
    traffic_analysis.set_emergency(True)

    return EmergencyPriorityResponse(**corridor)

