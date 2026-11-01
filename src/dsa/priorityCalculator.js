/**
 * priorityCalculator.js
 * 
 * Algorithmic Priority Calculator for KAL SE PAKKA – Smart Procrastination & Task Management System.
 * 
 * Formula:
 *   Priority Score = (0.5 * Urgency) + (0.3 * Importance) + (0.2 * Effort)
 * 
 * Normalization:
 *   All three components (Urgency, Importance, Effort) are normalized on a scale of 0 to 100.
 *   Resulting Priority Score is strictly bounded between 0 and 100.
 */

/**
 * Calculates normalized Urgency score (0 - 100) based on remaining time until deadline.
 * 
 * Academic Rationale:
 *  - Closer deadlines demand immediate attention to prevent late penalties.
 *  - Overdue tasks represent critical failure points and receive maximum urgency (100).
 *  - Tasks with invalid or missing deadlines receive a safe baseline score of 25.
 * 
 * Scale:
 *  - Overdue (t < 0): 100
 *  - <= 2 hours: 98
 *  - <= 6 hours: 90
 *  - <= 12 hours: 82
 *  - <= 24 hours (1 day): 72
 *  - <= 48 hours (2 days): 60
 *  - <= 72 hours (3 days): 48
 *  - <= 120 hours (5 days): 35
 *  - <= 168 hours (7 days): 25
 *  - > 7 days: Scales down to a minimum floor of 5
 * 
 * @param {string|Date} deadline Target deadline date string or Date object
 * @param {Date} [currentTime] Reference time (defaults to current system time)
 * @returns {{ urgencyScore: number, isOverdue: boolean, remainingHours: number|null }}
 */
export function calculateUrgency(deadline, currentTime = new Date()) {
  if (!deadline) {
    return { urgencyScore: 25, isOverdue: false, remainingHours: null };
  }

  const deadlineDate = new Date(deadline);
  const now = new Date(currentTime);

  if (isNaN(deadlineDate.getTime())) {
    return { urgencyScore: 25, isOverdue: false, remainingHours: null };
  }

  const diffMs = deadlineDate.getTime() - now.getTime();
  const remainingHours = diffMs / (1000 * 60 * 60);

  // Overdue
  if (diffMs <= 0) {
    return { urgencyScore: 100, isOverdue: true, remainingHours };
  }

  // Future deadlines
  let score;
  if (remainingHours <= 2) {
    score = 98;
  } else if (remainingHours <= 6) {
    // 90 to 98
    score = 90 + ((6 - remainingHours) / 4) * 8;
  } else if (remainingHours <= 12) {
    // 82 to 90
    score = 82 + ((12 - remainingHours) / 6) * 8;
  } else if (remainingHours <= 24) {
    // 72 to 82
    score = 72 + ((24 - remainingHours) / 12) * 10;
  } else if (remainingHours <= 48) {
    // 60 to 72
    score = 60 + ((48 - remainingHours) / 24) * 12;
  } else if (remainingHours <= 72) {
    // 48 to 60
    score = 48 + ((72 - remainingHours) / 24) * 12;
  } else if (remainingHours <= 168) {
    // 25 to 48 (within 1 week)
    score = 25 + ((168 - remainingHours) / 96) * 23;
  } else {
    // Beyond 1 week: scale down to min 5
    const daysBeyondWeek = (remainingHours - 168) / 24;
    score = Math.max(5, 25 - daysBeyondWeek * 1.5);
  }

  return {
    urgencyScore: Math.min(100, Math.max(5, Math.round(score * 10) / 10)),
    isOverdue: false,
    remainingHours,
  };
}

/**
 * Calculates normalized Importance score (0 - 100) based on user-selected priority level.
 * 
 * Scale:
 *  - High: 100 (Major university exams, final mini-project submissions)
 *  - Medium: 60 (Standard lab problem sets, weekly assignments)
 *  - Low: 30 (Elective reading, optional profile updates)
 * 
 * @param {string} importance 'High' | 'Medium' | 'Low'
 * @returns {number} Normalized score between 0 and 100
 */
