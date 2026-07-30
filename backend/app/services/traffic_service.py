"""Q-Edge Guardian – Traffic business-logic service."""

from sqlalchemy.orm import Session

from app.models.traffic import TrafficRecord
from app.schemas.traffic import TrafficRecordCreate


class TrafficService:
    """Encapsulates all traffic-related database operations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create_record(self, payload: TrafficRecordCreate) -> TrafficRecord:
        """Persist a new traffic snapshot and return the created row."""
        recommendation = self._generate_recommendation(payload.congestion_level)
        record = TrafficRecord(
            vehicle_count=payload.vehicle_count,
            congestion_level=payload.congestion_level,
            recommendation=recommendation,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_all_records(self) -> list[TrafficRecord]:
        """Return every traffic record ordered by most recent first."""
        return (
            self.db.query(TrafficRecord)
            .order_by(TrafficRecord.timestamp.desc())
            .all()
        )

    def get_record_count(self) -> int:
        """Return total number of traffic records."""
        return self.db.query(TrafficRecord).count()

    # ── Private helpers ──────────────────────────────────────────────

    @staticmethod
    def _generate_recommendation(congestion_level: str) -> str:
        """Return a dummy recommendation based on congestion level."""
        mapping = {
            "low": "Normal flow – no action required.",
            "medium": "Consider extending green phase by 10 s.",
            "high": "Activate adaptive signal control immediately.",
        }
        return mapping.get(congestion_level.lower(), "Monitor and reassess.")
