import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Trash2, Hourglass, AlertCircle } from 'lucide-react';
import { CategoryBadge, ImportanceBadge, StatusBadge } from '../common/Badge';
import { formatDate, getRelativeTimeDescription, isOverdue } from '../../utils/dateUtils';
import Button from '../common/Button';
import { useTask } from '../../context/TaskContext';

const TaskCard = ({ task }) => {
  const { toggleTaskStatus, deleteTask, setPostponeModalTask } = useTask();
  const isCompleted = task.status === 'Completed';
  const taskOverdue = isOverdue(task.deadline, task.status);

  return (
    <div
      className={`
        group relative flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200
        ${
          isCompleted
            ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
            : taskOverdue
            ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/50 hover:shadow-card-hover'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-card-hover'
        }
      `}
    >
      <div>
        {/* Top badges: Category, Importance, Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CategoryBadge category={task.category} />
            <ImportanceBadge importance={task.importance} />
          </div>

          <StatusBadge status={task.status} isOverdue={taskOverdue} />
        </div>

        {/* Task Title & Description */}
        <div className="flex items-start gap-3 mb-3">
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
            ) : (
              <Circle className="w-5 h-5 group-hover:text-indigo-400" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h3
              className={`text-base font-bold text-white tracking-tight ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Notes or Postponement warning if any */}
        {task.postponedCount && task.postponedCount > 0 && (
          <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5 text-[11px] text-amber-300">
            <Hourglass className="w-3.5 h-3.5 shrink-0" />
            <span>Postponed {task.postponedCount} time{task.postponedCount > 1 ? 's' : ''} ("Kal Se Pakka")</span>
          </div>
        )}
      </div>

      {/* Footer Info: Deadline, Duration, and Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${taskOverdue ? 'text-rose-400' : 'text-indigo-400'}`} />
            <span className={taskOverdue ? 'text-rose-300 font-semibold' : 'text-slate-300'}>
              {formatDate(task.deadline)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-slate-300">{task.duration}h</span>
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 font-medium">
            {getRelativeTimeDescription(task.deadline, task.status)}
          </span>

          <div className="flex items-center gap-1.5">
            {!isCompleted && (
              <button
                onClick={() => setPostponeModalTask(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                title="Postpone Task (Kal Se Pakka)"
              >
                <Hourglass className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => toggleTaskStatus(task.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isCompleted
                  ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
              }`}
              title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
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

