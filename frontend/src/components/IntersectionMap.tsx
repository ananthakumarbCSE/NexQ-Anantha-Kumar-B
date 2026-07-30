import React from 'react';
import { Car, Navigation } from 'lucide-react';
import type { SignalState } from '../types';

interface IntersectionMapProps {
  signals: SignalState[];
  emergencyActive?: boolean;
  emergencyLane?: string;
}

export const IntersectionMap: React.FC<IntersectionMapProps> = ({
  signals,
  emergencyActive = false,
  emergencyLane = '',
}) => {
  const getSignal = (lane: string): SignalState => {
    return signals.find((s) => s.lane === lane) || { lane: lane as any, color: 'RED', duration: 25, vehicleCount: 0 };
  };

  const signalA = getSignal('A'); // North
  const signalB = getSignal('B'); // East
  const signalC = getSignal('C'); // South
  const signalD = getSignal('D'); // West

  const renderLight = (lane: string, color: string, duration: number) => {
    const isEmerg = emergencyActive && emergencyLane.toUpperCase() === lane.toUpperCase();
    
    return (
      <div className={`p-2.5 rounded-lg bg-slate-900 border ${isEmerg ? 'border-red-500 shadow-md shadow-red-500/20' : 'border-slate-700'} flex items-center space-x-2`}>
        <div className="flex flex-col space-y-1">
          <div className={`w-2.5 h-2.5 rounded-full ${color === 'RED' ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-slate-700'}`} />
          <div className={`w-2.5 h-2.5 rounded-full ${color === 'YELLOW' ? 'bg-amber-500 shadow-sm shadow-amber-500' : 'bg-slate-700'}`} />
          <div className={`w-2.5 h-2.5 rounded-full ${color === 'GREEN' ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-slate-700'}`} />
        </div>
        <div className="text-left">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-bold text-slate-200">Lane {lane}</span>
            {isEmerg && (
              <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                CORRIDOR
              </span>
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {color === 'GREEN' ? `${duration}s Green` : 'Holding RED'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-blue-400" />
            <span>4-Way Intersection Monitor</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Real-time approach vectors & lane signal telemetry</p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Active Green</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-300">Holding</span>
          </div>
        </div>
      </div>

      {/* Intersection Canvas Container */}
      <div className="relative w-full h-80 bg-slate-900 rounded-lg border border-slate-700/80 flex items-center justify-center overflow-hidden p-4 select-none">
        
        {/* Road Surface Lines */}
        {/* North-South Road */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-28 bg-slate-800/90 border-x border-slate-700 flex justify-center">
          <div className="w-0.5 h-full border-r-2 border-dashed border-slate-600/70" />
        </div>

        {/* East-West Road */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-28 bg-slate-800/90 border-y border-slate-700 flex items-center">
          <div className="w-full h-0.5 border-b-2 border-dashed border-slate-600/70" />
        </div>

        {/* Intersection Box */}
        <div className="absolute w-28 h-28 bg-slate-800/60 border border-slate-600/40 rounded flex items-center justify-center text-[10px] font-mono text-slate-500">
          JUNCTION #04
        </div>

        {/* --- APPROACH LANE LIGHTS & VEHICLE ICONS --- */}

        {/* Lane A (North Approach) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1">
          {renderLight('A', signalA.color, signalA.duration)}
          <div className="flex space-x-1 pt-1 text-slate-400">
            <Car className="w-4 h-4 text-blue-400" />
            <Car className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-mono text-slate-400 font-semibold">({signalA.vehicleCount})</span>
          </div>
        </div>

        {/* Lane B (East Approach) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <div className="flex flex-col space-y-1 text-slate-400">
            <Car className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-mono text-slate-400 font-semibold">({signalB.vehicleCount})</span>
          </div>
          {renderLight('B', signalB.color, signalB.duration)}
        </div>

        {/* Lane C (South Approach) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1">
          <div className="flex space-x-1 pb-1 text-slate-400">
            <Car className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-mono text-slate-400 font-semibold">({signalC.vehicleCount})</span>
          </div>
          {renderLight('C', signalC.color, signalC.duration)}
        </div>

        {/* Lane D (West Approach) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {renderLight('D', signalD.color, signalD.duration)}
          <div className="flex flex-col space-y-1 text-slate-400">
            <Car className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-mono text-slate-400 font-semibold">({signalD.vehicleCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
