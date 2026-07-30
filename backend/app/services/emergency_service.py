"""Q-Edge Guardian – Emergency business-logic service."""

from sqlalchemy.orm import Session

from app.ai.emergency_detector import generate_green_corridor
from app.models.emergency import EmergencyEvent
from app.schemas.emergency import EmergencyEventCreate, EmergencyPriorityRequest


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

    def create_priority_event(self, payload: EmergencyPriorityRequest) -> dict:
        """Generate a green corridor and persist the emergency event.

        Returns:
            dict matching ``EmergencyPriorityResponse`` schema.
        """
        # Generate AI corridor response
        corridor = generate_green_corridor(payload.vehicle_type, payload.lane)

        # Persist the event
        event = EmergencyEvent(
            vehicle_type=payload.vehicle_type,
            location=f"Lane {payload.lane}",
            status="GREEN_CORRIDOR",
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)

        return corridor

