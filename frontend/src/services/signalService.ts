import { apiClient } from '../api/client';
import type { TrafficSignalResponse } from '../types';

export const signalService = {
  getSignals: async (): Promise<TrafficSignalResponse[]> => {
    const response = await apiClient.get<TrafficSignalResponse[]>('/api/v1/signal');
    return response.data;
  },

  createSignal: async (lane: string, signalColor: string, greenDuration: number): Promise<TrafficSignalResponse> => {
    const response = await apiClient.post<TrafficSignalResponse>('/api/v1/signal', {
      lane: lane,
      signal_color: signalColor,
      green_duration: greenDuration,
    });
    return response.data;
  },
};
