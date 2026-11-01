import React from 'react';

export const CategoryBadge = ({ category, className = '' }) => {
  const styles = {
    Assignment: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Project: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Exam: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Personal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const currentStyle = styles[category] || styles.Other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle} ${className}`}
    >
      {category}
    </span>
  );
};

export const ImportanceBadge = ({ importance, className = '' }) => {
  const styles = {
    High: 'bg-red-500/15 text-red-400 border-red-500/30',
    Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Low: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  };

  const currentStyle = styles[importance] || styles.Medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${currentStyle} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          importance === 'High'
            ? 'bg-red-400 animate-pulse'
            : importance === 'Medium'
            ? 'bg-amber-400'
            : 'bg-sky-400'
        }`}
      />
      {importance} Priority
    </span>
  );
};

export const StatusBadge = ({ status, isOverdue = false, className = '' }) => {
  if (isOverdue && status !== 'Completed') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 ${className}`}
      >
        Overdue
      </span>
    );
  }

  const styles = {
    Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'In Progress': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    Pending: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
    Overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  const currentStyle = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle} ${className}`}
    >
      {status}
    </span>
  );
};

