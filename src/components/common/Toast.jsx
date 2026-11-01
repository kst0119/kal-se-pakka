import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Sparkles, Flame, Clock } from 'lucide-react';
import { useTask } from '../../context/TaskContext';

const Toast = () => {
  const { toast, showToast } = useTask();

  if (!toast) return null;

  const icons = {
    success: <Flame className="w-5 h-5 text-coral-500 shrink-0 animate-bounce" />,
    warning: <Clock className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Sparkles className="w-5 h-5 text-lime-500 dark:text-lime-400 shrink-0" />,
    celebrate: <CheckCircle2 className="w-5 h-5 text-lime-500 dark:text-lime-400 shrink-0" />,
  };

  const borders = {
    success: 'border-coral-500/30',
    warning: 'border-amber-500/40',
    info: 'border-lime-500/30',
    celebrate: 'border-lime-500/40',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl bg-white/95 dark:bg-charcoal-850/95 border ${
          borders[toast.type] || borders.info
        } shadow-xl backdrop-blur-md text-charcoal-900 dark:text-cream-50 transition-colors`}
      >
        <div className="mt-0.5">{icons[toast.type] || icons.info}</div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider font-extrabold text-coral-500 dark:text-coral-400 mb-0.5">
            Kal Se Pakka • {toast.type === 'warning' ? 'Heads Up' : 'Reaction'}
          </div>
          <div className="text-sm font-medium leading-snug">{toast.message}</div>
        </div>
        <button
          onClick={() => showToast(null)}
          className="text-charcoal-400 dark:text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
