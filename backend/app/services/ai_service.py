"""Q-Edge Guardian – AI video analysis orchestration service."""

import logging
import time
from pathlib import Path

import cv2
import numpy as np

from app.ai.density import calculate_density
from app.ai.detector import yolo_detector
from app.ai.recommendation import recommend_signal
from app.ai.vehicle_counter import count_vehicles

logger = logging.getLogger("q_edge_guardian")

# Process every Nth frame to balance speed vs accuracy
_FRAME_SAMPLE_INTERVAL: int = 10

# Supported video extensions
SUPPORTED_EXTENSIONS: set[str] = {".mp4", ".avi", ".mov", ".mkv", ".webm"}


class AIService:
    """Orchestrates the full video → detection → analysis pipeline."""

    def analyze_video(self, video_path: str | Path, lane: str = "A") -> dict:
        """Process a video file and return a complete analysis result.

        Steps:
            1. Open video with OpenCV
            2. Sample every Nth frame
            3. Run YOLO detection on each sampled frame
            4. Aggregate vehicle counts
            5. Calculate density
            6. Generate signal recommendation

        Returns:
            dict matching ``VideoAnalysisResponse`` schema.

        Raises:
            ValueError: If the file cannot be opened or has no frames.
        """
        video_path = Path(video_path)

        if not video_path.exists():
            raise ValueError(f"Video file not found: {video_path}")

        if video_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported video format '{video_path.suffix}'. "
                f"Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
            )

        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            raise ValueError(f"Cannot open video file: {video_path}")

        total_counts: dict[str, int] = {
            "car": 0, "bus": 0, "truck": 0, "motorcycle": 0, "bicycle": 0, "total": 0,
        }
        frames_processed = 0
        total_inference_ms = 0.0
        frame_idx = 0

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                if frame_idx % _FRAME_SAMPLE_INTERVAL == 0:
                    detections = yolo_detector.detect_vehicles(frame)
                    counts = count_vehicles(detections)

                    for key in total_counts:
                        total_counts[key] += counts.get(key, 0)

                    total_inference_ms += yolo_detector.last_inference_ms
                    frames_processed += 1

                frame_idx += 1
        finally:
            cap.release()

        if frames_processed == 0:
            raise ValueError("Video contains no processable frames.")

        # Use average vehicles per frame for density/recommendation
        avg_vehicles = total_counts["total"] // max(frames_processed, 1)
        density = calculate_density(avg_vehicles)
        recommendation = recommend_signal(density["level"], lane)

        return {
            "vehicle_counts": total_counts,
            "total_vehicles": total_counts["total"],
            "density": density,
            "recommendation": recommendation,
            "frames_processed": frames_processed,
            "inference_time_ms": round(total_inference_ms, 2),
        }

    def get_sample_video(self) -> Path | None:
        """Return the first video file found in sample_videos/, or None."""
        sample_dir = Path(__file__).resolve().parent.parent / "sample_videos"
        if not sample_dir.exists():
            return None
        for ext in SUPPORTED_EXTENSIONS:
            for f in sample_dir.glob(f"*{ext}"):
                return f
        return None
