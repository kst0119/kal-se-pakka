import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Trash2, Hourglass, Zap, Edit3 } from 'lucide-react';
import { CategoryBadge, ImportanceBadge, StatusBadge } from '../common/Badge';
import { formatDate, getRelativeTimeDescription, isOverdue } from '../../utils/dateUtils';
import { useTask } from '../../context/TaskContext';

const TaskTable = ({ tasks }) => {
  const { toggleTaskStatus, deleteTask, setPostponeModalTask, setEditModalTask } = useTask();

  return (
    <div className="overflow-x-auto rounded-3xl border border-cream-200 dark:border-charcoal-750 bg-white dark:bg-charcoal-850 shadow-card-light dark:shadow-card-dark">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-cream-200 dark:border-charcoal-800 text-[11px] font-black uppercase tracking-wider text-charcoal-500 dark:text-charcoal-400 bg-cream-50/70 dark:bg-charcoal-900/60">
            <th className="py-3.5 px-4">Task</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Deadline</th>
            <th className="py-3.5 px-4">Importance</th>
            <th className="py-3.5 px-4">Priority (Heap)</th>
            <th className="py-3.5 px-4">Duration</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-100 dark:divide-charcoal-800/80 text-xs sm:text-sm">
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const taskOverdue = isOverdue(task.deadline, task.status);

            return (
              <tr
                key={task.id}
                className={`
                  transition-colors hover:bg-cream-50/80 dark:hover:bg-charcoal-800/50
                  ${isCompleted ? 'opacity-60 bg-cream-100/30 dark:bg-charcoal-900/30' : ''}
                `}
              >
                {/* Title & Description */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 text-charcoal-400 hover:text-coral-500 transition-colors shrink-0 cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-lime-500" />
                      ) : (
                        <Circle className="w-4 h-4 hover:text-coral-500" />
                      )}
                    </button>
                    <div>
                      <div
                        className={`font-bold text-charcoal-950 dark:text-cream-50 line-clamp-1 ${
                          isCompleted ? 'line-through text-charcoal-400 dark:text-charcoal-500' : ''
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 line-clamp-1 mt-0.5">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <CategoryBadge category={task.category} />
                </td>

                {/* Deadline */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Calendar className={`w-3.5 h-3.5 ${taskOverdue ? 'text-rose-500' : 'text-coral-500'}`} />
                    <span className={`font-bold ${taskOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-charcoal-800 dark:text-cream-200'}`}>
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </td>

                {/* Importance */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <ImportanceBadge importance={task.importance} />
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {task.priority !== undefined ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-black px-2 py-0.5 rounded-md bg-lime-400 text-charcoal-950">
                      <Zap className="w-3 h-3 text-charcoal-950" />
                      {task.priority.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-charcoal-400">—</span>
                  )}
                </td>

                {/* Duration */}
                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs font-bold text-charcoal-700 dark:text-cream-300">
                  {task.duration}h
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={task.status} isOverdue={taskOverdue} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditModalTask(task)}
                      className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-cream-200 dark:hover:bg-charcoal-750 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {!isCompleted && (
                      <button
                        onClick={() => setPostponeModalTask(task)}
                        className="p-1.5 rounded-lg text-charcoal-400 hover:text-amber-500 hover:bg-cream-200 dark:hover:bg-charcoal-750 transition-colors cursor-pointer"
                        title="Postpone"
                      >
                        <Hourglass className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-500 hover:bg-cream-200 dark:hover:bg-charcoal-750 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
