import React from 'react';
import Card from '../common/Card';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'indigo',
  onClick,
}) => {
  const colorMap = {
    indigo: {
      border: 'hover:border-indigo-500/50',
      iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
      highlight: 'text-indigo-400',
      badge: 'bg-indigo-500/10 text-indigo-300',
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      highlight: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-300',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      highlight: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-300',
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
      highlight: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-300',
    },
    purple: {
      border: 'hover:border-purple-500/50',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
      highlight: 'text-purple-400',
      badge: 'bg-purple-500/10 text-purple-300',
    },
  };

  const scheme = colorMap[accentColor] || colorMap.indigo;

  return (
    <Card
      hoverEffect={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden transition-all ${scheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl border ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

