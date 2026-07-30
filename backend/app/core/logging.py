"""Q-Edge Guardian – Structured logging configuration."""

import logging
import sys


def setup_logging() -> None:
    """Configure application-wide logging with a consistent format."""
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger("q_edge_guardian")
    root_logger.setLevel(logging.DEBUG)
    root_logger.addHandler(handler)

    # Silence noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
