"""Q-Edge Guardian – TrafficSignal ORM model."""

from sqlalchemy import BigInteger, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class TrafficSignal(Base):
    """Represents the current state of a single traffic signal."""

    __tablename__ = "traffic_signals"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True, autoincrement=True)
    lane: Mapped[str] = mapped_column(String(32), nullable=False)
    signal_color: Mapped[str] = mapped_column(String(16), nullable=False)
    green_duration: Mapped[int] = mapped_column(Integer, nullable=False)
