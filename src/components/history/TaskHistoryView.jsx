import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  Hourglass,
  RotateCcw,
  Search,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';
import { CategoryBadge, ImportanceBadge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import Button from '../common/Button';

const TaskHistoryView = () => {
  const { history, restoreTask } = useTask();
  const [filterAction, setFilterAction] = useState('All'); // 'All' | 'Completed' | 'Postponed' | 'Deleted'
  const [searchTerm, setSearchTerm] = useState('');

  const completedCount = history.filter((h) => h.action === 'Completed').length;
  const postponedCount = history.filter((h) => h.action === 'Postponed').length;
  const deletedCount = history.filter((h) => h.action === 'Deleted').length;

  const filteredHistory = history.filter((item) => {
    if (filterAction !== 'All' && item.action !== filterAction) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      const matchReason = item.reason?.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchReason && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-cream-100/90 dark:bg-charcoal-850 border border-cream-300 dark:border-charcoal-750 p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-500/10 border border-coral-500/20 text-coral-600 dark:text-coral-400 text-xs font-bold mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Historical Archive & Postponement Audit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 dark:text-cream-100 tracking-tight">
              Task History & Procrastination Log
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-350 mt-1 max-w-2xl font-medium">
              Keep an honest record of successfully submitted tasks, deleted items, and every "Kal Se Pakka" postponement excuse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 text-center min-w-[70px]">
              <div className="text-[10px] uppercase font-bold text-charcoal-500 dark:text-charcoal-400">Completed</div>
              <div className="text-lg font-black text-lime-600 dark:text-lime-400 font-mono">
                {completedCount}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 text-center min-w-[70px]">
              <div className="text-[10px] uppercase font-bold text-charcoal-500 dark:text-charcoal-400">Postponed</div>
              <div className="text-lg font-black text-amber-500 font-mono">
                {postponedCount}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 text-center min-w-[70px]">
              <div className="text-[10px] uppercase font-bold text-charcoal-500 dark:text-charcoal-400">Deleted</div>
              <div className="text-lg font-black text-rose-500 font-mono">
                {deletedCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-cream-50 dark:bg-charcoal-850 rounded-2xl border border-cream-300 dark:border-charcoal-750 p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterAction('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterAction === 'All'
                ? 'bg-charcoal-900 dark:bg-cream-100 text-cream-100 dark:text-charcoal-900 shadow-sm'
                : 'bg-cream-200/70 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-cream-200'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilterAction('Completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterAction === 'Completed'
                ? 'bg-lime-500 text-charcoal-950 shadow-sm'
                : 'bg-cream-200/70 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-cream-200'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilterAction('Postponed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterAction === 'Postponed'
                ? 'bg-amber-500 text-charcoal-950 shadow-sm'
                : 'bg-cream-200/70 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-cream-200'
            }`}
          >
            Postponed ({postponedCount})
          </button>
          <button
            onClick={() => setFilterAction('Deleted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterAction === 'Deleted'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-cream-200/70 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-cream-200'
            }`}
          >
            Deleted ({deletedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-charcoal-400 dark:text-charcoal-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-charcoal-900 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-coral-500/50"
          />
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="bg-cream-50 dark:bg-charcoal-850 rounded-2xl border border-cream-300 dark:border-charcoal-750 p-12 text-center">
            <History className="w-8 h-8 text-charcoal-400 dark:text-charcoal-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-charcoal-900 dark:text-cream-100 mb-1">No history records found</h3>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
              Completed milestones, postponement excuses, or deleted tasks will automatically be logged here.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isCompleted = item.action === 'Completed';
            const isDeleted = item.action === 'Deleted';

            return (
              <div
                key={item.id}
                className="bg-cream-50 dark:bg-charcoal-850 rounded-2xl border border-cream-300 dark:border-charcoal-750 p-4 sm:p-5 transition-all hover:border-coral-500/40 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                        isCompleted
                          ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400 border border-lime-500/25'
                          : isDeleted
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isDeleted ? (
                        <Trash2 className="w-5 h-5" />
                      ) : (
                        <Hourglass className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isCompleted
                              ? 'bg-lime-500/20 text-lime-700 dark:text-lime-300'
                              : isDeleted
                              ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {item.action}
                        </span>

                        {item.category && <CategoryBadge category={item.category} />}
                        {item.importance && <ImportanceBadge importance={item.importance} />}
                      </div>

                      <h4 className="text-base font-bold text-charcoal-900 dark:text-cream-100">
                        {item.title}
                      </h4>

                      {/* Postponement details */}
                      {!isCompleted && !isDeleted && item.reason && (
                        <div className="mt-2 text-xs text-amber-800 dark:text-amber-200 bg-amber-500/10 rounded-lg p-2.5 border border-amber-500/20 flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                          <div>
                            <span className="font-bold">Reason:</span> {item.reason}
                            {item.originalDeadline && item.newDeadline && (
                              <div className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 font-mono font-medium">
                                Shifted: {formatDate(item.originalDeadline)} → {formatDate(item.newDeadline)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes / description preview */}
                      {item.notes && (
                        <p className="mt-1 text-xs text-charcoal-600 dark:text-charcoal-350">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side: Timestamp & Restore button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-200 dark:border-charcoal-750">
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-charcoal-400 dark:text-charcoal-500" />
                      <span>{formatDate(item.timestamp)}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={RotateCcw}
                      onClick={() => restoreTask(item)}
                      className="text-xs py-1"
                    >
                      {isCompleted ? 'Reopen Task' : 'Restore Task'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskHistoryView;
