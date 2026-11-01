/**
 * Date and time helper utilities
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'No deadline';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTimeOnly = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const isDueToday = (dateString) => {
  if (!dateString) return false;
  const target = new Date(dateString);
  const now = new Date();
  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
};

export const isOverdue = (dateString, status) => {
  if (!dateString || status === 'Completed') return false;
  const target = new Date(dateString);
  const now = new Date();
  return target < now;
};

export const getRelativeTimeDescription = (dateString, status) => {
  if (!dateString) return 'No deadline';
  if (status === 'Completed') return 'Completed';
  
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const overdueHours = Math.abs(diffHours);
    if (overdueHours < 24) {
      return `Overdue by ${overdueHours}h`;
    }
    const overdueDays = Math.abs(diffDays);
    return `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`;
  }

  if (diffHours <= 0) {
    return 'Due shortly';
  } else if (diffHours < 24) {
    return `Due in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${diffDays} days`;
  }
};

export const getTodayFormatted = () => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
};

