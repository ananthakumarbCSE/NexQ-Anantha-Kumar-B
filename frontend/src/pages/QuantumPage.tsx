import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { quantumService } from '../services/quantumService';
import { Play, CheckCircle2, AlertCircle, Cpu, Clock, TrendingDown, Activity, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const QuantumPage: React.FC = () => {
  const [formValues, setFormValues] = useState({
    lane_A: 40,
    lane_B: 35,
    lane_C: 40,
    lane_D: 35,
  });

  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const start = performance.now();
      const data = await quantumService.optimizeSignals(formValues);
      const end = performance.now();
      setExecutionTime(Math.round(end - start));
      return data;
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const getChartData = () => {
    if (!mutation.data) return [];
    const { current_timings, optimized_timings } = mutation.data;
    return [
      {
        lane: 'Lane A',
        Current: current_timings.A,
        Optimized: optimized_timings.A,
      },
      {
        lane: 'Lane B',
        Current: current_timings.B,
        Optimized: optimized_timings.B,
      },
      {
        lane: 'Lane C',
        Current: current_timings.C,
        Optimized: optimized_timings.C,
      },
      {
        lane: 'Lane D',
        Current: current_timings.D,
        Optimized: optimized_timings.D,
      },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Quantum Optimization</h2>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Enterprise dashboard for quantum-assisted traffic signal timing optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center space-x-2 border-b border-slate-700 pb-4 mb-4">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-100">Current Signal Timings</h3>
            </div>
            
            <form onSubmit={handleOptimize} className="space-y-4">
              {['A', 'B', 'C', 'D'].map((lane) => (
                <div key={lane} className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Lane {lane} (Seconds)
                  </label>
                  <input
                    type="number"
                    name={`lane_${lane}`}
                    value={formValues[`lane_${lane}` as keyof typeof formValues]}
                    onChange={handleInputChange}
                    min="5"
                    max="120"
                    className="bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
                    required
                  />
                </div>
              ))}
              
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg text-sm px-5 py-3 transition-colors mt-6"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Optimize Signals</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6">
          {mutation.isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-400">Optimization Failed</h4>
                <p className="text-sm text-red-400/80 mt-1">
                  {mutation.error instanceof Error ? mutation.error.message : 'An unexpected error occurred during optimization.'}
                </p>
              </div>
            </div>
          )}

          {mutation.isSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Optimization Completed Successfully</span>
            </div>
          )}

          {mutation.data && (
            <>
              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <span>Waiting Time Reduction</span>
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {mutation.data.estimated_waiting_time_reduction.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <span>Optimization Method</span>
                    <Cpu className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-sm font-medium text-slate-100 truncate" title={mutation.data.optimization_method}>
                    {mutation.data.optimization_method}
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <span>Execution Time</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-50">
                    {executionTime !== null ? `${executionTime} ms` : '--'}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-100 mb-6 flex items-center space-x-2">
                  <span>Current vs Optimized Timings</span>
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="lane" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        cursor={{fill: '#334155', opacity: 0.4}}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                      <Bar dataKey="Current" fill="#64748b" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar dataKey="Optimized" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {!mutation.data && !mutation.isPending && !mutation.isError && (
            <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center">
              <Activity className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No Data Available</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                Enter the current green-phase durations for each lane and click "Optimize Signals" to view the quantum-optimized timings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
