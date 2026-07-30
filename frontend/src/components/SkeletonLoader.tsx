import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 bg-slate-700 rounded" />
        <div className="h-9 w-9 bg-slate-700 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="h-8 w-36 bg-slate-700 rounded" />
        <div className="h-3 w-48 bg-slate-700/60 rounded" />
      </div>
      <div className="pt-2 border-t border-slate-700/50">
        <div className="h-3 w-24 bg-slate-700/40 rounded" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div className="h-4 w-40 bg-slate-700 rounded" />
        <div className="h-3 w-24 bg-slate-700/60 rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-full bg-slate-900/60 rounded border border-slate-700/40" />
        ))}
      </div>
    </div>
  );
};
