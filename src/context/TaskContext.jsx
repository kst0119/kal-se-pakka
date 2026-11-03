/**
 * TaskContext.jsx
 * 
 * Global Task Management, DSA Coordination & Cloud Persistence Context for KAL SE PAKKA.
 * Coordinates:
 *  1. Supabase Cloud Persistence (`public.tasks`, `task_events`, `notifications`) for authenticated users.
 *  2. Robust LocalStorage & In-Memory fallback for Guest / Demo users or when offline.
 *  3. In-memory DSA Coordinator: Hash Map for O(1) lookups and Custom Max Heap for dynamic priority queueing.
 *  4. Real Recharts analytics, productivity metrics, and algorithmic procrastination score.
 *  5. Reliable task CRUD operations: Add, Edit, Delete, Complete, Postpone, Restore.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { INITIAL_TASKS } from '../constants/initialTasks';
import { isDueToday, isOverdue } from '../utils/dateUtils';
import { TaskManager } from '../dsa/TaskManager.js';
import { calculatePriorityScore } from '../dsa/priorityCalculator.js';
import {
  calculateProductivityStats,
  calculateProcrastinationScore,
  getContextualHumorMessage,
  getCompletedVsPendingChartData,
  getCategoryChartData,
  getWeeklyProductivityChartData,
  getCompletionTrendChartData,
} from '../utils/analyticsCalculator.js';
import { useAuth } from './AuthContext';
import { taskService } from '../services/taskService';
import { getReaction } from '../utils/reactions';

const TaskContext = createContext();

const STORAGE_KEY_TASKS = 'kal_se_pakka_tasks_v1';
const STORAGE_KEY_HISTORY = 'kal_se_pakka_history_v1';

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Search query (accessible globally from header/views)
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Modals state
  const [postponeModalTask, setPostponeModalTask] = useState(null);
  const [editModalTask, setEditModalTask] = useState(null);

  // Loading and synchronization state
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'local' | 'error'
  const [notifications, setNotifications] = useState([]);

  // Core DSA Coordinator: Encapsulates Hash Map and Custom Max Heap
  const taskManagerRef = useRef(new TaskManager());

  // Tasks state
  const [tasks, setTasks] = useState([]);

  // History entries for completed, postponed & deleted tasks
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
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        importance: 'Medium',
        notes: 'Mentor approved profile and projects.',
      },
      {
        id: 'hist-2',
        taskId: 'task-8',
        title: 'Register for Inter-College Hackathon 2026',
        category: 'Other',
        action: 'Completed',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        importance: 'Medium',
        notes: 'Team registered for Web3 and AI tracks.',
      },
    ];
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  /**
   * Helper: Prepare initial sample tasks with calculated priority scores
   */
  const getSeededSampleTasks = () => {
    return INITIAL_TASKS.map((t) => {
      const priorityData = calculatePriorityScore(t);
      return {
        ...t,
        priority: priorityData.priorityScore,
        priorityData,
      };
    });
  };

  /**
   * 1. Task Loading & Initialization
   * Supports both Supabase Cloud persistence and Instant Guest / LocalStorage Mode.
   */
  useEffect(() => {
    let isMounted = true;

    const loadTasksData = async () => {
      setIsLoadingTasks(true);

      // A) GUEST / DEMO MODE OR UNCONFIGURED SUPABASE
      if (!user?.id || user.isGuest) {
        setCloudSyncStatus('local');
        let localTasks = [];
        try {
          const saved = localStorage.getItem(STORAGE_KEY_TASKS);
          if (saved) localTasks = JSON.parse(saved);
        } catch (e) {
          console.warn('Could not read tasks from localStorage', e);
        }

        if (!localTasks || localTasks.length === 0) {
          localTasks = getSeededSampleTasks();
          try {
            localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(localTasks));
          } catch (e) {}
        }

        if (isMounted) {
          setTasks(localTasks);
          setIsLoadingTasks(false);
        }
        return;
      }

      // B) AUTHENTICATED SUPABASE USER
      setCloudSyncStatus('syncing');

      try {
        const { tasks: cloudTasks, error } = await taskService.fetchUserTasks(user.id);

        if (error) {
          console.warn('[TaskContext] Cloud fetch error, falling back to local tasks:', error.message);
          let fallbackTasks = [];
          try {
            const saved = localStorage.getItem(STORAGE_KEY_TASKS);
            if (saved) fallbackTasks = JSON.parse(saved);
          } catch (e) {}

          if (!fallbackTasks || fallbackTasks.length === 0) {
            fallbackTasks = getSeededSampleTasks();
          }

          if (isMounted) {
            setTasks(fallbackTasks);
            setCloudSyncStatus('local');
          }
        } else if (isMounted) {
          // If no cloud tasks exist yet for this user, seed initial college tasks
          if (cloudTasks.length === 0) {
            let localToMigrate = [];
            try {
              const saved = localStorage.getItem(STORAGE_KEY_TASKS);
              if (saved) localToMigrate = JSON.parse(saved);
            } catch (e) {}

            const tasksToSeed = (localToMigrate && localToMigrate.length > 0)
              ? localToMigrate
              : INITIAL_TASKS;

            for (const item of tasksToSeed) {
              await taskService.createTask(item, user.id).catch(() => {});
            }

            const { tasks: freshCloudTasks } = await taskService.fetchUserTasks(user.id);
            setTasks(freshCloudTasks && freshCloudTasks.length > 0 ? freshCloudTasks : getSeededSampleTasks());
          } else {
            setTasks(cloudTasks);
          }
          setCloudSyncStatus('synced');
        }

        // Fetch notifications
        const { notifications: userNotifs } = await taskService.fetchNotifications(user.id);
        if (isMounted && userNotifs) {
          setNotifications(userNotifs);
        }
      } catch (err) {
        console.error('[TaskContext] Exception in loadTasksData:', err);
        let fallback = [];
        try {
          const saved = localStorage.getItem(STORAGE_KEY_TASKS);
          if (saved) fallback = JSON.parse(saved);
        } catch (e) {}
        if (isMounted) {
          setTasks(fallback && fallback.length > 0 ? fallback : getSeededSampleTasks());
          setCloudSyncStatus('local');
        }
      } finally {
        if (isMounted) setIsLoadingTasks(false);
      }
    };

    loadTasksData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.isGuest]);

  /**
   * 2. Synchronize Hash Map and Max Heap whenever tasks state changes.
   * Maintains strict DSA invariants:
   *  - Hash Map contains all tasks for O(1) lookup.
   *  - Max Heap contains only pending/in-progress tasks ordered by priority score.
   */
  useEffect(() => {
    taskManagerRef.current.setTasks(tasks);
  }, [tasks]);

  // Sync to local backup storage safely
  useEffect(() => {
    if (tasks.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
      } catch (e) {
        console.error('Failed to backup tasks locally', e);
      }
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [history]);

  /**
   * Add a new task:
   * 1. Validates title.
   * 2. Checks in-memory duplicates across active tasks.
   * 3. Calculates priority score with (0.5*U + 0.3*I + 0.2*E).
   * 4. Persists to Supabase if authenticated; smoothly falls back to local storage.
   * 5. Updates React state, Hash Map, and Max Heap.
   */
  const addTask = async (newTaskData) => {
    const trimmedTitle = newTaskData.title ? newTaskData.title.trim() : '';

    if (!trimmedTitle) {
      showToast('Task title is mandatory', 'warning');
      return { success: false, error: 'Task title is mandatory.' };
    }

    // Duplicate check: Prevent active tasks with exact same title
    const duplicate = tasks.find(
      (t) => t.status !== 'Completed' && t.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (duplicate) {
      showToast(`A pending task with title "${trimmedTitle}" already exists!`, 'warning');
      return {
        success: false,
        error: 'A pending task with this title already exists. Please choose a distinct title.',
      };
    }

    const rawNewTask = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: trimmedTitle,
      status: newTaskData.status || 'Pending',
      createdAt: new Date().toISOString(),
      postponedCount: 0,
      duration: parseFloat(newTaskData.duration) || 1.0,
    };

    // Calculate priority score using DSA formula
    const priorityData = calculatePriorityScore(rawNewTask);
    const taskWithPriority = {
      ...rawNewTask,
      priority: priorityData.priorityScore,
      priorityData,
    };

    let fullEnrichedTask = taskWithPriority;

    // Persist to Supabase if real user session exists
    if (user?.id && !user.isGuest) {
      const { task: createdCloudTask, error } = await taskService.createTask(taskWithPriority, user.id);
      if (!error && createdCloudTask) {
        fullEnrichedTask = {
          ...createdCloudTask,
          priorityData,
        };
      } else {
        console.warn('[TaskContext] Cloud insert failed, saving locally:', error?.message);
      }
    }

    // Synchronize in-memory React state and DSA structures
    setTasks((prev) => [fullEnrichedTask, ...prev]);
    const reaction = getReaction('created');
    showToast(`${reaction} "${fullEnrichedTask.title}" added to Priority Queue!`, 'success');
    return { success: true, task: fullEnrichedTask };
  };

  /**
   * Edit/Update an existing task:
   * Recalculates priority score and updates both cloud and local storage.
   */
  const updateTask = async (id, updatedFields) => {
    const existingTask = tasks.find((t) => t.id === id);
    if (!existingTask) return { success: false, error: 'Task not found' };

    const merged = { ...existingTask, ...updatedFields };

    if (updatedFields.title) merged.title = updatedFields.title.trim();
    if (updatedFields.duration !== undefined) {
      merged.duration = parseFloat(updatedFields.duration) || 1.0;
    }

    // Recalculate priority score
    const priorityData = calculatePriorityScore(merged);
    const fullUpdatedTask = {
      ...merged,
      priority: priorityData.priorityScore,
      priorityData,
    };

    // Update in Supabase if real user session
    if (user?.id && !user.isGuest) {
      await taskService.updateTask(id, { ...updatedFields, priority: priorityData.priorityScore }, user.id)
        .catch((e) => console.warn('[TaskContext] Cloud update error:', e.message));
    }

    setTasks((prev) => prev.map((t) => (t.id === id ? fullUpdatedTask : t)));

    // Record completed event in local history if marked complete
    if (updatedFields.status === 'Completed' && existingTask.status !== 'Completed') {
      setHistory((h) => [
        {
          id: `hist-${Date.now()}`,
          taskId: existingTask.id,
          title: existingTask.title,
          category: existingTask.category,
          action: 'Completed',
          timestamp: new Date().toISOString(),
          importance: existingTask.importance,
          notes: existingTask.notes || 'Marked as completed.',
          taskSnapshot: { ...existingTask },
        },
        ...h,
      ]);
    }

    showToast('Task updated successfully!', 'info');
    return { success: true, task: fullUpdatedTask };
  };

  /**
   * Delete a task from state, Max Heap, and cloud.
   */
  const deleteTask = async (id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    if (user?.id && !user.isGuest) {
      await taskService.deleteTask(id, user.id).catch((e) => console.warn('Cloud delete error:', e.message));
    }

    // Remove from in-memory state
    setTasks((prev) => prev.filter((t) => t.id !== id));

    // Archive in history
    setHistory((prev) => [
      {
        id: `hist-${Date.now()}`,
        taskId: taskToDelete.id,
        title: taskToDelete.title,
        category: taskToDelete.category,
        action: 'Deleted',
        timestamp: new Date().toISOString(),
        importance: taskToDelete.importance,
        notes: taskToDelete.description || 'Deleted by user',
        taskSnapshot: { ...taskToDelete },
      },
      ...prev,
    ]);

    showToast(`${getReaction('deleted')} "${taskToDelete.title}" archived.`, 'info');
  };

  /**
   * Toggle task status between Completed and Pending.
   */
  const toggleTaskStatus = async (id) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    if (target.status === 'Completed') {
      const priorityData = calculatePriorityScore({ ...target, status: 'Pending' });
      const reopened = {
        ...target,
        status: 'Pending',
        completedAt: null,
        priority: priorityData.priorityScore,
        priorityData,
      };

      if (user?.id && !user.isGuest) {
        await taskService.reopenTask(id, user.id, priorityData.priorityScore)
          .catch((e) => console.warn('Cloud reopen error:', e.message));
      }

      setTasks((prev) => prev.map((t) => (t.id === id ? reopened : t)));
      showToast(`Reopened "${target.title}" (Re-entered Max Heap Queue)`, 'info');
    } else {
      const completed = {
        ...target,
        status: 'Completed',
        completedAt: new Date().toISOString(),
      };

      if (user?.id && !user.isGuest) {
        await taskService.completeTask(id, user.id, target.title)
          .catch((e) => console.warn('Cloud complete error:', e.message));
      }

      setTasks((prev) => prev.map((t) => (t.id === id ? completed : t)));

      setHistory((prev) => [
        {
          id: `hist-${Date.now()}`,
          taskId: target.id,
          title: target.title,
          category: target.category,
          action: 'Completed',
          timestamp: new Date().toISOString(),
          importance: target.importance,
          notes: target.notes || 'Marked as completed.',
          taskSnapshot: { ...target },
        },
        ...prev,
      ]);

      const reaction = getReaction('completed');
      showToast(`${reaction} Completed "${target.title}"! 🎉`, 'celebrate');
    }
  };

  /**
   * Postpone task:
   * 1. Updates deadline and increments postponement count.
   * 2. Recalculates priority score using Max Heap.
   * 3. Persists to storage and logs history.
   */
  const postponeTask = async (id, newDeadline, reason = 'Rescheduled') => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const oldDeadline = task.deadline;
    const postponedCount = (task.postponedCount || 0) + 1;

    const updatedTaskPreview = {
      ...task,
      deadline: newDeadline,
      status: 'Pending',
      postponedCount,
      notes: reason ? `${task.notes ? task.notes + ' | ' : ''}Postponed: ${reason}` : task.notes,
    };
    const priorityData = calculatePriorityScore(updatedTaskPreview);
    const postponedTask = {
      ...updatedTaskPreview,
      priority: priorityData.priorityScore,
      priorityData,
    };

    if (user?.id && !user.isGuest) {
      await taskService.postponeTask({
        taskId: id,
        newDeadline,
        postponedCount,
        userId: user.id,
        taskTitle: task.title,
        newPriority: priorityData.priorityScore,
      }).catch((e) => console.warn('Cloud postpone error:', e.message));
    }

    setTasks((prev) => prev.map((t) => (t.id === id ? postponedTask : t)));

    setHistory((prev) => [
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
        taskSnapshot: { ...task },
      },
      ...prev,
    ]);

    const reaction = getReaction('postponed');
    showToast(`${reaction} Postponed with delay tax. Priority recalculated.`, 'warning');
    setPostponeModalTask(null);
  };

  /**
   * Restore a completed, postponed, or deleted task from history.
   */
  const restoreTask = async (historyItem) => {
    const existing = tasks.find((t) => t.id === historyItem.taskId);
    if (existing) {
      await toggleTaskStatus(existing.id);
      showToast(`Restored "${existing.title}" to pending tasks.`, 'info');
    } else {
      const snapshot = historyItem.taskSnapshot;
      const restored = snapshot
        ? {
            title: snapshot.title,
            description: snapshot.description || historyItem.notes || 'Restored from history archive.',
            category: snapshot.category || 'Other',
            deadline: snapshot.deadline || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
            importance: snapshot.importance || 'Medium',
            duration: snapshot.duration || 1.5,
          }
        : {
            title: historyItem.title,
            description: historyItem.notes || 'Restored from history archive.',
            category: historyItem.category || 'Other',
            deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
            importance: historyItem.importance || 'Medium',
            duration: 1.5,
          };

      await addTask(restored);
      showToast(`Restored "${historyItem.title}" to active tasks.`, 'info');
    }
  };

  /**
   * Reset sample college tasks.
   */
  const resetToSampleData = async () => {
    setIsLoadingTasks(true);
    const seeded = getSeededSampleTasks();

    if (user?.id && !user.isGuest) {
      try {
        for (const t of tasks) {
          await taskService.deleteTask(t.id, user.id);
        }
        for (const sample of seeded) {
          await taskService.createTask(sample, user.id);
        }
      } catch (e) {
        console.warn('Cloud reset warning:', e);
      }
    }

    setTasks(seeded);
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(seeded));
    } catch (e) {}
    showToast('Reset to college sample tasks successfully!', 'info');
    setIsLoadingTasks(false);
  };

  /**
   * Manually trigger migration of LocalStorage data to Supabase.
   */
  const migrateLocalData = async () => {
    if (!user?.id || user.isGuest) {
      showToast('Sign in with a Supabase account to migrate tasks to the cloud.', 'info');
      return;
    }

    let localTasks = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) localTasks = JSON.parse(saved);
    } catch (e) {}

    if (!localTasks || localTasks.length === 0) {
      showToast('No local tasks found to migrate.', 'info');
      return;
    }

    setIsLoadingTasks(true);
    const result = await taskService.migrateLocalTasks(localTasks, user.id);

    if (result.error) {
      showToast(`Migration error: ${result.error.message}`, 'warning');
    } else {
      showToast(`Successfully migrated ${result.migratedCount} tasks to Supabase!`, 'success');
      const { tasks: freshTasks } = await taskService.fetchUserTasks(user.id);
      setTasks(freshTasks);
    }
    setIsLoadingTasks(false);
  };

  // Constant-time Hash Map task getter
  const getTaskById = (id) => {
    return taskManagerRef.current.getTask(id);
  };

  // Compute stats and recommendations using the Max Heap and Analytics Engine
  const stats = useMemo(() => {
    const tm = new TaskManager();
    tm.setTasks(tasks);

    // Productivity metrics
    const productivityStats = calculateProductivityStats(tasks, history);

    // Filter today's tasks
    const todayTasks = tasks.filter((t) => isDueToday(t.deadline));

    // Extract highest-priority task directly from Max Heap root (O(1) peek)
    const topHeapTask = tm.getHighestPriorityTask();

    let recommendationReason = '';
    if (topHeapTask) {
      const pd = topHeapTask.priorityData || calculatePriorityScore(topHeapTask);
      recommendationReason = pd.reason || `Extracted by Max Heap root with Priority Score ${topHeapTask.priority}.`;
    }

    // Contextual Humorous message
    const humorMessage = getContextualHumorMessage(productivityStats);

    // Recharts Data Sets (Real Data)
    const chartData = {
      completedVsPending: getCompletedVsPendingChartData(tasks),
      category: getCategoryChartData(tasks),
      weekly: getWeeklyProductivityChartData(tasks, history),
      trend: getCompletionTrendChartData(tasks, history),
    };

    const syncStatus = tm.verifySynchronization();

    return {
      ...productivityStats,
      todayTasks,
      recommendedTask: topHeapTask,
      recommendationReason,
      humorMessage,
      chartData,
      syncStatus,
      heapPendingCount: tm.getPendingCount(),
    };
  }, [tasks, history]);

  /**
   * Mark a notification as read and persist to Supabase.
   */
  const markNotificationAsRead = async (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    );
    if (user?.id && !user.isGuest) {
      await taskService.markNotificationRead(notifId);
    }
  };

  /**
   * Mark all unread notifications as read and persist to Supabase.
   */
  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (user?.id && !user.isGuest) {
      await taskService.markAllNotificationsRead(user.id);
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.is_read).length;

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
    editModalTask,
    setEditModalTask,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    postponeTask,
    restoreTask,
    resetToSampleData,
    migrateLocalData,
    getTaskById,
    taskManager: taskManagerRef.current,
    stats,
    isLoadingTasks,
    cloudSyncStatus,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
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
