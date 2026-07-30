import React from 'react';
import { Atom, Cpu, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { mockQuantumMetrics } from '../services/mockData';

export const QuantumPage: React.FC = () => {
  const qm = mockQuantumMetrics;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Quantum Signal Optimization</h2>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Quantum annealing simulation & QUBO traffic schedule solver metrics.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold">
            SOLVER: D-WAVE SIMULATOR
          </span>
        </div>
      </div>

      {/* Quantum Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Qubits Allocated</span>
            <Atom className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-50">{qm.qubitsAllocated}</div>
          <div className="text-xs text-slate-400 font-normal">Active logical variables</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Annealing Time</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-50">{qm.annealingTimeUs} μs</div>
          <div className="text-xs text-amber-400 font-medium">Sub-millisecond solver speed</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Ground Energy State</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-50">{qm.energyState}</div>
          <div className="text-xs text-emerald-400 font-medium">Global minimum achieved</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Efficiency Gain</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{qm.optimizationGain}</div>
          <div className="text-xs text-slate-400 font-normal">vs greedy fixed-timer</div>
        </div>
      </div>

      {/* QUBO Problem Matrix Details */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>QUBO Hamiltonian Matrix Configuration</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Algorithm: Simulated Annealer</span>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-700/80 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
          <div className="text-slate-400">// Quadratic Unconstrained Binary Optimization formulation</div>
          <div>H = ∑ (w_i * x_i) + ∑ (c_ij * x_i * x_j)</div>
          <div className="text-slate-400">// Constraints: Minimized vehicle queue lengths & zero cross-lane conflict</div>
          <div className="text-emerald-400">Target Function: Minimized overall junction latency to &lt;15 seconds</div>
        </div>
      </div>
    </div>
  );
};
