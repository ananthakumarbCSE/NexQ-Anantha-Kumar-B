"""Q-Edge Guardian – QuantumOptimization ORM model."""

from datetime import datetime, timezone

from sqlalchemy import BigInteger, DateTime, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class QuantumOptimization(Base):
    """Stores each quantum signal-timing optimization run."""

    __tablename__ = "quantum_optimizations"

    id: Mapped[int] = mapped_column(
        BigInteger, primary_key=True, index=True, autoincrement=True,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    input_timings: Mapped[str] = mapped_column(
        String(256), nullable=False, doc="JSON-encoded input green timings",
    )
    optimized_timings: Mapped[str] = mapped_column(
        String(256), nullable=False, doc="JSON-encoded optimized green timings",
    )
    improvement_pct: Mapped[float] = mapped_column(
        Float, nullable=False, doc="Estimated waiting-time reduction percentage",
    )
    method: Mapped[str] = mapped_column(
        String(128), nullable=False, doc="Optimization method descriptor",
    )
