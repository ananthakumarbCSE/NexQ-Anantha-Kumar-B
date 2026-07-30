"""Q-Edge Guardian – Signal optimization service."""

from app.ai.density import calculate_density
from app.ai.recommendation import recommend_signal


class SignalOptimizer:
    """Wraps AI recommendation logic for use by route handlers."""

    @staticmethod
    def optimize(vehicle_count: int, lane: str = "A") -> dict:
        """Given a vehicle count and lane, return optimized signal timing.

        Returns:
            {"lane": "A", "green_time": 40, "reason": "..."}
        """
        density = calculate_density(vehicle_count)
        return recommend_signal(density["level"], lane)
