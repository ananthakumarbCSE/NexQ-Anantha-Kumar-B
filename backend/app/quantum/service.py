"""Q-Edge Guardian – Quantum optimization service layer.

Bridges the quantum optimizer to the API and database.  Validates input,
invokes the optimizer, persists the result, and returns a Pydantic-ready dict.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.quantum import QuantumOptimization
from app.quantum.optimizer import optimize

logger = logging.getLogger("q_edge_guardian.quantum")


class QuantumService:
    """Stateless service – instantiated per-request with a DB session."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def run_optimization(self, timings: Dict[str, int]) -> Dict[str, Any]:
        """Execute quantum optimization and persist the result.

        Parameters
        ----------
        timings : dict
            Lane label → green time mapping, e.g.
            ``{"A": 35, "B": 15, "C": 50, "D": 20}``.

        Returns
        -------
        dict
            Keys: ``current_timings``, ``optimized_timings``,
            ``estimated_waiting_time_reduction``, ``optimization_method``.
        """
        result = optimize(timings)

        # Persist to database
        record = QuantumOptimization(
            input_timings=json.dumps(result["current_timings"]),
            optimized_timings=json.dumps(result["optimized_timings"]),
            improvement_pct=result["estimated_waiting_time_reduction"],
            method=result["optimization_method"],
        )
        self._db.add(record)
        self._db.commit()
        self._db.refresh(record)

        logger.info("Quantum optimization #%d persisted to database", record.id)

        return result
