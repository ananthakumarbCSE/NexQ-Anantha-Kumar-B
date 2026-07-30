import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LiveDetectionPage } from './pages/LiveDetectionPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { QuantumPage } from './pages/QuantumPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Configure TanStack React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 2000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="live" element={<LiveDetectionPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="emergency" element={<EmergencyPage />} />
              <Route path="quantum" element={<QuantumPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
