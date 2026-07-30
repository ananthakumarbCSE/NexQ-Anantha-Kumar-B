import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ToastMessage } from '../context/ToastContext';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  const icons = {
    info: <Info className="w-4 h-4 text-blue-400" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    danger: <AlertCircle className="w-4 h-4 text-red-400" />,
  };

  const borders = {
    info: 'border-blue-500/30 bg-slate-800 text-slate-100',
    success: 'border-emerald-500/30 bg-slate-800 text-slate-100',
    warning: 'border-amber-500/30 bg-slate-800 text-slate-100',
    danger: 'border-red-500/30 bg-slate-800 text-slate-100',
  };

  return (
    <div 
      role="region" 
      aria-label="System notifications" 
      className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full select-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-3.5 rounded-lg border ${borders[toast.type]} shadow-lg transition-all transform duration-200`}
        >
          <div className="flex items-center space-x-3 text-xs font-medium">
            {icons[toast.type]}
            <span>{toast.title}</span>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
