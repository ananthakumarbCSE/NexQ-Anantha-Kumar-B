"""Q-Edge Guardian – Signal business-logic service."""

from sqlalchemy.orm import Session

from app.models.signal import TrafficSignal
from app.schemas.signal import TrafficSignalCreate


class SignalService:
    """Encapsulates all traffic-signal database operations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create_signal(self, payload: TrafficSignalCreate) -> TrafficSignal:
        """Persist a new traffic signal configuration and return it."""
        signal = TrafficSignal(
            lane=payload.lane,
            signal_color=payload.signal_color,
            green_duration=payload.green_duration,
        )
        self.db.add(signal)
        self.db.commit()
        self.db.refresh(signal)
        return signal

    def get_all_signals(self) -> list[TrafficSignal]:
        """Return every traffic signal ordered by lane."""
        return (
            self.db.query(TrafficSignal)
            .order_by(TrafficSignal.lane)
            .all()
        )

    def get_signal_count(self) -> int:
        """Return total number of traffic signals."""
        return self.db.query(TrafficSignal).count()
