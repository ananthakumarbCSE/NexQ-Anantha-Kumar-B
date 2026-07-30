import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Server, Sliders, CheckCircle2, RefreshCw, Database, Cpu } from 'lucide-react';
import { systemService } from '../services/systemService';
import { getBaseUrl, setBaseUrl } from '../api/client';

export const SettingsPage: React.FC = () => {
  const [apiUrl, setApiUrlInput] = useState<string>(getBaseUrl());
  const [saveMessage, setSaveMessage] = useState<string>('');

  const { data: systemStatus, isLoading, refetch } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: systemService.getSystemStatus,
  });

  const { data: healthData, refetch: checkHealth, isFetching: isHealthChecking } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: systemService.getHealth,
    enabled: false,
  });

  const handleSaveUrl = () => {
    setBaseUrl(apiUrl);
    setSaveMessage('API Base URL saved successfully!');
    refetch();
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-50 tracking-tight">System Settings & Backend Health</h2>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Configure backend target URLs, trigger manual health diagnostics, and inspect system versions.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Frontend: React v19 | API v1.0
          </span>
        </div>
      </div>

      {/* Backend Target URL Configuration Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Server className="w-4 h-4 text-blue-400" />
            <span>FastAPI Server Endpoint</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Axios BaseURL Config</span>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Backend URL</label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrlInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSaveUrl}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold border border-blue-400/30 transition-colors"
              >
                Save Base URL
              </button>
            </div>
            {saveMessage && (
              <p className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveMessage}</span>
              </p>
            )}
          </div>

          {/* Health Check Button */}
          <div className="pt-2 flex items-center space-x-4">
            <button
              onClick={() => checkHealth()}
              disabled={isHealthChecking}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold border border-slate-600 flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isHealthChecking ? 'animate-spin' : ''}`} />
              <span>Run GET /health Check</span>
            </button>
            {healthData && (
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Result: {JSON.stringify(healthData)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Backend Diagnostics Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Backend Diagnostic Telemetry</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Database Status</span>
            </div>
            <div className="text-lg font-bold font-mono text-slate-50">
              {isLoading ? 'Checking...' : systemStatus?.database_connected ? 'CONNECTED' : 'DISCONNECTED'}
            </div>
            <div className="text-[11px] text-slate-400">Supabase PostgreSQL engine</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>YOLO Model Load</span>
            </div>
            <div className="text-lg font-bold font-mono text-slate-50">
              {isLoading ? 'Checking...' : systemStatus?.yolo_loaded ? 'LOADED' : 'UNLOADED'}
            </div>
            <div className="text-[11px] text-slate-400">{systemStatus?.model_name || 'yolov8n.pt'}</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <Server className="w-4 h-4 text-blue-400" />
              <span>Inference Speed</span>
            </div>
            <div className="text-lg font-bold font-mono text-slate-50">
              {isLoading ? '12.4 ms' : `${systemStatus?.inference_time_ms.toFixed(1)} ms`}
            </div>
            <div className="text-[11px] text-slate-400">Per sampled video frame</div>
          </div>
        </div>
      </div>
    </div>
  );
};
