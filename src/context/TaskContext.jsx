/**
 * TaskContext.jsx
 * 
 * Global Task Management and Cloud Persistence Context for KAL SE PAKKA.
 * Coordinates:
 *  1. Supabase Cloud Persistence as the single source of truth (`public.tasks`, `task_events`, `notifications`).
 *  2. In-memory DSA Coordinator: Hash Map for O(1) lookups and Custom Max Heap for dynamic priority queueing.
 *  3. Row-Level Security (RLS) enforcement and user-isolated cloud task retrieval.
 *  4. One-time safe migration for existing LocalStorage data.
 *  5. Real Recharts analytics, productivity metrics, and algorithmic procrastination score.
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

const TaskContext = createContext();

const STORAGE_KEY_TASKS = 'kal_se_pakka_tasks_v1';
const STORAGE_KEY_HISTORY = 'kal_se_pakka_history_v1';

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  // Navigation active tab: 'dashboard' | 'tasks' | 'add-task' | 'productivity' | 'history'
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
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [notifications, setNotifications] = useState([]);

  // Core DSA Coordinator: Encapsulates Hash Map and Custom Max Heap
  const taskManagerRef = useRef(new TaskManager());

  // Tasks state (Source of truth: Supabase database)
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
        timestamp: '2026-11-01T14:15:00Z',
        importance: 'Medium',
        notes: 'Mentor approved profile and projects.',
      },
      {
        id: 'hist-2',
        taskId: 'task-8',
        title: 'Register for Inter-College Hackathon 2026',
        category: 'Other',
        action: 'Completed',
        timestamp: '2026-10-31T19:20:00Z',
        importance: 'Low',
        notes: 'Team registered for Web3/AI track.',
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
        importance: 'Medium',
      },
    ];
  });

  // Toast trigger helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  /**
   * 1. Supabase Initialization & Cloud Loading
   * Loads tasks from `public.tasks` scoped to authenticated user.
   * Performs safe one-time migration if cloud tasks are empty and local tasks exist.
   */
  useEffect(() => {
    let isMounted = true;

    const loadCloudTasks = async () => {
      if (!user?.id) {
        if (isMounted) {
          setTasks([]);
          setIsLoadingTasks(false);
        }
        return;
      }

      setIsLoadingTasks(true);
      setCloudSyncStatus('syncing');

      try {
        // Fetch user's tasks from Supabase
        const { tasks: cloudTasks, error } = await taskService.fetchUserTasks(user.id);

        if (error) {
          console.error('[TaskContext] Error fetching cloud tasks:', error.message);
          if (isMounted) {
            setCloudSyncStatus('error');
            showToast(`Could not load tasks from Supabase: ${error.message}`, 'warning');
          }
        } else if (isMounted) {
          const migrationKey = `ksp_migrated_${user.id}`;
          const alreadyMigrated = localStorage.getItem(migrationKey);

          // If no cloud tasks exist yet and haven't migrated local data for this user
          if (cloudTasks.length === 0 && alreadyMigrated !== 'true') {
            let localTasks = [];
            try {
              const saved = localStorage.getItem(STORAGE_KEY_TASKS);
              if (saved) localTasks = JSON.parse(saved);
            } catch (e) {}

            // Safe one-time migration if local tasks exist
            if (Array.isArray(localTasks) && localTasks.length > 0) {
              console.log(`[TaskContext] Migrating ${localTasks.length} local tasks to Supabase for ${user.email}...`);
              const migrationResult = await taskService.migrateLocalTasks(localTasks, user.id);
              if (migrationResult.migratedTasks && migrationResult.migratedTasks.length > 0) {
                setTasks(migrationResult.migratedTasks);
                showToast(`Cloud sync ready: Migrated ${migrationResult.migratedTasks.length} tasks to Supabase!`, 'success');
              } else {
                setTasks(cloudTasks);
              }
            } else {
              setTasks([]);
              localStorage.setItem(migrationKey, 'true');
            }
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
        console.error('[TaskContext] Exception in loadCloudTasks:', err);
        if (isMounted) setCloudSyncStatus('error');
      } finally {
        if (isMounted) setIsLoadingTasks(false);
      }
    };

    loadCloudTasks();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  /**
   * 2. Synchronize Hash Map and Max Heap whenever tasks state changes.
   * Maintains strict DSA invariants:
   *  - Hash Map contains all tasks for O(1) lookup.
   *  - Max Heap contains only pending/in-progress tasks ordered by priority score.
   */
  useEffect(() => {
    taskManagerRef.current.setTasks(tasks);
  }, [tasks]);

  // Sync to local backup storage safely (without deleting existing data)
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
   * 1. Validates and checks in-memory duplicates.
   * 2. Calculates priority score with (0.5*U + 0.3*I + 0.2*E).
   * 3. Inserts into Supabase `public.tasks`.
   * 4. Updates in-memory state, Hash Map, and Max Heap.
   * 5. Displays error toast and aborts if database write fails.
   */
  const addTask = async (newTaskData) => {
    const trimmedTitle = newTaskData.title ? newTaskData.title.trim() : '';

    if (!trimmedTitle) {
      showToast('Task title is mandatory', 'warning');
      return { success: false, error: 'Task title is mandatory.' };
    }

    if (!user?.id) {
      showToast('Authentication session required to save task.', 'warning');
      return { success: false, error: 'User is not authenticated.' };
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

    // Write to Supabase database
    const { task: createdTask, error } = await taskService.createTask(taskWithPriority, user.id);

    if (error || !createdTask) {
      const msg = error?.message || 'Database insert failed.';
      showToast(`Failed to create task in cloud: ${msg}`, 'warning');
      return { success: false, error: msg };
    }

    // Synchronize in-memory React state and DSA structures
    const fullEnrichedTask = {
      ...createdTask,
      priorityData,
    };

    setTasks((prev) => [fullEnrichedTask, ...prev]);
    showToast(`Task "${fullEnrichedTask.title}" saved! (Priority Score: ${fullEnrichedTask.priority})`, 'success');
    return { success: true, task: fullEnrichedTask };
  };

  /**
   * Edit/Update an existing task in Supabase and synchronize DSA structures.
   */
  const updateTask = async (id, updatedFields) => {
    if (!user?.id) return { success: false, error: 'Unauthenticated' };

    const existingTask = tasks.find((t) => t.id === id);
    if (!existingTask) return { success: false, error: 'Task not found' };

    const merged = { ...existingTask, ...updatedFields };

    if (updatedFields.title) merged.title = updatedFields.title.trim();
    if (updatedFields.duration !== undefined) {
      merged.duration = parseFloat(updatedFields.duration) || 1.0;
    }

    // Recalculate priority score
    const priorityData = calculatePriorityScore(merged);
    const fieldsToUpdate = {
      ...updatedFields,
      priority: priorityData.priorityScore,
    };

    // Persist to Supabase
    const { task: updatedTask, error } = await taskService.updateTask(id, fieldsToUpdate, user.id);

    if (error || !updatedTask) {
      showToast(`Failed to update task: ${error?.message || 'Database error'}`, 'warning');
      return { success: false, error: error?.message };
    }

    const fullUpdatedTask = {
      ...updatedTask,
      priorityData,
    };

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

    showToast('Task updated in cloud!', 'info');
    return { success: true, task: fullUpdatedTask };
  };

  /**
   * Delete a task from Supabase database.
   */
  const deleteTask = async (id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    if (!user?.id) {
      showToast('Authentication required to delete task.', 'warning');
      return;
    }

    const { success, error } = await taskService.deleteTask(id, user.id);

    if (!success || error) {
      showToast(`Could not delete task: ${error?.message || 'Database error'}`, 'warning');
      return;
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

    showToast(`Deleted "${taskToDelete.title}" (Cloud storage updated)`, 'info');
  };

  /**
   * Toggle task status between Completed and Pending.
   */
  const toggleTaskStatus = async (id) => {
    const target = tasks.find((t) => t.id === id);
    if (!target || !user?.id) return;

    if (target.status === 'Completed') {
      const priorityData = calculatePriorityScore({ ...target, status: 'Pending' });
      const { task: reopenedTask, error } = await taskService.reopenTask(id, user.id, priorityData.priorityScore);

      if (error || !reopenedTask) {
        showToast(`Failed to reopen task: ${error?.message || 'Database error'}`, 'warning');
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...reopenedTask, priorityData } : t))
      );
      showToast(`Reopened "${target.title}" (Re-entered Max Heap Queue)`, 'info');
    } else {
      const { task: completedTask, error } = await taskService.completeTask(id, user.id, target.title);

      if (error || !completedTask) {
        showToast(`Failed to complete task: ${error?.message || 'Database error'}`, 'warning');
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...completedTask } : t))
      );

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

      showToast(`Completed "${target.title}"! (Removed from Priority Queue) 🎉`, 'success');
    }
  };

  /**
   * Postpone task:
   * 1. Updates deadline and increments postponement count.
   * 2. Recalculates priority score using Max Heap.
   * 3. Persists to Supabase `public.tasks` and `task_events`.
   */
  const postponeTask = async (id, newDeadline, reason = 'Rescheduled') => {
    const task = tasks.find((t) => t.id === id);
    if (!task || !user?.id) return;

    const oldDeadline = task.deadline;
    const postponedCount = (task.postponedCount || 0) + 1;

    const updatedTaskPreview = {
      ...task,
      deadline: newDeadline,
      status: 'Pending',
      postponedCount,
    };
    const priorityData = calculatePriorityScore(updatedTaskPreview);

    const { task: persistedTask, error } = await taskService.postponeTask({
      taskId: id,
      newDeadline,
      postponedCount,
      userId: user.id,
      taskTitle: task.title,
      newPriority: priorityData.priorityScore,
    });

    if (error || !persistedTask) {
      showToast(`Failed to postpone task: ${error?.message || 'Database error'}`, 'warning');
      return;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...persistedTask, priorityData, notes: reason ? `${t.notes ? t.notes + ' | ' : ''}Postponed: ${reason}` : t.notes } : t
      )
    );

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

    showToast(`Task postponed in cloud: Priority recalculated in Max Heap.`, 'warning');
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
      showToast(`Restored "${historyItem.title}" to active cloud tasks.`, 'info');
    }
  };

  /**
   * Reset sample college tasks into Supabase cloud for the active user.
   */
  const resetToSampleData = async () => {
    if (!user?.id) return;
    setIsLoadingTasks(true);

    try {
      // Clear current tasks for user
      for (const t of tasks) {
        await taskService.deleteTask(t.id, user.id);
      }

      // Seed initial sample tasks
      for (const sample of INITIAL_TASKS) {
        await taskService.createTask(sample, user.id);
      }

      // Reload fresh from Supabase
      const { tasks: freshTasks } = await taskService.fetchUserTasks(user.id);
      setTasks(freshTasks);
      showToast('Sample tasks seeded into your Supabase account!', 'info');
    } catch (e) {
      console.error('Failed to reset sample tasks:', e);
      showToast('Failed to seed sample tasks to cloud.', 'warning');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  /**
   * Manually trigger one-time migration of LocalStorage data to Supabase.
   */
  const migrateLocalData = async () => {
    if (!user?.id) return;

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
    } else if (result.alreadyMigrated) {
      showToast('Tasks were already migrated previously.', 'info');
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
