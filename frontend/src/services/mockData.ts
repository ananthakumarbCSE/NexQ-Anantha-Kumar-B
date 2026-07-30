import type { SystemHealth, SignalState, TrafficRecordMock, EmergencyEventMock, QuantumMetrics } from '../types';

export const mockSystemHealth: SystemHealth = {
  backendStatus: 'ONLINE',
  databaseStatus: 'CONNECTED',
  yoloStatus: 'LOADED',
  fps: 30,
  inferenceTimeMs: 12.4,
  connectionLatencyMs: 18,
};

export const mockSignalStates: SignalState[] = [
  { lane: 'A', color: 'GREEN', duration: 40, vehicleCount: 22 },
  { lane: 'B', color: 'RED', duration: 25, vehicleCount: 8 },
  { lane: 'C', color: 'RED', duration: 25, vehicleCount: 11 },
  { lane: 'D', color: 'RED', duration: 25, vehicleCount: 6 },
];

export const mockTrafficRecords: TrafficRecordMock[] = [
  { id: 101, timestamp: '19:22:45', vehicleCount: 47, congestionLevel: 'HIGH', recommendation: 'Extend Lane A green phase by 15s.' },
  { id: 102, timestamp: '19:20:10', vehicleCount: 24, congestionLevel: 'MEDIUM', recommendation: 'Maintain standard 25s adaptive cycle.' },
  { id: 103, timestamp: '19:17:30', vehicleCount: 9, congestionLevel: 'LOW', recommendation: 'Baseline 10s phase sufficient.' },
  { id: 104, timestamp: '19:15:00', vehicleCount: 52, congestionLevel: 'VERY_HIGH', recommendation: 'Enforce maximum 60s green phase & divert inflow.' },
];

export const mockEmergencyEvents: EmergencyEventMock[] = [
  { id: 201, timestamp: '19:21:04', vehicleType: 'Ambulance', location: 'Approach Lane B', status: 'GREEN_CORRIDOR' },
  { id: 202, timestamp: '18:45:12', vehicleType: 'Fire Truck', location: 'Approach Lane A', status: 'CLEARED' },
  { id: 203, timestamp: '17:10:30', vehicleType: 'Police Rescue', location: 'Approach Lane D', status: 'CLEARED' },
];

export const mockQuantumMetrics: QuantumMetrics = {
  qubitsAllocated: 64,
  annealingTimeUs: 14.2,
  energyState: -128.45,
  optimizationGain: '+34.8% throughput efficiency',
};
