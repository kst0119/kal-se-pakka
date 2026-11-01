import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Trash2, Hourglass, AlertCircle, Zap, Edit3 } from 'lucide-react';
import { CategoryBadge, ImportanceBadge, StatusBadge } from '../common/Badge';
import { formatDate, getRelativeTimeDescription, isOverdue } from '../../utils/dateUtils';
import { useTask } from '../../context/TaskContext';

const TaskCard = ({ task }) => {
  const { toggleTaskStatus, deleteTask, setPostponeModalTask, setEditModalTask } = useTask();
  const isCompleted = task.status === 'Completed';
  const taskOverdue = isOverdue(task.deadline, task.status);

  return (
    <div
      className={`
        group relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 border transition-all duration-200
        ${
          isCompleted
            ? 'bg-cream-100/50 dark:bg-charcoal-900/40 border-cream-200 dark:border-charcoal-800 opacity-65'
            : taskOverdue
            ? 'bg-white dark:bg-charcoal-850 border-rose-500/40 shadow-sm hover:border-rose-500'
            : 'bg-white dark:bg-charcoal-850 border-cream-200 dark:border-charcoal-750 shadow-card-light dark:shadow-card-dark hover:border-coral-500/50 hover:-translate-y-0.5'
        }
      `}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CategoryBadge category={task.category} />
            <ImportanceBadge importance={task.importance} />
            {task.priority !== undefined && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-mono font-black px-2 py-0.5 rounded-lg bg-lime-400 text-charcoal-950 shadow-sm"
                title="Calculated Priority Score: (0.5×Urgency + 0.3×Importance + 0.2×Effort)"
              >
                <Zap className="w-3 h-3 text-charcoal-950" />
                {task.priority.toFixed(1)}
              </span>
            )}
          </div>

          <StatusBadge status={task.status} isOverdue={taskOverdue} />
        </div>

        {/* Task Title & Description */}
        <div className="flex items-start gap-3 mb-3">
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className="mt-0.5 text-charcoal-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors shrink-0 cursor-pointer"
            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-lime-500" />
            ) : (
              <Circle className="w-5 h-5 group-hover:text-coral-500" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h3
              className={`text-base font-extrabold text-charcoal-950 dark:text-white tracking-tight leading-snug ${
                isCompleted ? 'line-through text-charcoal-400 dark:text-charcoal-500' : ''
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-1.5 text-xs text-charcoal-600 dark:text-charcoal-300 line-clamp-2 leading-relaxed font-medium">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Postponement warning pill */}
        {task.postponedCount && task.postponedCount > 0 && (
          <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
            <Hourglass className="w-3.5 h-3.5 shrink-0" />
            <span>Postponed {task.postponedCount} time{task.postponedCount > 1 ? 's' : ''} ("Kal Se Pakka")</span>
          </div>
        )}
      </div>

      {/* Footer Info: Deadline, Duration, and Actions */}
      <div className="mt-4 pt-3.5 border-t border-cream-200 dark:border-charcoal-800">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${taskOverdue ? 'text-rose-500' : 'text-coral-500'}`} />
            <span className={`font-bold ${taskOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-charcoal-800 dark:text-cream-200'}`}>
              {formatDate(task.deadline)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-charcoal-500 dark:text-charcoal-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono text-charcoal-800 dark:text-cream-200 font-bold">{task.duration}h</span>
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-charcoal-500 dark:text-charcoal-400">
            {getRelativeTimeDescription(task.deadline, task.status)}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditModalTask(task)}
              className="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-cream-200 dark:hover:bg-charcoal-750 transition-colors cursor-pointer"
              title="Edit Task Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {!isCompleted && (
              <button
                onClick={() => setPostponeModalTask(task)}
                className="p-1.5 rounded-xl text-charcoal-400 hover:text-amber-500 hover:bg-cream-200 dark:hover:bg-charcoal-750 transition-colors cursor-pointer"
                title="Postpone Task (Kal Se Pakka)"
              >
                <Hourglass className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => toggleTaskStatus(task.id)}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isCompleted
                  ? 'text-charcoal-400 hover:text-coral-500 hover:bg-cream-200 dark:hover:bg-charcoal-750'
                  : 'text-charcoal-400 hover:text-lime-600 hover:bg-cream-200 dark:hover:bg-charcoal-750'
              }`}
              title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-xl text-charcoal-400 hover:text-rose-500 hover:bg-cream-200 dark:hover:bg-charcoal-750 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
