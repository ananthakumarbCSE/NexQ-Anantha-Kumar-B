"""Q-Edge Guardian – ORM model re-exports.

Importing all models here ensures SQLAlchemy's metadata registry
knows about every table before `Base.metadata.create_all()` runs.
"""

from app.models.emergency import EmergencyEvent
from app.models.signal import TrafficSignal
from app.models.traffic import TrafficRecord

__all__ = [
    "EmergencyEvent",
    "TrafficRecord",
    "TrafficSignal",
]
