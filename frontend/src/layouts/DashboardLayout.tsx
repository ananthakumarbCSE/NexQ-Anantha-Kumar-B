import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { RightStatusPanel } from '../components/RightStatusPanel';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Fixed Header */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation */}
        <Sidebar />

        {/* Center Content Viewport */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-900/90">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>

        {/* Right Telemetry & Status Panel */}
        <RightStatusPanel />
      </div>
    </div>
  );
};
