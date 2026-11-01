import React from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Hourglass,
  Calendar,
  AlertCircle,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { CategoryBadge, ImportanceBadge } from '../common/Badge';
import { formatDate, getRelativeTimeDescription, isOverdue } from '../../utils/dateUtils';
import Button from '../common/Button';

const NextRecommendedTask = () => {
  const { stats, toggleTaskStatus, setPostponeModalTask, setActiveTab } = useTask();
  const task = stats.recommendedTask;

  if (!task) {
    return (
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 rounded-2xl border border-indigo-500/20 p-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">All Caught Up!</h3>
              <p className="text-sm text-slate-300">
                Max Heap is currently empty. All pending tasks have been completed!
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('add-task')}
          >
            Schedule a New Task
          </Button>
        </div>
      </div>
    );
  }

  const taskIsOverdue = isOverdue(task.deadline, task.status);
  const priorityData = task.priorityData || {};
  const priorityScore = task.priority !== undefined ? task.priority : (priorityData.priorityScore || 0);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-purple-950/40 border border-indigo-500/30 p-6 shadow-card">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400" />

      {/* Header with smart recommendation badge and Priority Score Display */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            Max Heap Root • Highest Priority
          </span>

          {/* Prominent Priority Score Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border border-purple-500/40 text-xs font-bold font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Priority Score: {priorityScore.toFixed(1)} / 100</span>
          </div>

          {taskIsOverdue && (
            <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Critical Overdue
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CategoryBadge category={task.category} />
          <ImportanceBadge importance={task.importance} />
        </div>
      </div>

      {/* Main Task Title & Description */}
      <div className="space-y-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {task.title}
        </h2>
        {task.description && (
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {task.description}
          </p>
        )}
      </div>

      {/* Formula & Breakdown Component Chips */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Urgency (50% wt):</span>
          <span className="font-mono font-bold text-indigo-300">
            {priorityData.urgencyScore !== undefined ? `${priorityData.urgencyScore.toFixed(1)} / 100` : '—'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Importance (30% wt):</span>
          <span className="font-mono font-bold text-purple-300">
            {priorityData.importanceScore !== undefined ? `${priorityData.importanceScore} / 100` : '—'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Effort (20% wt):</span>
          <span className="font-mono font-bold text-sky-300">
            {priorityData.effortScore !== undefined ? `${priorityData.effortScore} / 100` : '—'}
          </span>
        </div>
      </div>

      {/* Algorithmic Reason Box */}
      <div className="mb-5 p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-3">
        <div className="p-1 rounded bg-indigo-500/20 text-indigo-300 mt-0.5">
          <Activity className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-semibold text-indigo-300">Recommendation Rationale: </span>
          <span>{stats.recommendationReason}</span>
        </div>
      </div>

      {/* Metadata & Actions footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">{formatDate(task.deadline)}</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                taskIsOverdue
                  ? 'bg-rose-500/20 text-rose-300 font-semibold'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              ({getRelativeTimeDescription(task.deadline, task.status)})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">{task.duration} hrs estimated</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Postpone button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPostponeModalTask(task)}
            className="flex-1 sm:flex-initial"
            icon={Hourglass}
          >
            Postpone
          </Button>

          {/* Mark Complete button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => toggleTaskStatus(task.id)}
            className="flex-1 sm:flex-initial"
            icon={CheckCircle2}
          >
            Mark as Done
          </Button>

          {/* Jump to tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
            title="View all tasks"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextRecommendedTask;
