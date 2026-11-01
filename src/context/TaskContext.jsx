import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_TASKS } from '../constants/initialTasks';
import { isDueToday, isOverdue } from '../utils/dateUtils';

const TaskContext = createContext();

const STORAGE_KEY_TASKS = 'kal_se_pakka_tasks_v1';
const STORAGE_KEY_HISTORY = 'kal_se_pakka_history_v1';

export const TaskProvider = ({ children }) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Search query (accessible globally from header/views)
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Postpone modal state
  const [postponeModalTask, setPostponeModalTask] = useState(null);

  // Load initial tasks from localStorage or defaults
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  // History entries for completed & postponed tasks
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
    // Seed initial history entries
    return [
      {
        id: 'hist-1',
        taskId: 'task-6',
        title: 'Update Tech Resume & LeetCode Profile',
        category: 'Personal',
        action: 'Completed',
        timestamp: '2026-11-01T14:15:00Z',
        importance: 'Medium',
        notes: 'Mentor approved profile and projects.'
      },
      {
        id: 'hist-2',
        taskId: 'task-8',
        title: 'Register for Inter-College Hackathon 2026',
        category: 'Other',
        action: 'Completed',
        timestamp: '2026-10-31T19:20:00Z',
        importance: 'Low',
        notes: 'Team registered for Web3/AI track.'
      },
      {
        id: 'hist-3',
        taskId: 'task-5',
        title: 'Software Engineering UML Diagrams & SRS',
        category: 'Assignment',
        action: 'Postponed',
        originalDeadline: '2026-10-30T18:00',
        newDeadline: '2026-10-31T23:59',
        reason: 'Needed to redraw Use Case diagrams with team',
        timestamp: '2026-10-30T17:40:00Z',
        importance: 'Medium'
      }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [history]);

  // Toast trigger helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Add new task
  const addTask = (newTaskData) => {
    const newTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      procrastinationScore: Math.floor(Math.random() * 30) + 40,
    };

    setTasks(prev => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" added to schedule!`, 'success');
    return newTask;
  };

  // Update existing task
  const updateTask = (id, updatedFields) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const updated = { ...task, ...updatedFields };
          // Check if completion status changed
          if (updatedFields.status === 'Completed' && task.status !== 'Completed') {
            updated.completedAt = new Date().toISOString();
            // Append to history
            setHistory(h => [
              {
                id: `hist-${Date.now()}`,
                taskId: task.id,
                title: task.title,
                category: task.category,
                action: 'Completed',
                timestamp: new Date().toISOString(),
                importance: task.importance,
                notes: task.notes || 'Marked as completed.'
              },
              ...h
            ]);
          }
          return updated;
        }
        return task;
      })
    );
    showToast('Task updated successfully', 'info');
  };

  // Delete task
  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast(`Deleted "${taskToDelete?.title || 'task'}"`, 'info');
  };

  // Toggle status between Completed and Pending
  const toggleTaskStatus = (id) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;

    if (target.status === 'Completed') {
      // Reopen task
      const newStatus = isOverdue(target.deadline) ? 'Overdue' : 'Pending';
      updateTask(id, { status: newStatus, completedAt: null });
      showToast(`Reopened "${target.title}"`, 'info');
    } else {
      // Complete task
      updateTask(id, { status: 'Completed', completedAt: new Date().toISOString() });
      showToast(`Great job! Completed "${target.title}"! 🎉`, 'success');
    }
  };

  // Postpone task
  const postponeTask = (id, newDeadline, reason = 'Rescheduled') => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const oldDeadline = task.deadline;
    const postponedCount = (task.postponedCount || 0) + 1;

    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            deadline: newDeadline,
            status: 'Pending',
            postponedCount,
            notes: reason ? `${t.notes ? t.notes + ' | ' : ''}Postponed: ${reason}` : t.notes
          };
        }
        return t;
      })
    );

    // Record in history log
    setHistory(prev => [
      {
        id: `hist-${Date.now()}`,
        taskId: task.id,
        title: task.title,
        category: task.category,
        action: 'Postponed',
        originalDeadline: oldDeadline,
        newDeadline: newDeadline,
        reason: reason,
        timestamp: new Date().toISOString(),
        importance: task.importance,
      },
      ...prev
    ]);

    showToast(`Task postponed: "Kal Se Pakka!" New deadline set.`, 'warning');
    setPostponeModalTask(null);
  };

  // Restore history task back to pending
  const restoreTask = (historyItem) => {
    // Check if task still exists in active list
    const existing = tasks.find(t => t.id === historyItem.taskId);
    if (existing) {
      updateTask(existing.id, { status: 'Pending' });
      showToast(`Restored "${existing.title}" to pending tasks.`, 'info');
    } else {
      const restored = {
        id: historyItem.taskId || `task-${Date.now()}`,
        title: historyItem.title,
        description: 'Restored from task history archive.',
        category: historyItem.category || 'Other',
        deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        importance: historyItem.importance || 'Medium',
        duration: 1.5,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [restored, ...prev]);
      showToast(`Restored "${historyItem.title}" to active tasks.`, 'info');
    }
  };

  // Reset sample data helper (useful for testing/demo)
  const resetToSampleData = () => {
    setTasks(INITIAL_TASKS);
    showToast('Sample tasks reset successfully!', 'info');
  };

  // Compute stats and recommendations
  const stats = useMemo(() => {
    const total = tasks.length;
    let pending = 0;
    let completed = 0;
    let overdue = 0;
    const todayTasks = [];

    tasks.forEach(task => {
      const taskOverdue = isOverdue(task.deadline, task.status);

      if (task.status === 'Completed') {
        completed++;
      } else {
        if (taskOverdue) {
          overdue++;
        }
        pending++; // Includes In Progress and Overdue pending tasks
      }

      if (isDueToday(task.deadline)) {
        todayTasks.push(task);
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Recommend Next Task:
    // Filter pending/in-progress tasks
    const activeTasks = tasks.filter(t => t.status !== 'Completed');

    let recommended = null;
    let recommendationReason = '';

    if (activeTasks.length > 0) {
      // Score = Urgency + Importance Weight
      // Importance: High = 30, Medium = 20, Low = 10
      // Urgency: Overdue = 100, Due Today = 60, Due Soon = 40, Later = 10
      const scored = activeTasks.map(task => {
        let score = 0;
        const taskOverdue = isOverdue(task.deadline, task.status);
        const dueToday = isDueToday(task.deadline);

        if (taskOverdue) score += 100;
        else if (dueToday) score += 60;
        else score += 20;

        if (task.importance === 'High') score += 30;
        else if (task.importance === 'Medium') score += 20;
        else score += 10;

        // If in progress, bump priority
        if (task.status === 'In Progress') score += 15;

        return { task, score, taskOverdue, dueToday };
      });

      scored.sort((a, b) => b.score - a.score);
      const top = scored[0];
      recommended = top.task;

      if (top.taskOverdue) {
        recommendationReason = `Immediate Attention: This ${top.task.importance.toLowerCase()} importance task is past its deadline. Resolve now to stop score penalty.`;
      } else if (top.dueToday) {
        recommendationReason = `Due Today: High priority deadline scheduled for today (${top.task.duration}h estimated). Best tackled before evening.`;
      } else if (top.task.importance === 'High') {
        recommendationReason = `Critical Academic Impact: High importance ${top.task.category.toLowerCase()} requiring ${top.task.duration}h of focused effort.`;
      } else {
        recommendationReason = `Optimal Next Step: Prioritized by estimated duration and upcoming schedule.`;
      }
    }

    return {
      total,
      pending,
      completed,
      overdue,
      todayTasks,
      completionRate,
      recommendedTask: recommended,
      recommendationReason,
    };
  }, [tasks]);

  const value = {
    tasks,
    history,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    toast,
    showToast,
    postponeModalTask,
    setPostponeModalTask,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    postponeTask,
    restoreTask,
    resetToSampleData,
    stats,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

