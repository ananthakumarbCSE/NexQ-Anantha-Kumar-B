"""Q-Edge Guardian – Traffic density calculation."""

# Maximum vehicle count used to compute percentage (tunable).
_MAX_VEHICLES: int = 50

# Density thresholds
_THRESHOLDS: list[tuple[int, str]] = [
    (10, "LOW"),
    (25, "MEDIUM"),
    (40, "HIGH"),
]
_DEFAULT_LEVEL: str = "VERY_HIGH"


def calculate_density(vehicle_count: int) -> dict:
    """Return a density level and percentage given a vehicle count.

    Returns:
        {"level": "HIGH", "percentage": 83}
    """
    level = _DEFAULT_LEVEL
    for threshold, label in _THRESHOLDS:
        if vehicle_count <= threshold:
            level = label
            break

    percentage = min(round((vehicle_count / _MAX_VEHICLES) * 100), 100)

    return {"level": level, "percentage": percentage}
