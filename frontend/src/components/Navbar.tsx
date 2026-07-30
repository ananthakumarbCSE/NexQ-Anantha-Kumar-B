import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cpu, Clock, User } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { systemService } from '../services/systemService';

export const Navbar: React.FC = () => {
  const { time, date } = useClock();

  // Poll system health every 3 seconds
  const { data: systemStatus, isError } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: systemService.getSystemStatus,
    refetchInterval: 3000,
    retry: 1,
  });

  const isOnline = !isError && systemStatus?.database_connected;

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 px-6 flex items-center justify-between z-30 select-none">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-sm">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-slate-50 tracking-wide">Q-Edge Guardian</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Enterprise v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal leading-tight">Quantum-Enhanced Intelligent Signal Control</p>
        </div>
      </div>

      {/* Center / Right Telemetry Badges */}
      <div className="flex items-center space-x-6">
        {/* Backend Status Indicator */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/80">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </span>
          <div className="text-xs">
            <span className="text-slate-400 mr-1.5 font-medium">Backend:</span>
            <span className={`font-mono font-semibold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Real-time Clock */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/80 text-xs font-mono text-slate-300">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{date}</span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400 font-bold">{time || '00:00:00'}</span>
        </div>

        {/* User Account Placeholder */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-700">
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-200">System Operator</div>
            <div className="text-[10px] text-slate-400">Control Center #4</div>
          </div>
        </div>
      </div>
    </header>
  );
};
