"""Q-Edge Guardian – Dashboard API endpoint."""

from fastapi import APIRouter

from app.database.database import DbSession
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "",
    response_model=DashboardResponse,
    summary="Get dashboard summary",
    description="Return aggregate counts of active signals, traffic records, and emergency events.",
)
def get_dashboard(db: DbSession) -> DashboardResponse:
    service = DashboardService(db)
    return service.get_summary()
