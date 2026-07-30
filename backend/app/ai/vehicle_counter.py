"""Q-Edge Guardian – Vehicle counting from YOLO detections."""


def count_vehicles(detections: list[dict]) -> dict:
    """Aggregate detections into per-class counts and a total.

    Args:
        detections: List of dicts from ``YOLODetector.detect_vehicles``.

    Returns:
        {
            "car": 12,
            "bus": 2,
            "truck": 3,
            "motorcycle": 1,
            "bicycle": 0,
            "total": 18,
        }
    """
    counts: dict[str, int] = {
        "car": 0,
        "bus": 0,
        "truck": 0,
        "motorcycle": 0,
        "bicycle": 0,
    }

    for det in detections:
        class_name = det.get("class_name", "")
        if class_name in counts:
            counts[class_name] += 1

    counts["total"] = sum(counts.values())
    return counts
