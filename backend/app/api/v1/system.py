"""Q-Edge Guardian – System status API endpoint."""

import logging

from fastapi import APIRouter
from sqlalchemy import text

from app.ai.detector import yolo_detector
from app.database.database import SessionLocal
from app.schemas.system import SystemStatusResponse

logger = logging.getLogger("q_edge_guardian")

router = APIRouter(prefix="/system", tags=["System"])


@router.get(
    "",
    response_model=SystemStatusResponse,
    summary="Get system status",
    description=(
        "Return system health information including YOLO model status, "
        "database connectivity, and performance metrics."
    ),
)
def get_system_status() -> SystemStatusResponse:
    # Check database connectivity
    db_connected = False
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db_connected = True
        db.close()
    except Exception as exc:
        logger.warning("Database health check failed: %s", exc)

    return SystemStatusResponse(
        yolo_loaded=yolo_detector.is_loaded,
        model_name=yolo_detector.model_name,
        database_connected=db_connected,
        inference_time_ms=yolo_detector.last_inference_ms,
    )
