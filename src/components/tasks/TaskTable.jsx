import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Trash2, Hourglass } from 'lucide-react';
import { CategoryBadge, ImportanceBadge, StatusBadge } from '../common/Badge';
import { formatDate, getRelativeTimeDescription, isOverdue } from '../../utils/dateUtils';
import { useTask } from '../../context/TaskContext';

const TaskTable = ({ tasks }) => {
  const { toggleTaskStatus, deleteTask, setPostponeModalTask } = useTask();

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
            <th className="py-3.5 px-4">Task</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Deadline</th>
            <th className="py-3.5 px-4">Importance</th>
            <th className="py-3.5 px-4">Est. Duration</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80 text-sm">
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const taskOverdue = isOverdue(task.deadline, task.status);

            return (
              <tr
                key={task.id}
                className={`
                  transition-colors hover:bg-slate-800/40
                  ${isCompleted ? 'opacity-60 bg-slate-900/30' : ''}
                `}
              >
                {/* Title & Description */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-4 h-4 hover:text-indigo-400" />
                      )}
                    </button>
                    <div>
                      <div
                        className={`font-semibold text-slate-200 line-clamp-1 ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
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
                  <div className="text-xs font-mono text-slate-200">
                    {formatDate(task.deadline)}
                  </div>
                  <div
                    className={`text-[11px] font-medium ${
                      taskOverdue ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  >
                    {getRelativeTimeDescription(task.deadline, task.status)}
                  </div>
                </td>

                {/* Importance */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <ImportanceBadge importance={task.importance} />
                </td>

                {/* Duration */}
                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-300">
                  {task.duration} hrs
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={task.status} isOverdue={taskOverdue} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 justify-end">
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

