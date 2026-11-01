import React from 'react';
import Card from '../common/Card';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'coral',
  onClick,
}) => {
  const colorMap = {
    coral: {
      border: 'hover:border-coral-500/50',
      iconBg: 'bg-coral-500/15 text-coral-600 dark:text-coral-400 border-coral-500/20',
      highlight: 'text-coral-600 dark:text-coral-400',
    },
    lime: {
      border: 'hover:border-lime-500/50',
      iconBg: 'bg-lime-400/20 text-lime-800 dark:text-lime-300 border-lime-500/30',
      highlight: 'text-lime-700 dark:text-lime-300',
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
      highlight: 'text-amber-600 dark:text-amber-400',
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20',
      highlight: 'text-rose-600 dark:text-rose-400',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      highlight: 'text-emerald-600 dark:text-emerald-400',
    },
  };

  const scheme = colorMap[accentColor] || colorMap.coral;

  return (
    <Card
      hoverEffect={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden transition-all ${scheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal-500 dark:text-charcoal-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-charcoal-950 dark:text-white font-mono tracking-tight">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-charcoal-600 dark:text-charcoal-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-2xl border ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
