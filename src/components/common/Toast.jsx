import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useTask } from '../../context/TaskContext';

const Toast = () => {
  const { toast, showToast } = useTask();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    warning: 'border-amber-500/30',
    info: 'border-indigo-500/30',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl bg-slate-900/95 border ${
          borders[toast.type] || borders.info
        } shadow-xl backdrop-blur-md text-slate-100`}
      >
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-sm leading-snug">{toast.message}</div>
        <button
          onClick={() => showToast(null)}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

