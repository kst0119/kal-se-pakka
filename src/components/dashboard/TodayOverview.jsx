import React from 'react';
import { Calendar, CheckCircle2, Circle, Clock, ArrowRight, Plus } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';
import { CategoryBadge, ImportanceBadge } from '../common/Badge';
import { formatTimeOnly, isDueToday } from '../../utils/dateUtils';
import Button from '../common/Button';

const TodayOverview = () => {
  const { tasks, toggleTaskStatus, setActiveTab } = useTask();

  // Tasks due today or urgent
  const todayTasks = tasks.filter(t => isDueToday(t.deadline));

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Today's Task Overview</h3>
            <p className="text-xs text-slate-400">
              {todayTasks.length} task{todayTasks.length === 1 ? '' : 's'} scheduled for today
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('tasks')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task list or Empty state */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
        {todayTasks.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-2.5">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-slate-300">No deadlines scheduled for today</p>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
              Check your upcoming deadlines or schedule a study block.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              icon={Plus}
              onClick={() => setActiveTab('add-task')}
            >
              Add Task for Today
            </Button>
          </div>
        ) : (
          todayTasks.map((task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`
                  group flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150
                  ${
                    isCompleted
                      ? 'bg-slate-900/40 border-slate-800/50 opacity-60'
                      : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-800 hover:border-slate-700'
                  }
                `}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                    title={isCompleted ? 'Mark Pending' : 'Mark Complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 group-hover:border-indigo-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold text-slate-100 truncate ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <CategoryBadge category={task.category} />
                      <ImportanceBadge importance={task.importance} />

                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span>Due {formatTimeOnly(task.deadline)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-slate-400">
                    {task.duration}h
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default TodayOverview;

