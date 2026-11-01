import React from 'react';

export const CategoryBadge = ({ category, className = '' }) => {
  const styles = {
    Assignment: 'bg-coral-500/10 text-coral-600 dark:text-coral-400 border-coral-500/20',
    Project: 'bg-lime-500/15 text-lime-800 dark:text-lime-300 border-lime-500/30',
    Exam: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    Personal: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Other: 'bg-cream-300/60 dark:bg-charcoal-700/60 text-charcoal-700 dark:text-charcoal-300 border-cream-300 dark:border-charcoal-600',
  };

  const currentStyle = styles[category] || styles.Other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight border ${currentStyle} ${className}`}
    >
      {category}
    </span>
  );
};

export const ImportanceBadge = ({ importance, className = '' }) => {
  const styles = {
    High: 'bg-coral-500/15 text-coral-600 dark:text-coral-400 border-coral-500/30',
    Medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    Low: 'bg-lime-500/15 text-lime-800 dark:text-lime-300 border-lime-500/30',
  };

  const currentStyle = styles[importance] || styles.Medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border ${currentStyle} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          importance === 'High'
            ? 'bg-coral-500 animate-pulse'
            : importance === 'Medium'
            ? 'bg-amber-500'
            : 'bg-lime-500'
        }`}
      />
      {importance}
    </span>
  );
};

export const StatusBadge = ({ status, isOverdue = false, className = '' }) => {
  if (isOverdue && status !== 'Completed') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 ${className}`}
      >
        Overdue ⚠️
      </span>
    );
  }

  const styles = {
    Completed: 'bg-lime-500/20 text-lime-900 dark:text-lime-300 border-lime-500/40',
    'In Progress': 'bg-coral-500/15 text-coral-600 dark:text-coral-400 border-coral-500/30',
    Pending: 'bg-cream-200 dark:bg-charcoal-750 text-charcoal-700 dark:text-charcoal-300 border-cream-300 dark:border-charcoal-700',
    Overdue: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
  };

  const currentStyle = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentStyle} ${className}`}
    >
      {status === 'Completed' ? 'Completed ✨' : status}
    </span>
  );
};
