import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Siren, AlertTriangle, ShieldAlert, RefreshCw, Flame, Shield, Ambulance } from 'lucide-react';
import { emergencyService } from '../services/emergencyService';
import { TableSkeleton } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import type { EmergencyPriorityResponse } from '../types';

export const EmergencyPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedLane, setSelectedLane] = useState<string>('B');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Ambulance');
  const [priorityResult, setPriorityResult] = useState<EmergencyPriorityResponse | null>(null);

  // Query: Emergency Events List (/api/v1/emergency)
  const { data: events, isLoading, isError, refetch } = useQuery({
    queryKey: ['emergencyEvents'],
    queryFn: emergencyService.getEvents,
    refetchInterval: 3000,
  });

  // Priority Dispatch Mutation (/api/v1/emergency/priority)
  const priorityMutation = useMutation({
    mutationFn: (vehicleType: string) => 
      emergencyService.activatePriorityCorridor({ vehicle_type: vehicleType, lane: selectedLane }),
    onSuccess: (data) => {
      setPriorityResult(data);
      // Invalidate queries so Navbar, RightStatusPanel, and Dashboard refresh immediately
      queryClient.invalidateQueries({ queryKey: ['emergencyEvents'] });
      queryClient.invalidateQueries({ queryKey: ['liveStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });

  const handleDispatch = (type: string) => {
    setSelectedVehicle(type);
    priorityMutation.mutate(type);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Emergency Priority Corridor Dispatch</h2>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Override signal cycles via live FastAPI API to grant Green Corridor clearance for emergency first responders.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className={`px-3 py-1.5 rounded-lg border font-semibold ${
            priorityResult ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {priorityResult ? 'CORRIDOR: ACTIVE' : 'CORRIDOR: STANDBY'}
          </span>
        </div>
      </div>

      {/* Manual Dispatch Control Panel */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Siren className="w-4 h-4 text-red-400" />
            <span>Green Corridor Override Controls</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">API: POST /api/v1/emergency/priority</span>
        </div>

        {/* Target Approach Lane Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step 1: Select Approach Lane</label>
          <div className="grid grid-cols-4 gap-4">
            {['A', 'B', 'C', 'D'].map((lane) => (
              <button
                key={lane}
                onClick={() => setSelectedLane(lane)}
                className={`py-3 px-4 rounded-lg font-mono text-sm font-bold border transition-colors ${
                  selectedLane === lane
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                Lane {lane}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Vehicle Priority Action Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step 2: Dispatch Emergency Corridor</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Activate Ambulance */}
            <button
              onClick={() => handleDispatch('Ambulance')}
              disabled={priorityMutation.isPending}
              className="py-3 px-4 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white text-xs font-bold flex items-center justify-center space-x-2 border border-red-400/30 transition-colors shadow-sm"
            >
              <Ambulance className="w-4 h-4" />
              <span>Activate Ambulance (Lane {selectedLane})</span>
            </button>

            {/* Activate Police */}
            <button
              onClick={() => handleDispatch('Police Car')}
              disabled={priorityMutation.isPending}
              className="py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white text-xs font-bold flex items-center justify-center space-x-2 border border-blue-400/30 transition-colors shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Activate Police (Lane {selectedLane})</span>
            </button>

            {/* Activate Fire Truck */}
            <button
              onClick={() => handleDispatch('Fire Truck')}
              disabled={priorityMutation.isPending}
              className="py-3 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white text-xs font-bold flex items-center justify-center space-x-2 border border-amber-400/30 transition-colors shadow-sm"
            >
              <Flame className="w-4 h-4" />
              <span>Activate Fire Truck (Lane {selectedLane})</span>
            </button>
          </div>
        </div>

        {/* Pending Spinner */}
        {priorityMutation.isPending && (
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 flex items-center space-x-3 text-xs text-blue-400 font-mono">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Sending POST /api/v1/emergency/priority request to backend...</span>
          </div>
        )}

        {/* Active Corridor Result Banner */}
        {priorityResult && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-3 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <span>
                <strong>MODE: {priorityResult.mode}</strong> — Granted GREEN phase to Lane {priorityResult.green_lane}. Other lanes set to {priorityResult.other_lanes}.
              </span>
            </div>
            <span className="text-slate-300 font-semibold">Est. Clearance: {priorityResult.estimated_clearance}</span>
          </div>
        )}

        {/* Mutation Error */}
        {priorityMutation.isError && (
          <ErrorState
            title="Dispatch Failed"
            message={priorityMutation.error.message}
            onRetry={() => handleDispatch(selectedVehicle)}
          />
        )}
      </div>

      {/* Emergency Events Log Table (Live DB Records) */}
      {isError ? (
        <ErrorState
          title="Failed to Load Emergency Events"
          message="Could not connect to FastAPI database."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Emergency Incident History (Live PostgreSQL Records)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Total Logged: {events?.length ?? 0}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 uppercase font-mono text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Vehicle Type</th>
                  <th className="py-3 px-4">Location / Lane</th>
                  <th className="py-3 px-4">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono">
                {events && events.length > 0 ? (
                  events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3 px-4 text-red-400 font-bold">#{evt.id}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-100">{evt.vehicle_type}</td>
                      <td className="py-3 px-4 text-slate-300">{evt.location}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          evt.status === 'GREEN_CORRIDOR'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 font-sans">
                      No emergency incidents recorded in database. Trigger a corridor above to test.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
