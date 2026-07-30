import { apiClient } from '../api/client';
import type { 
  LiveStatusResponse, 
  TrafficRecordResponse, 
  VideoAnalysisResponse 
} from '../types';

export const trafficService = {
  getLiveStatus: async (): Promise<LiveStatusResponse> => {
    const response = await apiClient.get<LiveStatusResponse>('/api/v1/live/status');
    return response.data;
  },

  getTrafficRecords: async (): Promise<TrafficRecordResponse[]> => {
    const response = await apiClient.get<TrafficRecordResponse[]>('/api/v1/traffic');
    return response.data;
  },

  createTrafficRecord: async (vehicleCount: number, congestionLevel: string): Promise<TrafficRecordResponse> => {
    const response = await apiClient.post<TrafficRecordResponse>('/api/v1/traffic', {
      vehicle_count: vehicleCount,
      congestion_level: congestionLevel,
    });
    return response.data;
  },

  analyzeVideo: async (file?: File, lane: string = 'A'): Promise<VideoAnalysisResponse> => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    const response = await apiClient.post<VideoAnalysisResponse>(
      `/api/v1/analyze/video?lane=${lane}`,
      file ? formData : null,
      {
        headers: file ? { 'Content-Type': 'multipart/form-data' } : {},
      }
    );
    return response.data;
  },
};
