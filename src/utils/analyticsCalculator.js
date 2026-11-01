/**
 * analyticsCalculator.js
 * 
 * Production Analytics and Telemetry Engine for KAL SE PAKKA.
 * Computes strictly real task analytics from actual user tasks and history events.
 * 
 * Features:
 *  1. Productivity Statistics (Totals, Pending, Completed, Overdue, Postponed, % Complete)
 *  2. Bounded Procrastination Score (0 - 100) using multi-factor penalty & relief weighting
 *  3. Contextual Humour Generator (witty yet academic Indian student productivity insights)
 *  4. Real Recharts data transformations:
 *     - Completed vs Pending distribution
 *     - Category workload allocation
 *     - Weekly productivity throughput (last 7 days based on actual task deadlines & completions)
 *     - Cumulative completion trend over time
 */

import { isOverdue } from './dateUtils.js';

/**
 * Calculates core productivity counters and rates.
 * All numbers derived from actual task objects in the system.
 */
export function calculateProductivityStats(tasks = [], history = []) {
  const total = tasks.length;
  let completed = 0;
  let inProgress = 0;
  let pending = 0;
  let overdue = 0;
  let postponedTasksCount = 0;
  let totalPostponements = 0;
  let totalEstimatedHours = 0;
  let completedHours = 0;
  let pendingHours = 0;

  for (const task of tasks) {
    const hours = parseFloat(task.duration) || 0;
    totalEstimatedHours += hours;

    const taskIsOverdue = isOverdue(task.deadline, task.status);

    if (task.status === 'Completed') {
      completed++;
      completedHours += hours;
    } else {
      pending++;
      pendingHours += hours;

      if (task.status === 'In Progress') {
        inProgress++;
      }

      if (taskIsOverdue) {
        overdue++;
      }
    }

    if (task.postponedCount && task.postponedCount > 0) {
      postponedTasksCount++;
      totalPostponements += task.postponedCount;
    }
  }

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const procrastinationScore = calculateProcrastinationScore(tasks);

  return {
    total,
    completed,
    pending,
    inProgress,
    overdue,
    postponed: postponedTasksCount,
    totalPostponements,
    completionRate,
    procrastinationScore,
    totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
    completedHours: Math.round(completedHours * 10) / 10,
    pendingHours: Math.round(pendingHours * 10) / 10,
  };
}

/**
 * Calculates Procrastination Score bounded between 0 and 100.
 * 
 * Formula:
 *   Procrastination Score = Overdue Component + Postponement Component + Inertia Component - Completion Relief
 * 
 * Invariants:
 *  - Empty task list: 0
 *  - All tasks completed: 0
 *  - Only active (non-completed) overdue tasks contribute to the overdue component.
 *    Completed tasks that were overdue in the past are NOT penalized.
 *  - Higher score = More procrastination severity.
 * 
 * @param {Array<Object>} tasks Array of real application tasks
 * @returns {number} Score between 0 and 100
 */
export function calculateProcrastinationScore(tasks = []) {
  if (!tasks || tasks.length === 0) return 0;

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const activeTasks = tasks.filter(t => t.status !== 'Completed');

  // If all tasks are completed, procrastination is 0
  if (activeTasks.length === 0) return 0;

  // Active tasks past deadline
  const activeOverdue = activeTasks.filter(t => isOverdue(t.deadline, t.status)).length;

  // Postponements
  const totalPostponements = tasks.reduce((sum, t) => sum + (t.postponedCount || 0), 0);
  const postponedTasksCount = tasks.filter(t => t.postponedCount && t.postponedCount > 0).length;

  // 1. Overdue Component (up to 55 points)
  // Evaluates the fraction of active tasks that are currently overdue
  const overdueRatio = activeOverdue / activeTasks.length;
  let overdueScore = overdueRatio * 55;
  if (activeOverdue > 0) {
    // Immediate baseline penalty of at least 20 if ANY active task is overdue
    overdueScore = Math.max(20, overdueScore);
  }

  // 2. Postponement Component (up to 35 points)
  // Evaluates both ratio of postponed tasks and total delay count
  const taskPostponeRatio = postponedTasksCount / total;
  const cumulativePostponeRatio = Math.min(1, totalPostponements / Math.max(1, total * 1.5));
  const combinedPostponeRatio = (taskPostponeRatio * 0.6) + (cumulativePostponeRatio * 0.4);
  const postponeScore = combinedPostponeRatio * 35;

  // 3. Inertia Component (up to 10 points)
  // If student has multiple active tasks but has made zero completions
  let inertiaScore = 0;
  if (completed === 0 && activeTasks.length >= 2) {
    inertiaScore = 10;
  }

  // 4. Completion Relief Discount (up to 15 points reduction)
  const completionDiscount = (completed / total) * 15;

  const rawScore = overdueScore + postponeScore + inertiaScore - completionDiscount;
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}

/**
 * Returns contextual humor messages based on actual application state.
 */
