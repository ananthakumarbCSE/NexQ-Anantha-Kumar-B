import { apiClient } from '../api/client';
import type { QuantumOptimizeRequest, QuantumOptimizeResponse } from '../types';

export const quantumService = {
  optimizeSignals: async (request: QuantumOptimizeRequest): Promise<QuantumOptimizeResponse> => {
    const response = await apiClient.post<QuantumOptimizeResponse>('/api/v1/quantum/optimize', request);
    return response.data;
  },
};
