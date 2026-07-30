"""Q-Edge Guardian – Dashboard aggregation service."""

from sqlalchemy.orm import Session

from app.schemas.dashboard import DashboardResponse
from app.services.emergency_service import EmergencyService
from app.services.signal_service import SignalService
from app.services.traffic_service import TrafficService


class DashboardService:
    """Aggregates stats from all domain services for the dashboard endpoint."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_summary(self) -> DashboardResponse:
        """Return aggregate counts across all domain tables."""
        return DashboardResponse(
            active_signals=SignalService(self.db).get_signal_count(),
            traffic_records=TrafficService(self.db).get_record_count(),
            emergency_events=EmergencyService(self.db).get_event_count(),
        )
