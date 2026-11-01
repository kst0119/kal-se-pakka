import React from 'react';
import { Calendar, CheckCircle2, Circle, Clock, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';
import { CategoryBadge, ImportanceBadge } from '../common/Badge';
import { formatTimeOnly, isDueToday } from '../../utils/dateUtils';
import Button from '../common/Button';

const TodayOverview = () => {
  const { tasks, toggleTaskStatus, setActiveTab } = useTask();

  // Tasks due today or urgent
  const todayTasks = tasks.filter((t) => isDueToday(t.deadline));

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cream-200 dark:border-charcoal-800 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-coral-500/10 text-coral-500">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-charcoal-950 dark:text-white text-base">
              Today's Schedule
            </h3>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">
              {todayTasks.length} task{todayTasks.length === 1 ? '' : 's'} scheduled for today
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('tasks')}
          className="text-xs text-coral-600 dark:text-coral-400 hover:underline font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task list or Empty state */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
        {todayTasks.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-cream-200 dark:bg-charcoal-800 flex items-center justify-center text-xl mb-2.5">
              💅
            </div>
            <p className="text-sm font-bold text-charcoal-950 dark:text-cream-100">
              Nothing due today! Main character peace.
            </p>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5 max-w-xs font-medium">
              Review upcoming coursework or schedule a focus session.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3.5"
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
                  group flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-150
                  ${
                    isCompleted
                      ? 'bg-cream-100/50 dark:bg-charcoal-900/40 border-cream-200 dark:border-charcoal-800 opacity-60'
                      : 'bg-white dark:bg-charcoal-850 border-cream-200 dark:border-charcoal-750 hover:border-coral-500/40 shadow-sm'
                  }
                `}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 text-charcoal-400 hover:text-coral-500 transition-colors shrink-0 cursor-pointer"
                    title={isCompleted ? 'Reopen task' : 'Mark as done'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-lime-500" />
                    ) : (
                      <Circle className="w-5 h-5 hover:text-coral-500" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isCompleted
                          ? 'line-through text-charcoal-400 dark:text-charcoal-500'
                          : 'text-charcoal-950 dark:text-cream-50'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <CategoryBadge category={task.category} />
                      <span className="flex items-center gap-1 text-[11px] text-coral-600 dark:text-coral-400 font-mono font-bold">
                        <Clock className="w-3 h-3" />
                        {formatTimeOnly(task.deadline)}
                      </span>
                    </div>
                  </div>
                </div>

                <ImportanceBadge importance={task.importance} />
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default TodayOverview;
