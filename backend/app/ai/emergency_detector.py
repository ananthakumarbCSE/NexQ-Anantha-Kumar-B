"""Q-Edge Guardian – Emergency vehicle green-corridor generator."""

# Estimated clearance time per vehicle type (seconds)
_CLEARANCE_TIMES: dict[str, int] = {
    "Ambulance": 18,
    "Fire Truck": 25,
    "Police Car": 15,
}
_DEFAULT_CLEARANCE: int = 20

# All possible lanes
_ALL_LANES: list[str] = ["A", "B", "C", "D"]


def generate_green_corridor(vehicle_type: str, lane: str) -> dict:
    """Generate an immediate green-corridor response for an emergency vehicle.

    Returns:
        {
            "mode": "GREEN_CORRIDOR",
            "green_lane": "B",
            "other_lanes": "RED",
            "estimated_clearance": "18 seconds",
        }
    """
    clearance = _CLEARANCE_TIMES.get(vehicle_type, _DEFAULT_CLEARANCE)
    other = [l for l in _ALL_LANES if l.upper() != lane.upper()]

    return {
        "mode": "GREEN_CORRIDOR",
        "green_lane": lane.upper(),
        "other_lanes": "RED",
        "estimated_clearance": f"{clearance} seconds",
    }
