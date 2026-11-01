import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, X, Sparkles } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Button from './Button';
import { formatDate } from '../../utils/dateUtils';

const PostponeModal = () => {
  const { postponeModalTask, setPostponeModalTask, postponeTask } = useTask();

  if (!postponeModalTask) return null;

  // Defaults
  const [option, setOption] = useState('tomorrow');
  const [customDateTime, setCustomDateTime] = useState('');
  const [reason, setReason] = useState('Underestimated time required');

  const reasonsList = [
    'Underestimated time required',
    'Got stuck on a DSA bug / logic issue',
    'Prioritized an urgent submission',
    'Procrastinated ("Kal Se Pakka" moment)',
    'Need to consult professor/peer',
  ];

  const handleConfirm = async (e) => {
    e.preventDefault();
    let newDate;
    const now = new Date();

    if (option === '3hours') {
      newDate = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    } else if (option === 'tomorrow') {
      newDate = new Date(now);
      newDate.setDate(now.getDate() + 1);
      newDate.setHours(20, 0, 0, 0); // Tomorrow at 8:00 PM
    } else if (option === '3days') {
      newDate = new Date(now);
      newDate.setDate(now.getDate() + 3);
      newDate.setHours(20, 0, 0, 0);
    } else if (option === 'custom' && customDateTime) {
      newDate = new Date(customDateTime);
    } else {
      newDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    const isoString = newDate.toISOString().slice(0, 16);
    await postponeTask(postponeModalTask.id, isoString, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-cream-50 dark:bg-charcoal-850 border border-cream-300 dark:border-charcoal-750 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 dark:border-charcoal-750 bg-cream-100/60 dark:bg-charcoal-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/25">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal-900 dark:text-cream-100 text-lg">Postpone Task</h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400">"Kal Se Pakka" – Reschedule with accountability</p>
            </div>
          </div>
          <button
            onClick={() => setPostponeModalTask(null)}
            className="p-1.5 rounded-lg text-charcoal-400 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirm} className="p-6 space-y-5">
          {/* Target Task info */}
          <div className="bg-white dark:bg-charcoal-900 rounded-xl p-3.5 border border-cream-300 dark:border-charcoal-700">
            <div className="text-[11px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider mb-1">Target Task</div>
            <div className="font-bold text-charcoal-900 dark:text-cream-100">{postponeModalTask.title}</div>
            <div className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1 flex items-center gap-1.5">
              <span>Current Deadline:</span>
              <span className="text-coral-600 dark:text-coral-400 font-mono font-semibold">{formatDate(postponeModalTask.deadline)}</span>
            </div>
          </div>

          {/* Quick options */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-charcoal-300 uppercase tracking-wider mb-2.5">
              Select New Schedule
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setOption('tomorrow')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  option === 'tomorrow'
                    ? 'border-coral-500 bg-coral-500/15 text-coral-600 dark:text-coral-300 shadow-sm ring-1 ring-coral-500'
                    : 'border-cream-300 dark:border-charcoal-700 bg-white/70 dark:bg-charcoal-800/60 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-500/40'
                }`}
              >
                <div className="font-bold text-sm text-charcoal-900 dark:text-cream-100">Tomorrow Night</div>
                <div className="text-xs opacity-75">Kal Se Pakka! (8:00 PM)</div>
              </button>

              <button
                type="button"
                onClick={() => setOption('3hours')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  option === '3hours'
                    ? 'border-coral-500 bg-coral-500/15 text-coral-600 dark:text-coral-300 shadow-sm ring-1 ring-coral-500'
                    : 'border-cream-300 dark:border-charcoal-700 bg-white/70 dark:bg-charcoal-800/60 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-500/40'
                }`}
              >
                <div className="font-bold text-sm text-charcoal-900 dark:text-cream-100">+3 Hours</div>
                <div className="text-xs opacity-75">Quick grace buffer</div>
              </button>

              <button
                type="button"
                onClick={() => setOption('3days')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  option === '3days'
                    ? 'border-coral-500 bg-coral-500/15 text-coral-600 dark:text-coral-300 shadow-sm ring-1 ring-coral-500'
                    : 'border-cream-300 dark:border-charcoal-700 bg-white/70 dark:bg-charcoal-800/60 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-500/40'
                }`}
              >
                <div className="font-bold text-sm text-charcoal-900 dark:text-cream-100">+3 Days</div>
                <div className="text-xs opacity-75">Weekend extension</div>
              </button>

              <button
                type="button"
                onClick={() => setOption('custom')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  option === 'custom'
                    ? 'border-coral-500 bg-coral-500/15 text-coral-600 dark:text-coral-300 shadow-sm ring-1 ring-coral-500'
                    : 'border-cream-300 dark:border-charcoal-700 bg-white/70 dark:bg-charcoal-800/60 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-500/40'
                }`}
              >
                <div className="font-bold text-sm text-charcoal-900 dark:text-cream-100">Custom Date & Time</div>
                <div className="text-xs opacity-75">Specify exact moment</div>
              </button>
            </div>

            {option === 'custom' && (
              <div className="mt-3">
                <input
                  type="datetime-local"
                  required
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  className="w-full bg-white dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 rounded-xl px-3.5 py-2.5 text-sm text-charcoal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500"
                />
              </div>
            )}
          </div>

          {/* Reason selection */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-charcoal-300 uppercase tracking-wider mb-2">
              Reason / Procrastination Cause
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 rounded-xl px-3.5 py-2.5 text-sm text-charcoal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500"
            >
              {reasonsList.map((r, i) => (
                <option key={i} value={r} className="bg-white dark:bg-charcoal-900">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Postponing logs an entry into your Procrastination History to track schedule slips.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setPostponeModalTask(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Confirm Reschedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostponeModal;
