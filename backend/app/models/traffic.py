"""Q-Edge Guardian – TrafficRecord ORM model."""

from datetime import datetime, timezone

from sqlalchemy import BigInteger, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class TrafficRecord(Base):
    """Stores per-snapshot traffic telemetry."""

    __tablename__ = "traffic_records"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True, autoincrement=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    vehicle_count: Mapped[int] = mapped_column(Integer, nullable=False)
    congestion_level: Mapped[str] = mapped_column(String(32), nullable=False)
    recommendation: Mapped[str] = mapped_column(String(256), default="No action required")
