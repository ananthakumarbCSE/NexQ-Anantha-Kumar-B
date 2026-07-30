"""Q-Edge Guardian – Quantum circuit builder for traffic signal optimization.

This module constructs a real parameterized quantum circuit, executes it on
the Qiskit AerSimulator, and returns raw measurement counts.  The circuit
encodes per-lane traffic density as Ry rotation angles and uses CX
entanglement gates to model inter-lane constraints.
"""

from __future__ import annotations

import logging
from typing import Dict

import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

logger = logging.getLogger("q_edge_guardian.quantum")

# Module-level simulator singleton (stateless, thread-safe for reads)
_simulator = AerSimulator()

# Number of lanes / qubits
NUM_LANES = 4
LANE_LABELS = ["A", "B", "C", "D"]


def _normalize_to_angle(green_time: int, max_time: int) -> float:
    """Convert a green-phase duration to an Ry rotation angle in [0, π/2].

    A longer green time produces a larger angle, which increases the
    probability of measuring |1⟩ on the corresponding qubit.
    """
    ratio = min(green_time / max_time, 1.0)
    return ratio * (np.pi / 2)


def build_traffic_circuit(timings: Dict[str, int]) -> QuantumCircuit:
    """Build a 4-qubit quantum circuit encoding lane traffic densities.

    Parameters
    ----------
    timings : dict
        Mapping of lane label → current green time in seconds.
        Example: ``{"A": 35, "B": 15, "C": 50, "D": 20}``

    Returns
    -------
    QuantumCircuit
        A measured circuit ready for execution.
    """
    max_time = max(timings.values()) if timings else 1

    qc = QuantumCircuit(NUM_LANES, NUM_LANES)

    # ── Encoding layer: Ry rotations ────────────────────────────────
    for idx, lane in enumerate(LANE_LABELS):
        angle = _normalize_to_angle(timings.get(lane, 0), max_time)
        qc.ry(angle, idx)

    # ── Entanglement layer: CX between adjacent lanes ───────────────
    # Models the physical constraint that neighbouring approaches share
    # the intersection and cannot both have long green phases.
    qc.cx(0, 1)  # A ↔ B
    qc.cx(1, 2)  # B ↔ C
    qc.cx(2, 3)  # C ↔ D

    # ── Measurement ─────────────────────────────────────────────────
    qc.measure(range(NUM_LANES), range(NUM_LANES))

    return qc


def execute_circuit(qc: QuantumCircuit, shots: int = 1024) -> Dict[str, int]:
    """Run *qc* on the local AerSimulator and return measurement counts.

    Parameters
    ----------
    qc : QuantumCircuit
        A measured quantum circuit.
    shots : int
        Number of simulator repetitions (default 1024).

    Returns
    -------
    dict
        Bitstring → count mapping, e.g. ``{"0010": 312, "1100": 712}``.
    """
    job = _simulator.run(qc, shots=shots)
    result = job.result()
    counts: Dict[str, int] = result.get_counts(qc)
    logger.info("Quantum circuit executed – %d unique bitstrings from %d shots", len(counts), shots)
    return counts
