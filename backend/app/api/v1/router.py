"""Q-Edge Guardian – v1 API router that aggregates all domain routers."""

from fastapi import APIRouter

from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.emergency import router as emergency_router
from app.api.v1.signal import router as signal_router
from app.api.v1.traffic import router as traffic_router

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(traffic_router)
v1_router.include_router(emergency_router)
v1_router.include_router(signal_router)
v1_router.include_router(dashboard_router)
