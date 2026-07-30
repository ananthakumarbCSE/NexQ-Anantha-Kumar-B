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
        recommendation = self._generate_recommendation(payload.congestion_level, payload.vehicle_count)
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
    def _generate_recommendation(congestion_level: str, vehicle_count: int = 0) -> str:
        """Generate intelligent traffic recommendation based on level and vehicle count."""
        level = congestion_level.lower().strip()

        mapping = {
            "low": "Optimal traffic flow – maintain standard baseline cycle (10s green).",
            "minimal": "Light traffic detected – short green phase sufficient.",
            "medium": "Moderate traffic density – extend green phase by 15s to prevent queue backup.",
            "moderate": "Moderate flow – apply standard adaptive timing (25s green).",
            "high": "High congestion detected – activate adaptive signal control immediately (40s green).",
            "heavy": "Heavy vehicle volume – extend green timing & coordinate downstream signals.",
            "very_high": "Very high congestion – enforce maximum green phase (60s) & alert traffic operations.",
            "severe": "Severe gridlock warning – trigger priority green wave and reroute incoming lanes.",
            "gridlock": "Critical gridlock – lock cross-street traffic & deploy emergency green corridor.",
            "emergency": "Emergency override – clear green corridor immediately for first responders.",
        }

        if level in mapping:
            return mapping[level]

        # Dynamic fallback based on vehicle count
        if vehicle_count > 40:
            return f"High vehicle count ({vehicle_count} vehicles) – enforce maximum green phase (60s)."
        elif vehicle_count > 25:
            return f"Elevated vehicle count ({vehicle_count} vehicles) – activate adaptive signal control (40s)."
        elif vehicle_count > 10:
            return f"Moderate vehicle count ({vehicle_count} vehicles) – apply 25s green phase."
        else:
            return f"Low vehicle count ({vehicle_count} vehicles) – standard 10s green phase sufficient."
