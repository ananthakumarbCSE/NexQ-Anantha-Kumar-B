import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 select-none">
      <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-3xl font-bold text-slate-50 font-mono">404 - Page Not Found</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The requested system route does not exist or has been relocated.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-slate-50 font-medium text-sm transition-colors border border-blue-400/30"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
