"""Q-Edge Guardian – Signal timing recommendation engine."""

# Green duration per density level (seconds)
_GREEN_TIMES: dict[str, int] = {
    "MINIMAL": 10,
    "LOW": 10,
    "MEDIUM": 25,
    "MODERATE": 25,
    "HIGH": 40,
    "HEAVY": 45,
    "VERY_HIGH": 60,
    "SEVERE": 60,
    "GRIDLOCK": 75,
    "EMERGENCY": 90,
}

# Reason strings
_REASONS: dict[str, str] = {
    "MINIMAL": "Minimal vehicle volume – short 10s green phase sufficient.",
    "LOW": "Low vehicle density – baseline 10s green phase applied.",
    "MEDIUM": "Moderate traffic density – 25s green phase recommended to prevent queue buildup.",
    "MODERATE": "Moderate flow – applying standard 25s adaptive timing.",
    "HIGH": "High vehicle density – extended 40s green phase activated for high throughput.",
    "HEAVY": "Heavy vehicle traffic – 45s green phase activated with downstream signal coordination.",
    "VERY_HIGH": "Very high congestion – maximum 60s green phase enforced.",
    "SEVERE": "Severe gridlock warning – 60s priority green wave triggered.",
    "GRIDLOCK": "Critical gridlock – 75s extended green phase & cross-street holding.",
    "EMERGENCY": "Emergency priority – 90s full Green Corridor granted.",
}


def recommend_signal(density_level: str, lane: str = "A") -> dict:
    """Generate a signal timing recommendation based on density.

    Returns:
        {"lane": "A", "green_time": 40, "reason": "High vehicle density ..."}
    """
    level = density_level.upper()
    green_time = _GREEN_TIMES.get(level, 25)
    reason = _REASONS.get(level, "Standard signal timing applied.")

    return {
        "lane": lane.upper(),
        "green_time": green_time,
        "reason": reason,
    }
