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
  Flame,
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
      <div className="rounded-3xl bg-white dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 p-6 sm:p-8 shadow-card-light dark:shadow-card-dark">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-lime-400 text-charcoal-950 flex items-center justify-center font-black text-2xl shadow-lime-glow shrink-0">
              👑
            </div>
            <div>
              <h3 className="text-lg font-black text-charcoal-950 dark:text-white">
                Queue Cleared! God Mode Unlocked.
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 font-medium">
                Max Heap is currently empty. You conquered all active assignments and project deadlines!
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('add-task')}
          >
            Schedule Next Quest
          </Button>
        </div>
      </div>
    );
  }

  const taskIsOverdue = isOverdue(task.deadline, task.status);
  const priorityData = task.priorityData || {};
  const priorityScore = task.priority !== undefined ? task.priority : (priorityData.priorityScore || 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-charcoal-850 border-2 border-coral-500/40 p-6 sm:p-8 shadow-card-light dark:shadow-card-dark transition-colors">
      {/* Top accent indicator */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-coral-500" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
            <Flame className="w-3.5 h-3.5" />
            Max Heap Root • Lock In
          </span>

          {/* Prominent Priority Score Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400 text-charcoal-950 text-xs font-black font-mono shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            <span>Score: {priorityScore.toFixed(1)} / 100</span>
          </div>

          {taskIsOverdue && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-black flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Overdue ⚠️
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CategoryBadge category={task.category} />
          <ImportanceBadge importance={task.importance} />
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2 mb-5">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-950 dark:text-white tracking-tight">
          {task.title}
        </h2>
        {task.description && (
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed max-w-3xl font-medium">
            {task.description}
          </p>
        )}
      </div>

      {/* Formula & Breakdown Component Chips */}
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-750 flex items-center justify-between text-xs">
          <span className="text-charcoal-500 dark:text-charcoal-400 font-bold">Urgency (50% wt):</span>
          <span className="font-mono font-black text-coral-500">
            {priorityData.urgencyScore !== undefined ? `${priorityData.urgencyScore.toFixed(1)} / 100` : '—'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-750 flex items-center justify-between text-xs">
          <span className="text-charcoal-500 dark:text-charcoal-400 font-bold">Importance (30% wt):</span>
          <span className="font-mono font-black text-amber-500">
            {priorityData.importanceScore !== undefined ? `${priorityData.importanceScore} / 100` : '—'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-750 flex items-center justify-between text-xs">
          <span className="text-charcoal-500 dark:text-charcoal-400 font-bold">Effort (20% wt):</span>
          <span className="font-mono font-black text-lime-600 dark:text-lime-400">
            {priorityData.effortScore !== undefined ? `${priorityData.effortScore} / 100` : '—'}
          </span>
        </div>
      </div>

      {/* Algorithmic Reason Box */}
      <div className="mb-6 p-4 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-coral-500/20 text-xs text-charcoal-700 dark:text-charcoal-300 flex items-start gap-3">
        <div className="p-1 rounded-lg bg-coral-500/10 text-coral-500 mt-0.5 shrink-0">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-coral-600 dark:text-coral-400">Why do this first? </span>
          <span className="font-medium">{stats.recommendationReason}</span>
        </div>
      </div>

      {/* Metadata & Actions footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-cream-200 dark:border-charcoal-800">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-coral-500" />
            <span className="font-bold text-charcoal-800 dark:text-cream-200">{formatDate(task.deadline)}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                taskIsOverdue
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  : 'bg-cream-200 dark:bg-charcoal-750 text-charcoal-700 dark:text-cream-200'
              }`}
            >
              {getRelativeTimeDescription(task.deadline, task.status)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-charcoal-400" />
            <span className="text-charcoal-600 dark:text-charcoal-300 font-medium">{task.duration} hrs estimated</span>
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
            className="flex-1 sm:flex-initial shadow-coral-glow"
            icon={CheckCircle2}
          >
            Mark as Done
          </Button>

          {/* Jump to tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className="p-2 text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white transition-colors cursor-pointer"
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
