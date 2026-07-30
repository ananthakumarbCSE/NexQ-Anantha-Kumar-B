import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Eye, 
  BarChart3, 
  Siren, 
  Atom, 
  Settings,
  X 
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Live Detection', path: '/live', icon: <Eye className="w-5 h-5" /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'Emergency', path: '/emergency', icon: <Siren className="w-5 h-5 text-red-400" /> },
  { name: 'Quantum', path: '/quantum', icon: <Atom className="w-5 h-5 text-blue-400" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-slate-800 border-r border-slate-700 
        flex flex-col justify-between p-4 shrink-0 select-none
        transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          <div className="flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </span>
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="lg:hidden text-slate-400 hover:text-slate-200 p-1"
                aria-label="Close navigation sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-700/60 hover:text-slate-100'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Telemetry Footer */}
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Telemetry:</span>
            <span className="text-emerald-400 font-mono font-semibold">ACTIVE</span>
          </div>
          <div className="text-[11px] text-slate-400 leading-normal">
            Edge Node: <span className="font-mono text-slate-300">us-east-junction-04</span>
          </div>
        </div>
      </aside>
    </>
  );
};
