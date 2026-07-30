"""Q-Edge Guardian – In-memory live traffic status tracker."""

import threading


class TrafficAnalysisService:
    """Thread-safe singleton that holds the latest analysis snapshot.

    Updated after every video analysis; queried by GET /api/v1/live/status.
    """

    _instance: "TrafficAnalysisService | None" = None
    _lock = threading.Lock()

    def __new__(cls) -> "TrafficAnalysisService":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self._vehicles: int = 0
        self._density: str = "LOW"
        self._green_time: int = 10
        self._emergency: bool = False
        self._initialized = True

    # ── Mutators ─────────────────────────────────────────────────────

    def update_from_analysis(self, analysis: dict) -> None:
        """Update live status from a completed video analysis result."""
        with self._lock:
            self._vehicles = analysis.get("total_vehicles", 0)
            density = analysis.get("density", {})
            self._density = density.get("level", "LOW")
            recommendation = analysis.get("recommendation", {})
            self._green_time = recommendation.get("green_time", 10)

    def set_emergency(self, active: bool) -> None:
        """Toggle emergency corridor mode."""
        with self._lock:
            self._emergency = active

    # ── Accessor ─────────────────────────────────────────────────────

    def get_live_status(self) -> dict:
        """Return current traffic snapshot."""
        with self._lock:
            return {
                "vehicles": self._vehicles,
                "density": self._density,
                "green_time": self._green_time,
                "emergency": self._emergency,
            }


# Module-level singleton
traffic_analysis = TrafficAnalysisService()
