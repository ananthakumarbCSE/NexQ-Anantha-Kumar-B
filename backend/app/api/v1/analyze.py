"""Q-Edge Guardian – Video analysis API endpoint."""

import logging
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File

from app.schemas.analyze import VideoAnalysisResponse
from app.services.ai_service import AIService, SUPPORTED_EXTENSIONS
from app.services.traffic_analysis_service import traffic_analysis

logger = logging.getLogger("q_edge_guardian")

router = APIRouter(prefix="/analyze", tags=["AI Analysis"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"


@router.post(
    "/video",
    response_model=VideoAnalysisResponse,
    summary="Analyze a traffic video",
    description=(
        "Upload a traffic video file (.mp4, .avi, .mov, .mkv, .webm). "
        "The backend processes it with YOLOv8, counts vehicles, calculates "
        "density, and returns an AI-generated signal recommendation. "
        "If no file is uploaded, a sample video from sample_videos/ is used."
    ),
)
async def analyze_video(
    file: UploadFile | None = File(None, description="Traffic video file"),
    lane: str = "A",
) -> VideoAnalysisResponse:
    ai_service = AIService()
    video_path: Path | None = None
    temp_file: Path | None = None

    try:
        if file is not None and file.filename:
            # Validate extension
            ext = Path(file.filename).suffix.lower()
            if ext not in SUPPORTED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported video format '{ext}'. Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}",
                )

            # Save to temp file
            UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
            temp_name = f"{uuid.uuid4().hex}{ext}"
            temp_file = UPLOAD_DIR / temp_name

            content = await file.read()
            if len(content) == 0:
                raise HTTPException(status_code=400, detail="Uploaded file is empty.")

            temp_file.write_bytes(content)
            video_path = temp_file
        else:
            # Fall back to sample video
            video_path = ai_service.get_sample_video()
            if video_path is None:
                raise HTTPException(
                    status_code=400,
                    detail="No video uploaded and no sample video found in sample_videos/.",
                )

        result = ai_service.analyze_video(video_path, lane=lane)

        # Update the live status singleton
        traffic_analysis.update_from_analysis(result)

        return VideoAnalysisResponse(**result)

    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    finally:
        # Clean up temp file
        if temp_file is not None and temp_file.exists():
            try:
                temp_file.unlink()
            except OSError:
                logger.warning("Failed to delete temp file: %s", temp_file)
