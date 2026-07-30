"""Q-Edge Guardian – FastAPI application factory and lifecycle."""

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.v1.router import v1_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.database.base import Base
from app.database.database import engine

# Ensure every model is registered with Base.metadata before create_all
import app.models  # noqa: F401

logger = logging.getLogger("q_edge_guardian")


# ── Lifespan ─────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """Create tables on startup; cleanup on shutdown."""
    setup_logging()
    logger.info("Creating database tables …")
    Base.metadata.create_all(bind=engine)
    logger.info("Q-Edge Guardian is ready!")
    yield
    logger.info("Shutting down Q-Edge Guardian …")


# ── App ──────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "Quantum-Enhanced Edge Computing for Intelligent Traffic Management. "
        "This API provides endpoints for traffic monitoring, emergency vehicle "
        "detection, signal control, and a real-time dashboard."
    ),
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ── Global exception handlers ───────────────────────────────────────


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Return a clean 422 response with readable validation errors."""
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
        },
    )


# ── Root-level routes ───────────────────────────────────────────────


@app.get(
    "/",
    tags=["Root"],
    summary="Root endpoint",
    description="Returns project name and running status.",
)
def root() -> dict:
    return {"project": settings.PROJECT_NAME, "status": "Running"}


@app.get(
    "/health",
    tags=["Root"],
    summary="Health check",
    description="Returns service health status.",
)
def health_check() -> dict:
    return {"status": "healthy"}


# ── Mount versioned API ─────────────────────────────────────────────

app.include_router(v1_router)
