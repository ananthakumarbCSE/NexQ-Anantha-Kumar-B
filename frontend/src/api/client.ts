import axios from 'axios';

const DEFAULT_BASE_URL = 'http://127.0.0.1:8001';

export const getBaseUrl = (): string => {
  return localStorage.getItem('qedge_api_url') || DEFAULT_BASE_URL;
};

export const setBaseUrl = (url: string): void => {
  localStorage.setItem('qedge_api_url', url);
  apiClient.defaults.baseURL = url;
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Network request failed';
    return Promise.reject(new Error(message));
  }
);
