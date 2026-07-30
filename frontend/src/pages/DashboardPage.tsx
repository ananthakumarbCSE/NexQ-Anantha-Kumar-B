import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Car, 
  Activity, 
  Siren, 
  Clock, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { IntersectionMap } from '../components/IntersectionMap';
import { CardSkeleton } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { trafficService } from '../services/trafficService';
import { dashboardService } from '../services/dashboardService';
import { signalService } from '../services/signalService';
import type { SignalState } from '../types';

export const DashboardPage: React.FC = () => {
  // Query 1: Live Status (/api/v1/live/status)
  const { 
    data: liveStatus, 
    isLoading: isLiveLoading, 
    isError: isLiveError,
    refetch: refetchLive 
  } = useQuery({
    queryKey: ['liveStatus'],
    queryFn: trafficService.getLiveStatus,
    refetchInterval: 2500,
  });

  // Query 2: Dashboard Summary (/api/v1/dashboard)
  const { 
    data: summary, 
    isLoading: isSummaryLoading, 
    isError: isSummaryError,
    refetch: refetchSummary 
  } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardService.getSummary,
    refetchInterval: 5000,
  });

  // Query 3: Signals (/api/v1/signal)
  const { data: signals } = useQuery({
    queryKey: ['trafficSignals'],
    queryFn: signalService.getSignals,
    refetchInterval: 3000,
  });

  const isLoading = isLiveLoading || isSummaryLoading;
  const isError = isLiveError || isSummaryError;

  const handleRetry = () => {
    refetchLive();
    refetchSummary();
  };

  // Convert backend signals list to SignalState array for IntersectionMap
  const mappedSignals: SignalState[] = (signals && signals.length > 0)
    ? signals.map((s) => ({
        lane: s.lane.toUpperCase() as any,
        color: s.signal_color.toUpperCase() as any,
        duration: s.green_duration,
        vehicleCount: liveStatus?.vehicles || 0,
      }))
    : [
        { lane: 'A', color: 'GREEN', duration: liveStatus?.green_time || 40, vehicleCount: liveStatus?.vehicles || 22 },
        { lane: 'B', color: 'RED', duration: 25, vehicleCount: 8 },
        { lane: 'C', color: 'RED', duration: 25, vehicleCount: 11 },
        { lane: 'D', color: 'RED', duration: 25, vehicleCount: 6 },
      ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-50 tracking-tight">System Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Live FastAPI telemetry, intersection visualization, and AI signal optimizer metrics.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 font-semibold">
            Mode: Adaptive AI
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Records Logged: {summary?.traffic_records ?? 0}
          </span>
        </div>
      </div>

      {/* Error View */}
      {isError && (
        <ErrorState
          title="Telemetry Feed Error"
          message="Could not connect to FastAPI backend at http://127.0.0.1:8001. Ensure uvicorn server is running."
          onRetry={handleRetry}
        />
      )}

      {/* 6 Key Stat Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Vehicle Count */}
          <StatCard
            title="Vehicle Count"
            value={liveStatus?.vehicles ?? 0}
            subtitle="Live vehicles detected across approach lanes"
            change="Real-time count"
            changeType="positive"
            icon={<Car className="w-5 h-5 text-blue-400" />}
            badgeText="Live"
            badgeColor="blue"
          />

          {/* 2. Traffic Density */}
          <StatCard
            title="Traffic Density"
            value={liveStatus?.density ?? 'LOW'}
            subtitle="AI computed congestion level"
            change={`Active signals: ${summary?.active_signals ?? 0}`}
            changeType="neutral"
            icon={<Activity className="w-5 h-5 text-amber-400" />}
            badgeText={liveStatus?.density ?? 'LOW'}
            badgeColor={liveStatus?.density === 'HIGH' || liveStatus?.density === 'VERY_HIGH' ? 'red' : 'emerald'}
          />

          {/* 3. Emergency Status */}
          <StatCard
            title="Emergency Status"
            value={liveStatus?.emergency ? 'ACTIVE' : 'STANDBY'}
            subtitle="First responder corridor status"
            change={`Events logged: ${summary?.emergency_events ?? 0}`}
            changeType={liveStatus?.emergency ? 'negative' : 'positive'}
            icon={<Siren className="w-5 h-5 text-red-400" />}
            badgeText={liveStatus?.emergency ? 'CORRIDOR' : 'Clear'}
            badgeColor={liveStatus?.emergency ? 'red' : 'emerald'}
          />

          {/* 4. Signal Status */}
          <StatCard
            title="Active Signal Timing"
            value={`${liveStatus?.green_time ?? 25}s Green`}
            subtitle="AI recommended green phase duration"
            change="Adaptive timing active"
            changeType="neutral"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            badgeText="Optimal"
            badgeColor="emerald"
          />

          {/* 5. Average Wait Time */}
          <StatCard
            title="Average Delay"
            value={`${((liveStatus?.vehicles ?? 10) * 0.8).toFixed(1)}s`}
            subtitle="Estimated approach queue delay"
            change="-5.4s delay reduction"
            changeType="positive"
            icon={<Clock className="w-5 h-5 text-blue-400" />}
            badgeText="AI Optimized"
            badgeColor="blue"
          />

          {/* 6. AI Recommendation */}
          <StatCard
            title="AI Decision Engine"
            value={liveStatus?.density === 'HIGH' ? 'Extend 40s' : 'Standard 25s'}
            subtitle="Dynamic green phase allocation"
            change="Model: YOLOv8"
            changeType="positive"
            icon={<Cpu className="w-5 h-5 text-amber-400" />}
            badgeText="YOLOv8"
            badgeColor="amber"
          />
        </div>
      )}

      {/* Main Intersection Visualization Container */}
      <IntersectionMap 
        signals={mappedSignals} 
        emergencyActive={liveStatus?.emergency}
        emergencyLane="B"
      />
    </div>
  );
};
