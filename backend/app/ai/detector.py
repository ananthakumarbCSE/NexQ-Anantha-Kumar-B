"""Q-Edge Guardian – YOLOv8 vehicle detector (singleton).

The model is loaded exactly once and reused across all requests.
"""

import logging
import time
from pathlib import Path
from typing import Any

import numpy as np

logger = logging.getLogger("q_edge_guardian")

# COCO class IDs that correspond to traffic-relevant vehicles
VEHICLE_CLASS_IDS: dict[int, str] = {
    1: "bicycle",
    2: "car",
    3: "motorcycle",
    5: "bus",
    7: "truck",
}


class YOLODetector:
    """Singleton wrapper around Ultralytics YOLOv8."""

    _instance: "YOLODetector | None" = None

    def __new__(cls) -> "YOLODetector":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self._model: Any = None
        self._model_name: str = "yolov8n.pt"
        self._loaded: bool = False
        self._last_inference_ms: float = 0.0
        self._initialized = True

    # ── Public API ───────────────────────────────────────────────────

    def load_model(self) -> None:
        """Download (if needed) and load YOLOv8-nano."""
        try:
            from ultralytics import YOLO

            logger.info("Loading YOLO model: %s ...", self._model_name)
            self._model = YOLO(self._model_name)
            self._loaded = True
            logger.info("YOLO model loaded successfully.")
        except Exception as exc:
            logger.error("Failed to load YOLO model: %s", exc)
            self._loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def model_name(self) -> str:
        return self._model_name

    @property
    def last_inference_ms(self) -> float:
        return self._last_inference_ms

    def detect_vehicles(self, frame: np.ndarray, confidence: float = 0.35) -> list[dict]:
        """Run inference on a single frame and return vehicle detections.

        Each detection is a dict with keys:
            class_id, class_name, confidence, bbox (x1, y1, x2, y2)
        """
        if not self._loaded or self._model is None:
            return []

        start = time.perf_counter()
        results = self._model(frame, conf=confidence, verbose=False)
        elapsed_ms = (time.perf_counter() - start) * 1000
        self._last_inference_ms = round(elapsed_ms, 2)

        detections: list[dict] = []
        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue
            for box in boxes:
                cls_id = int(box.cls[0])
                if cls_id not in VEHICLE_CLASS_IDS:
                    continue
                conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                detections.append({
                    "class_id": cls_id,
                    "class_name": VEHICLE_CLASS_IDS[cls_id],
                    "confidence": round(conf, 3),
                    "bbox": [round(x1), round(y1), round(x2), round(y2)],
                })

        return detections


# Module-level singleton instance
yolo_detector = YOLODetector()