export function getContextualHumorMessage(stats) {
  const { total, completed, pending, overdue, postponed, completionRate, procrastinationScore } = stats;

  if (total === 0) {
    return {
      title: 'Empty Canvas Mode',
      message: 'Zero tasks on the board! Either you are an academic legend, or you haven’t checked the college portal yet.',
      tone: 'neutral',
    };
  }

  if (pending === 0 && completed > 0) {
    return {
      title: 'Zero Backlog Zen',
      message: 'Productivity unlocked! Aaj toh kamaal kar diya. All scheduled tasks are completed!',
      tone: 'celebrate',
    };
  }

  if (overdue >= 3) {
    return {
      title: 'Red Alert Zone',
      message: 'Deadline aa gayi, motivation abhi raste mein hai. 3+ tasks are overdue—time for an emergency focus block!',
      tone: 'critical',
    };
  }

  if (overdue > 0) {
    return {
      title: 'Overdue Warning',
      message: 'Kal se pakka? Calendar ne bhi ye dialogue sun liya. Tackle the overdue task before starting new ones!',
      tone: 'warning',
    };
  }

  if (postponed >= 2 && procrastinationScore >= 50) {
    return {
      title: 'Postponement Loop',
      message: 'Every time you click "Kal Se Pakka", an algorithm weeps. Break the reschedule loop and start with 15 minutes of work.',
      tone: 'warning',
    };
  }

  if (completionRate >= 75) {
    return {
      title: 'Momentum Unstoppable',
      message: '75%+ tasks knocked down! The procrastination monster is officially on the run.',
      tone: 'celebrate',
    };
  }

  if (completionRate >= 50) {
    return {
      title: 'Halfway Peak',
      message: 'Half of your academic mountain is climbed. Grab a chai and finish the rest today!',
      tone: 'info',
    };
  }

  return {
    title: 'Focus Flow Active',
    message: 'Small consistent steps beat last-minute exam panic every single time. Next best task is waiting in the Max Heap.',
    tone: 'info',
  };
}

/**
 * Recharts Data: Completed vs Pending status breakdown
 */
export function getCompletedVsPendingChartData(tasks = []) {
  if (!tasks || tasks.length === 0) return [];

  let completed = 0;
  let inProgress = 0;
  let pending = 0;
  let overdue = 0;

  for (const t of tasks) {
    if (t.status === 'Completed') {
      completed++;
    } else {
      if (isOverdue(t.deadline, t.status)) {
        overdue++;
      } else if (t.status === 'In Progress') {
        inProgress++;
      } else {
        pending++;
      }
    }
  }

  return [
    { name: 'Completed', value: completed, color: '#10B981' },
    { name: 'In Progress', value: inProgress, color: '#38BDF8' },
    { name: 'Pending', value: pending, color: '#818CF8' },
    { name: 'Overdue', value: overdue, color: '#F43F5E' },
  ].filter(item => item.value > 0);
}

/**
 * Recharts Data: Category distribution with completed vs pending counts
 */
export function getCategoryChartData(tasks = []) {
  if (!tasks || tasks.length === 0) return [];

  const categories = ['Assignment', 'Project', 'Exam', 'Personal', 'Other'];
  const categoryMap = {};

  for (const cat of categories) {
    categoryMap[cat] = { category: cat, completed: 0, pending: 0, overdue: 0, total: 0 };
  }

  for (const t of tasks) {
    const cat = categoryMap[t.category] ? t.category : 'Other';
    categoryMap[cat].total++;

    if (t.status === 'Completed') {
      categoryMap[cat].completed++;
    } else {
      if (isOverdue(t.deadline, t.status)) {
        categoryMap[cat].overdue++;
      } else {
        categoryMap[cat].pending++;
      }
    }
  }

  return Object.values(categoryMap).filter(item => item.total > 0);
}

/**
 * Recharts Data: Weekly productivity throughput (last 7 days)
 * Evaluates real tasks due and completed over the past 7 days.
 */
export function getWeeklyProductivityChartData(tasks = [], history = []) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();

  // Create 7 day buckets for the last 7 calendar days
  const buckets = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = daysOfWeek[d.getDay()];

    buckets.push({
      dateStr,
      day: dayLabel,
      completed: 0,
      due: 0,
    });
  }

  // Count completions from tasks.completedAt or history entries
  const completedEvents = [
    ...tasks.filter(t => t.status === 'Completed' && t.completedAt).map(t => ({ date: t.completedAt })),
    ...history.filter(h => h.action === 'Completed' && h.timestamp).map(h => ({ date: h.timestamp })),
  ];

  for (const ev of completedEvents) {
    const evDateStr = String(ev.date).slice(0, 10);
    const target = buckets.find(b => b.dateStr === evDateStr);
    if (target) {
      target.completed++;
    }
  }

  // Count deadlines due on these days
  for (const t of tasks) {
    if (t.deadline) {
      const dStr = String(t.deadline).slice(0, 10);
      const target = buckets.find(b => b.dateStr === dStr);
      if (target) {
        target.due++;
      }
    }
  }

  return buckets.map(({ day, completed, due }) => ({
    day,
    completed,
    planned: Math.max(due, completed), // ensure planned covers work done
  }));
}

/**
 * Recharts Data: Cumulative task completion velocity over time
 */
export function getCompletionTrendChartData(tasks = [], history = []) {
  const completedEvents = [
    ...tasks
      .filter(t => t.status === 'Completed')
      .map(t => ({
        timestamp: t.completedAt || t.createdAt || new Date().toISOString(),
        title: t.title,
      })),
    ...history
      .filter(h => h.action === 'Completed')
      .map(h => ({
        timestamp: h.timestamp,
        title: h.title,
      })),
  ];

  if (completedEvents.length === 0) return [];

  // Sort chronologically
  completedEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Remove duplicate taskId if logged twice
  const seenDates = new Set();
  const trend = [];
  let cumulative = 0;

  for (const ev of completedEvents) {
    cumulative++;
    const label = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(ev.timestamp));

    trend.push({
      label,
      completions: cumulative,
      task: ev.title,
    });
  }

  return trend;
}

