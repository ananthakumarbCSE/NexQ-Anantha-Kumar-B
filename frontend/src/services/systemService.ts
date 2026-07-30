import { apiClient } from '../api/client';
import type { RootResponse, HealthResponse, SystemStatusResponse } from '../types';

export const systemService = {
  getRoot: async (): Promise<RootResponse> => {
    const response = await apiClient.get<RootResponse>('/');
    return response.data;
  },

  getHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },

  getSystemStatus: async (): Promise<SystemStatusResponse> => {
    const response = await apiClient.get<SystemStatusResponse>('/api/v1/system');
    return response.data;
  },
};
