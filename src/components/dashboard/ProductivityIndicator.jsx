import React from 'react';
import { Target, Zap, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
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
        .filter(t => t.status !== 'Completed')
        .reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);

  // SVG circular progress calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  // Procrastination evaluation label from real formula
  const getProcrastinationRating = () => {
    if (procrastinationScore >= 70) return { label: 'High Delay Risk', color: 'text-rose-400', bar: 'bg-rose-500' };
    if (procrastinationScore >= 40) return { label: 'Moderate Slip', color: 'text-amber-400', bar: 'bg-amber-500' };
    if (completionRate >= 50) return { label: 'High Focus Flow', color: 'text-emerald-400', bar: 'bg-emerald-500' };
    return { label: 'Active Progress', color: 'text-indigo-400', bar: 'bg-indigo-500' };
  };

  const rating = getProcrastinationRating();

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Productivity Indicator</h3>
              <p className="text-xs text-slate-400">Momentum & completion telemetry</p>
            </div>
          </div>

          <span className="flex items-center gap-1 text-xs font-semibold text-purple-300 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/25">
            <Zap className="w-3.5 h-3.5" />
            Active
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
                className="text-slate-800/80 fill-none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#purpleBlueGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out fill-none"
              />
              <defs>
                <linearGradient id="purpleBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {completionRate}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Done</span>
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Status Ratio</span>
                <span className={`font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: `${(completedTasks / (totalTasks || 1)) * 100}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                  title="Completed"
                />
                <div
                  style={{ width: `${(pendingTasks / (totalTasks || 1)) * 100}%` }}
                  className="bg-indigo-500 transition-all duration-500"
                  title="Pending"
                />
                <div
                  style={{ width: `${(overdueTasks / (totalTasks || 1)) * 100}%` }}
                  className="bg-rose-500 transition-all duration-500"
                  title="Overdue"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 pt-1 space-y-1">
              <div className="flex items-center justify-between">
                <span>Pending Workload:</span>
                <span className="font-mono text-slate-200 font-semibold">{pendingHours.toFixed(1)} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Procrastination Score:</span>
                <span className={`font-mono font-semibold ${rating.color}`}>
                  {procrastinationScore} / 100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational insight footer with contextual humour */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 truncate max-w-xs">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">{humorMessage?.message || `Completed: ${completedTasks} / ${totalTasks} tasks`}</span>
        </span>
        <span className="text-slate-500 shrink-0">Score: {procrastinationScore}</span>
      </div>
    </Card>
  );
};

export default ProductivityIndicator;