export function calculateImportance(importance) {
  if (!importance) return 50;

  const normalized = String(importance).trim().toLowerCase();
  switch (normalized) {
    case 'high':
      return 100;
    case 'medium':
      return 60;
    case 'low':
      return 30;
    default:
      return 50;
  }
}

/**
 * Calculates normalized Effort score (0 - 100) based on estimated duration in hours.
 * 
 * Academic Rationale:
 *  - Procrastination behavior is heavily amplified by tasks that demand significant focus hours.
 *  - Underestimating high-effort tasks is the #1 cause of college deadline failure.
 *  - Assigning higher priority weight to larger tasks ensures the student starts sufficiently early.
 * 
 * Scoring Scale:
 *  - <= 0.5 hours: 20 (Quick micro-task / form submission)
 *  - 1.0 hour:     35 (Short coding snippet / quiz)
 *  - 2.0 hours:    55 (Standard lab program / theory assignment)
 *  - 3.0 hours:    70 (Multi-module assignment / revision)
 *  - 4.0 hours:    85 (Significant project milestone)
 *  - >= 5.0 hours: 100 (Comprehensive project build / full exam syllabus)
 * 
 * @param {number|string} duration Estimated completion time in hours
 * @returns {number} Normalized score between 0 and 100
 */
export function calculateEffort(duration) {
  const hours = parseFloat(duration);

  if (isNaN(hours) || hours <= 0) {
    return 30; // Default sensible baseline
  }

  if (hours <= 0.5) return 20;
  if (hours <= 1.0) return 35;
  if (hours <= 2.0) return 55;
  if (hours <= 3.0) return 70;
  if (hours <= 4.0) return 85;
  return 100; // >= 5.0 hours
}

/**
 * Calculates composite Priority Score using the weighted formula:
 *   Priority Score = (0.5 * Urgency) + (0.3 * Importance) + (0.2 * Effort)
 * 
 * @param {Object} task Task object with deadline, importance, duration, and status
 * @param {Date} [currentTime] Optional reference time
 * @returns {Object} Priority calculation result and telemetry
 */
export function calculatePriorityScore(task, currentTime = new Date()) {
  if (!task) {
    return {
      priorityScore: 0,
      urgencyScore: 0,
      importanceScore: 0,
      effortScore: 0,
      isOverdue: false,
      reason: 'No task provided',
    };
  }

  // 1. Urgency Component (50% weight)
  const { urgencyScore, isOverdue, remainingHours } = calculateUrgency(task.deadline, currentTime);

  // 2. Importance Component (30% weight)
  const importanceScore = calculateImportance(task.importance);

  // 3. Effort Component (20% weight)
  const effortScore = calculateEffort(task.duration);

  // 4. Weighted Formula
  const rawPriority = (0.5 * urgencyScore) + (0.3 * importanceScore) + (0.2 * effortScore);
  const priorityScore = Math.min(100, Math.max(0, Math.round(rawPriority * 10) / 10));

  // 5. Generate human-readable algorithmic explanation
  let reason = '';
  if (isOverdue) {
    reason = `Critical Attention: Deadline has passed. Highest urgency (100) applied to prevent grade penalty.`;
  } else if (urgencyScore >= 85) {
    reason = `Imminent Deadline: Scheduled within hours. Requires immediate execution (${task.duration}h estimated effort).`;
  } else if (importanceScore === 100 && effortScore >= 80) {
    reason = `Heavy Academic Impact: High importance task requiring significant effort (${task.duration}h). Early start required.`;
  } else if (importanceScore === 100) {
    reason = `High Academic Weight: Prioritized due to high importance rating (${task.category}).`;
  } else {
    reason = `Optimal Schedule Sequence: Balanced between urgency (${urgencyScore.toFixed(0)}), importance (${importanceScore}), and effort (${effortScore}).`;
  }

  return {
    priorityScore,
    urgencyScore,
    importanceScore,
    effortScore,
    isOverdue,
    remainingHours,
    reason,
  };
}

