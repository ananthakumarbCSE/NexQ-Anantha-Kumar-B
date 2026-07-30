import { apiClient } from '../api/client';
import type { 
  EmergencyEventResponse, 
  EmergencyPriorityRequest, 
  EmergencyPriorityResponse 
} from '../types';

export const emergencyService = {
  getEvents: async (): Promise<EmergencyEventResponse[]> => {
    const response = await apiClient.get<EmergencyEventResponse[]>('/api/v1/emergency');
    return response.data;
  },

  createEvent: async (vehicleType: string, location: string): Promise<EmergencyEventResponse> => {
    const response = await apiClient.post<EmergencyEventResponse>('/api/v1/emergency', {
      vehicle_type: vehicleType,
      location: location,
    });
    return response.data;
  },

  activatePriorityCorridor: async (payload: EmergencyPriorityRequest): Promise<EmergencyPriorityResponse> => {
    const response = await apiClient.post<EmergencyPriorityResponse>('/api/v1/emergency/priority', payload);
    return response.data;
  },
};
