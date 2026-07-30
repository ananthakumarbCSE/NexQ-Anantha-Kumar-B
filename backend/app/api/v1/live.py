"""Q-Edge Guardian – Live traffic status API endpoint."""

from fastapi import APIRouter

from app.schemas.live import LiveStatusResponse
from app.services.traffic_analysis_service import traffic_analysis

router = APIRouter(prefix="/live", tags=["Live Status"])


@router.get(
    "/status",
    response_model=LiveStatusResponse,
    summary="Get live traffic status",
    description=(
        "Return the current traffic snapshot including vehicle count, "
        "density level, recommended green time, and emergency corridor status."
    ),
)
def get_live_status() -> LiveStatusResponse:
    return LiveStatusResponse(**traffic_analysis.get_live_status())
