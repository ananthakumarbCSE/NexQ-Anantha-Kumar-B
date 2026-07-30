"""Q-Edge Guardian – EmergencyEvent ORM model."""

from datetime import datetime, timezone

from sqlalchemy import BigInteger, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class EmergencyEvent(Base):
    """Tracks emergency vehicle detections and their clearance status."""

    __tablename__ = "emergency_events"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True, autoincrement=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    vehicle_type: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE")
    location: Mapped[str] = mapped_column(String(128), nullable=False)
