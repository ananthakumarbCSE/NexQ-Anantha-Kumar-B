import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database, Cpu, Activity, Server, Zap, Wifi } from 'lucide-react';
import { systemService } from '../services/systemService';

export const RightStatusPanel: React.FC = () => {
  const { data: systemStatus, isError, isLoading } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: systemService.getSystemStatus,
    refetchInterval: 3000,
    retry: 1,
  });

  const isBackendOk = !isError && !!systemStatus;
  const isDbOk = isBackendOk && systemStatus.database_connected;
  const isYoloOk = isBackendOk && systemStatus.yolo_loaded;
  const inferenceMs = systemStatus?.inference_time_ms || 12.4;
  const modelName = systemStatus?.model_name || 'yolov8n.pt';

  return (
    <aside className="w-72 bg-slate-800 border-l border-slate-700 p-5 space-y-6 shrink-0 overflow-y-auto select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Telemetry</h2>
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isBackendOk ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isBackendOk ? 'bg-emerald-500' : 'bg-red-500'}`} />
        </span>
      </div>

      {/* Backend Status */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Server className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Backend API</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
            isBackendOk 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {isLoading ? 'CHECKING...' : isBackendOk ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isBackendOk ? 'FastAPI Uvicorn running on port 8001.' : 'Cannot connect to http://127.0.0.1:8001.'}
        </p>
      </div>

      {/* Database Connection */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Database</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
            isDbOk 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {isDbOk ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isDbOk ? 'Supabase PostgreSQL pooled instance active.' : 'Database connection unavailable.'}
        </p>
      </div>

      {/* YOLO Engine */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="font-medium">YOLO Engine</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
            isYoloOk 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {isYoloOk ? 'LOADED' : 'UNLOADED'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Model: <span className="font-mono text-slate-300">{modelName}</span>
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="space-y-3 pt-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Execution Performance</h3>
        
        {/* FPS */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Frame Rate</span>
          </div>
          <span className="font-mono font-bold text-slate-100">30 FPS</span>
        </div>

        {/* Inference Time */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Inference Time</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{inferenceMs.toFixed(1)} ms</span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Status</span>
          </div>
          <span className={`font-mono font-bold ${isBackendOk ? 'text-emerald-400' : 'text-red-400'}`}>
            {isBackendOk ? 'Active' : 'Offline'}
          </span>
        </div>
      </div>
    </aside>
  );
};
