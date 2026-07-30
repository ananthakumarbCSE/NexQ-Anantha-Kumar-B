"""Q-Edge Guardian – Emergency business-logic service."""

from sqlalchemy.orm import Session

from app.models.emergency import EmergencyEvent
from app.schemas.emergency import EmergencyEventCreate


class EmergencyService:
    """Encapsulates all emergency-event database operations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create_event(self, payload: EmergencyEventCreate) -> EmergencyEvent:
        """Persist a new emergency event and return it."""
        event = EmergencyEvent(
            vehicle_type=payload.vehicle_type,
            location=payload.location,
            status="ACTIVE",
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_all_events(self) -> list[EmergencyEvent]:
        """Return every emergency event ordered by most recent first."""
        return (
            self.db.query(EmergencyEvent)
            .order_by(EmergencyEvent.timestamp.desc())
            .all()
        )

    def get_event_count(self) -> int:
        """Return total number of emergency events."""
        return self.db.query(EmergencyEvent).count()
