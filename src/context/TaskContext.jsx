import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { INITIAL_TASKS } from '../constants/initialTasks';
import { isDueToday, isOverdue } from '../utils/dateUtils';
import { TaskManager } from '../dsa/TaskManager.js';
import { calculatePriorityScore } from '../dsa/priorityCalculator.js';

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

  // Core DSA Coordinator: Encapsulates Hash Map and Custom Max Heap
  const taskManagerRef = useRef(new TaskManager());

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

  // Keep TaskManager (Hash Map and Max Heap) synchronized whenever tasks change
  useEffect(() => {
    taskManagerRef.current.setTasks(tasks);
  }, [tasks]);

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
    const rawNewTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Calculate priority with DSA priorityCalculator
    const priorityData = calculatePriorityScore(rawNewTask);
    const newTask = {
      ...rawNewTask,
      priority: priorityData.priorityScore,
      priorityData,
    };

    // Add to state
    setTasks(prev => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" added with Priority Score: ${newTask.priority}!`, 'success');
    return newTask;
  };

  // Update existing task
  const updateTask = (id, updatedFields) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const merged = { ...task, ...updatedFields };

          // Recalculate priority score on updates
          const priorityData = calculatePriorityScore(merged);
          const updated = {
            ...merged,
            priority: priorityData.priorityScore,
            priorityData,
          };

          // Check if completion status changed
          if (updatedFields.status === 'Completed' && task.status !== 'Completed') {
            updated.completedAt = new Date().toISOString();
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
      const newStatus = isOverdue(target.deadline) ? 'Overdue' : 'Pending';
      updateTask(id, { status: newStatus, completedAt: null });
      showToast(`Reopened "${target.title}" (Re-entered Max Heap Priority Queue)`, 'info');
    } else {
      updateTask(id, { status: 'Completed', completedAt: new Date().toISOString() });
      showToast(`Completed "${target.title}"! (Removed from Priority Queue) 🎉`, 'success');
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
          const updated = {
            ...t,
            deadline: newDeadline,
            status: 'Pending',
            postponedCount,
            notes: reason ? `${t.notes ? t.notes + ' | ' : ''}Postponed: ${reason}` : t.notes
          };
          const priorityData = calculatePriorityScore(updated);
          return {
            ...updated,
            priority: priorityData.priorityScore,
            priorityData,
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

    showToast(`Task postponed: Priority recalculated in Max Heap.`, 'warning');
    setPostponeModalTask(null);
  };

  // Restore history task back to pending
  const restoreTask = (historyItem) => {
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
      const priorityData = calculatePriorityScore(restored);
      restored.priority = priorityData.priorityScore;
      restored.priorityData = priorityData;

      setTasks(prev => [restored, ...prev]);
      showToast(`Restored "${historyItem.title}" to active tasks.`, 'info');
    }
  };

  // Reset sample data helper
  const resetToSampleData = () => {
    setTasks(INITIAL_TASKS);
    showToast('Sample tasks reset successfully!', 'info');
  };

  // Constant-time Hash Map task getter
  const getTaskById = (id) => {
    return taskManagerRef.current.getTask(id);
  };

  // Compute stats and recommendations using the Max Heap
  const stats = useMemo(() => {
    // 1. Synchronize the TaskManager instance
    const tm = new TaskManager();
    tm.setTasks(tasks);

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
        pending++;
      }

      if (isDueToday(task.deadline)) {
        todayTasks.push(task);
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 2. Extract highest-priority task directly from Max Heap root (O(1) peek)
    const topHeapTask = tm.getHighestPriorityTask();

    let recommendationReason = '';
    if (topHeapTask) {
      const pd = topHeapTask.priorityData || calculatePriorityScore(topHeapTask);
      recommendationReason = pd.reason || `Extracted by Max Heap root with Priority Score ${topHeapTask.priority}.`;
    }

    // Verification check for synchronization
    const syncStatus = tm.verifySynchronization();

    return {
      total,
      pending,
      completed,
      overdue,
      todayTasks,
      completionRate,
      recommendedTask: topHeapTask,
      recommendationReason,
      syncStatus,
      heapPendingCount: tm.getPendingCount(),
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
    getTaskById,
    taskManager: taskManagerRef.current,
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
