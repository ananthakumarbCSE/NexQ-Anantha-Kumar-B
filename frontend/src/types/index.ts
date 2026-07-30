/* Q-Edge Guardian – Frontend TypeScript Type Definitions. */

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  badgeText?: string;
  badgeColor?: 'emerald' | 'amber' | 'red' | 'blue' | 'slate';
}

export interface SignalState {
  lane: 'A' | 'B' | 'C' | 'D';
  color: 'RED' | 'YELLOW' | 'GREEN';
  duration: number;
  vehicleCount: number;
}

export interface SystemHealth {
  backendStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  databaseStatus: 'CONNECTED' | 'DISCONNECTED';
  yoloStatus: 'LOADED' | 'UNLOADED';
  fps: number;
  inferenceTimeMs: number;
  connectionLatencyMs: number;
}

export interface TrafficRecordMock {
  id: number;
  timestamp: string;
  vehicleCount: number;
  congestionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  recommendation: string;
}

export interface EmergencyEventMock {
  id: number;
  timestamp: string;
  vehicleType: string;
  location: string;
  status: 'ACTIVE' | 'GREEN_CORRIDOR' | 'CLEARED';
}

export interface QuantumMetrics {
  qubitsAllocated: number;
  annealingTimeUs: number;
  energyState: number;
  optimizationGain: string;
}

// ── Live Backend API Response Interfaces ─────────────────────────────

export interface RootResponse {
  project: string;
  status: string;
}

export interface HealthResponse {
  status: string;
}

export interface DashboardResponse {
  active_signals: number;
  traffic_records: number;
  emergency_events: number;
}

export interface SystemStatusResponse {
  yolo_loaded: boolean;
  model_name: string;
  database_connected: boolean;
  inference_time_ms: number;
}

export interface LiveStatusResponse {
  vehicles: number;
  density: string;
  green_time: number;
  emergency: boolean;
}

export interface TrafficRecordResponse {
  id: number;
  timestamp: string;
  vehicle_count: number;
  congestion_level: string;
  recommendation: string;
}

export interface EmergencyEventResponse {
  id: number;
  timestamp: string;
  vehicle_type: string;
  status: string;
  location: string;
}

export interface TrafficSignalResponse {
  id: number;
  lane: string;
  signal_color: string;
  green_duration: number;
}

export interface EmergencyPriorityRequest {
  vehicle_type: string;
  lane: string;
}

export interface EmergencyPriorityResponse {
  mode: string;
  green_lane: string;
  other_lanes: string;
  estimated_clearance: string;
}

export interface VehicleCounts {
  car: number;
  bus: number;
  truck: number;
  motorcycle: number;
  bicycle: number;
  total: number;
}

export interface DensityInfo {
  level: string;
  percentage: number;
}

export interface SignalRecommendation {
  lane: string;
  green_time: number;
  reason: string;
}

export interface VideoAnalysisResponse {
  vehicle_counts: VehicleCounts;
  total_vehicles: number;
  density: DensityInfo;
  recommendation: SignalRecommendation;
  frames_processed: number;
  inference_time_ms: number;
}

export interface QuantumOptimizeRequest {
  lane_A: number;
  lane_B: number;
  lane_C: number;
  lane_D: number;
}

export interface LaneTimings {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface QuantumOptimizeResponse {
  current_timings: LaneTimings;
  optimized_timings: LaneTimings;
  estimated_waiting_time_reduction: number;
  optimization_method: string;
}
