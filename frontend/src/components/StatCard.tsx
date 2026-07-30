import React from 'react';
import type { MetricCardProps } from '../types';

export const StatCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon,
  badgeText,
  badgeColor = 'blue',
}) => {
  const badgeStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const changeStyles = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-colors shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="w-9 h-9 rounded-lg bg-slate-900/60 border border-slate-700/80 flex items-center justify-center text-slate-300">
          {icon}
        </div>
      </div>

      {/* Main Value */}
      <div className="space-y-1">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold font-mono tracking-tight text-slate-50">
            {value}
          </span>
          {badgeText && (
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${badgeStyles[badgeColor]}`}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Footer / Change indicator */}
      {change && (
        <div className="pt-2 border-t border-slate-700/50 flex items-center text-xs">
          <span className={`font-mono font-medium ${changeStyles[changeType]}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
};
