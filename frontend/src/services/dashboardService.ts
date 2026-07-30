import { apiClient } from '../api/client';
import type { DashboardResponse } from '../types';

export const dashboardService = {
  getSummary: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get<DashboardResponse>('/api/v1/dashboard');
    return response.data;
  },
};
