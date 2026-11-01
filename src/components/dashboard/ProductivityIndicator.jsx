import React from 'react';
import { Target, Zap, CheckCircle2, AlertTriangle, TrendingUp, Flame } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';

const ProductivityIndicator = () => {
  const { tasks, stats } = useTask();

  const totalTasks = stats.total;
  const completedTasks = stats.completed;
  const pendingTasks = stats.pending;
  const overdueTasks = stats.overdue;
  const completionRate = stats.completionRate;
  const procrastinationScore = stats.procrastinationScore || 0;
  const humorMessage = stats.humorMessage;

  // Calculate total pending hours
  const pendingHours = stats.pendingHours !== undefined
    ? stats.pendingHours
    : tasks
        .filter((t) => t.status !== 'Completed')
        .reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);

  // SVG circular progress calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  // Procrastination evaluation label from real formula
  const getProcrastinationRating = () => {
    if (procrastinationScore >= 70) {
      return { label: 'High Delay Risk 💀', color: 'text-rose-500', bar: 'bg-rose-500' };
    }
    if (procrastinationScore >= 40) {
      return { label: 'Moderate Delay ⏳', color: 'text-amber-500', bar: 'bg-amber-500' };
    }
    if (completionRate >= 50) {
      return { label: 'Peak Focus Flow 🔥', color: 'text-lime-600 dark:text-lime-400', bar: 'bg-lime-400' };
    }
    return { label: 'Active Progress 🚀', color: 'text-coral-500', bar: 'bg-coral-500' };
  };

  const rating = getProcrastinationRating();

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-cream-200 dark:border-charcoal-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-coral-500/10 text-coral-500">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-charcoal-950 dark:text-white text-base">
                Productivity Radar
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">Momentum & delay telemetry</p>
            </div>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-black text-charcoal-950 px-2.5 py-1 rounded-full bg-lime-400 shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            Live
          </span>
        </div>

        {/* Circular Gauge and Metrics */}
        <div className="flex items-center gap-6 my-2">
          {/* Radial progress ring */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                className="text-cream-300 dark:text-charcoal-750 fill-none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#coralLimeGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out fill-none"
              />
              <defs>
                <linearGradient id="coralLimeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF5C35" />
                  <stop offset="100%" stopColor="#C6F10E" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-charcoal-950 dark:text-white font-mono tracking-tight">
                {completionRate}%
              </span>
              <span className="text-[10px] uppercase font-black text-charcoal-400">Done</span>
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-charcoal-500 dark:text-charcoal-400 font-bold">Status Ratio</span>
                <span className={`font-black text-[11px] ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-cream-200 dark:bg-charcoal-750 overflow-hidden flex">
                <div
                  style={{ width: `${(completedTasks / (totalTasks || 1)) * 100}%` }}
                  className="bg-lime-400 transition-all duration-500"
                  title="Completed"
                />
                <div
                  style={{ width: `${(pendingTasks / (totalTasks || 1)) * 100}%` }}
                  className="bg-coral-500 transition-all duration-500"
                  title="Pending"
                />
                <div
                  style={{ width: `${(overdueTasks / (totalTasks || 1)) * 100}%` }}
                  className="bg-rose-500 transition-all duration-500"
                  title="Overdue"
                />
              </div>
            </div>

            <div className="text-xs text-charcoal-500 dark:text-charcoal-400 pt-1 space-y-1">
              <div className="flex items-center justify-between">
                <span>Pending Workload:</span>
                <span className="font-mono text-charcoal-900 dark:text-cream-100 font-bold">{pendingHours.toFixed(1)} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delay Score:</span>
                <span className={`font-mono font-black ${rating.color}`}>
                  {procrastinationScore} / 100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational insight footer with contextual humour */}
      <div className="mt-4 pt-3 border-t border-cream-200 dark:border-charcoal-800 flex items-center justify-between text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">
        <span className="flex items-center gap-1.5 truncate max-w-xs">
          <Flame className="w-3.5 h-3.5 text-coral-500 shrink-0" />
          <span className="truncate">{humorMessage?.message || `Completed: ${completedTasks} / ${totalTasks} tasks`}</span>
        </span>
        <span className="text-charcoal-400 shrink-0 font-mono">Score: {procrastinationScore}</span>
      </div>
    </Card>
  );
};

export default ProductivityIndicator;
