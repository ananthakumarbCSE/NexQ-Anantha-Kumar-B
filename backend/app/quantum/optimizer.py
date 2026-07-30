"""Q-Edge Guardian – Quantum traffic signal optimizer.

Interprets measurement results from the quantum circuit to produce
optimized green-phase timings that reduce average waiting time and
improve fairness across all approach lanes.
"""

from __future__ import annotations

import logging
from typing import Any, Dict

from app.quantum.circuit import (
    LANE_LABELS,
    NUM_LANES,
    build_traffic_circuit,
    execute_circuit,
)

logger = logging.getLogger("q_edge_guardian.quantum")

# Hard constraints
MIN_GREEN_TIME = 10   # seconds – no lane may be starved below this
MAX_GREEN_TIME = 90   # seconds – no single lane may monopolise the cycle
SHOTS = 1024


def _qubit_probabilities(counts: Dict[str, int], shots: int) -> list[float]:
    """Compute the probability of measuring |1⟩ for each qubit.

    Qiskit bitstrings are big-endian: the *rightmost* character is qubit 0.
    """
    probs = [0.0] * NUM_LANES
    for bitstring, count in counts.items():
        # Pad bitstring to NUM_LANES characters
        bits = bitstring.zfill(NUM_LANES)
        for qubit_idx in range(NUM_LANES):
            # Reverse index: qubit 0 is the rightmost character
            if bits[NUM_LANES - 1 - qubit_idx] == "1":
                probs[qubit_idx] += count
    return [p / shots for p in probs]


def _redistribute(
    probabilities: list[float],
    total_cycle: int,
) -> Dict[str, int]:
    """Redistribute *total_cycle* seconds across lanes proportionally to
    their quantum measurement probabilities, while respecting min/max
    constraints and conserving the total cycle time exactly.
    """
    # Avoid division by zero if all probabilities are 0
    prob_sum = sum(probabilities) or 1.0
    raw = [p / prob_sum * total_cycle for p in probabilities]

    # Clamp to [MIN_GREEN_TIME, MAX_GREEN_TIME]
    clamped = [max(MIN_GREEN_TIME, min(MAX_GREEN_TIME, int(round(t)))) for t in raw]

    # Iteratively adjust to conserve total cycle time exactly
    for _ in range(10):  # converges quickly
        diff = total_cycle - sum(clamped)
        if diff == 0:
            break
        # Sort lane indices by how much room they have to adjust
        if diff > 0:
            # Need to add time — pick lanes with most headroom below MAX
            candidates = sorted(
                range(NUM_LANES),
                key=lambda i: MAX_GREEN_TIME - clamped[i],
                reverse=True,
            )
        else:
            # Need to remove time — pick lanes with most room above MIN
            candidates = sorted(
                range(NUM_LANES),
                key=lambda i: clamped[i] - MIN_GREEN_TIME,
                reverse=True,
            )
        step = 1 if diff > 0 else -1
        for idx in candidates:
            new_val = clamped[idx] + step
            if MIN_GREEN_TIME <= new_val <= MAX_GREEN_TIME:
                clamped[idx] = new_val
                diff -= step
                if diff == 0:
                    break

    return {lane: clamped[i] for i, lane in enumerate(LANE_LABELS)}


def _estimate_improvement(
    current: Dict[str, int],
    optimized: Dict[str, int],
) -> float:
    """Estimate the percentage reduction in average waiting time.

    Uses the reduction in timing variance as a proxy: a more uniform
    distribution across lanes means shorter worst-case waits.
    """
    import numpy as np

    curr_vals = list(current.values())
    opt_vals = list(optimized.values())

    curr_var = float(np.var(curr_vals))
    opt_var = float(np.var(opt_vals))

    if curr_var == 0:
        return 0.0

    reduction = ((curr_var - opt_var) / curr_var) * 100
    return round(max(reduction, 0.0), 1)


def optimize(timings: Dict[str, int]) -> Dict[str, Any]:
    """Run the full quantum optimization pipeline.

    Parameters
    ----------
    timings : dict
        Input green times keyed by lane label.
        Example: ``{"A": 35, "B": 15, "C": 50, "D": 20}``

    Returns
    -------
    dict
        ``current_timings``, ``optimized_timings``,
        ``estimated_waiting_time_reduction``, ``optimization_method``.
    """
    current = {lane: timings.get(lane, 25) for lane in LANE_LABELS}
    total_cycle = sum(current.values())

    logger.info("Starting quantum optimization – total cycle %ds", total_cycle)

    # 1. Build & execute the quantum circuit
    qc = build_traffic_circuit(current)
    counts = execute_circuit(qc, shots=SHOTS)

    # 2. Extract per-qubit |1⟩ probabilities
    probs = _qubit_probabilities(counts, SHOTS)
    logger.info("Qubit |1⟩ probabilities: %s", dict(zip(LANE_LABELS, probs)))

    # 3. Redistribute cycle time based on quantum evidence
    optimized = _redistribute(probs, total_cycle)

    # 4. Estimate improvement
    improvement = _estimate_improvement(current, optimized)

    logger.info(
        "Optimization complete – improvement %.1f%% | %s → %s",
        improvement, current, optimized,
    )

    return {
        "current_timings": current,
        "optimized_timings": optimized,
        "estimated_waiting_time_reduction": improvement,
        "optimization_method": "Qiskit AerSimulator (4-qubit Ry+CX circuit, 1024 shots)",
    }
