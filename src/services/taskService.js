/**
 * taskService.js
 * 
 * Reusable Supabase Cloud Task Persistence Service for KAL SE PAKKA.
 * Provides real database CRUD operations:
 *  - fetchUserTasks(userId)
 *  - createTask(taskData, userId)
 *  - updateTask(taskId, updatedFields, userId)
 *  - deleteTask(taskId, userId)
 *  - completeTask(taskId, userId)
 *  - reopenTask(taskId, userId)
 *  - postponeTask(taskId, newDeadline, postponedCount, userId, reason)
 *  - fetchTaskEvents(userId)
 *  - fetchNotifications(userId)
 *  - markNotificationRead(notifId)
 *  - migrateLocalTasks(localTasks, userId)
 * 
 * Security & Invariants:
 *  - Scoped to authenticated user session.
 *  - Enforces database status constraints ('pending', 'completed').
 *  - Records task telemetry events into `public.task_events`.
 *  - Records student notifications into `public.notifications`.
 *  - Never exposes service-role keys.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

/**
 * Maps a Supabase Database row to an Application Task object.
 */
export const dbTaskToAppTask = (dbTask) => {
  if (!dbTask) return null;

  return {
    id: dbTask.id,
    user_id: dbTask.user_id,
    title: dbTask.title || '',
    description: dbTask.description || '',
    category: dbTask.category || 'Other',
    deadline: dbTask.deadline,
    importance: dbTask.importance || 'Medium',
    duration: typeof dbTask.estimated_effort === 'number'
      ? dbTask.estimated_effort
      : parseFloat(dbTask.estimated_effort) || 1.0,
    status: dbTask.status === 'completed' ? 'Completed' : 'Pending',
    priority: typeof dbTask.priority_score === 'number'
      ? dbTask.priority_score
      : parseFloat(dbTask.priority_score) || 0,
    postponedCount: dbTask.postponed_count || 0,
    createdAt: dbTask.created_at,
    updatedAt: dbTask.updated_at,
    completedAt: dbTask.completed_at || null,
  };
};

/**
 * Maps an Application Task object to a Supabase Database row.
 */
export const appTaskToDbTask = (appTask, userId) => {
  const dbRecord = {
    title: appTask.title ? appTask.title.trim() : '',
    description: appTask.description || '',
    category: appTask.category || 'Other',
    deadline: appTask.deadline,
    importance: appTask.importance || 'Medium',
    estimated_effort: parseFloat(appTask.duration) || 1.0,
    status: appTask.status === 'Completed' ? 'completed' : 'pending',
    priority_score: typeof appTask.priority === 'number' ? appTask.priority : 0,
    postponed_count: appTask.postponedCount || 0,
  };

  if (userId) {
    dbRecord.user_id = userId;
  }
  if (appTask.completedAt) {
    dbRecord.completed_at = appTask.completedAt;
  }

  return dbRecord;
};

export const taskService = {
  /**
   * Fetches all tasks belonging to the authenticated user from `public.tasks`.
   * Row-Level Security automatically ensures user isolation.
   * 
   * @param {string} [userId]
   * @returns {Promise<{ tasks: Array, error: Object|null }>}
   */
  async fetchUserTasks(userId) {
    if (!isSupabaseConfigured) {
      return { tasks: [], error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[taskService.fetchUserTasks] Error:', error.message);
        return { tasks: [], error };
      }

      const tasks = (data || []).map(dbTaskToAppTask);
      return { tasks, error: null };
    } catch (err) {
      console.error('[taskService.fetchUserTasks] Unexpected exception:', err);
      return { tasks: [], error: err };
    }
  },

  /**
   * Inserts a new task into `public.tasks` and logs a CREATED event.
   * 
   * @param {Object} taskData
   * @param {string} userId
   * @returns {Promise<{ task: Object|null, error: Object|null }>}
   */
  async createTask(taskData, userId) {
    if (!isSupabaseConfigured) {
      return { task: null, error: new Error('Supabase is not configured.') };
    }
    if (!userId) {
      return { task: null, error: new Error('Authenticated user ID is required.') };
    }

    try {
      const dbPayload = appTaskToDbTask(taskData, userId);

      const { data, error } = await supabase
        .from('tasks')
        .insert(dbPayload)
        .select()
        .single();

      if (error) {
        console.error('[taskService.createTask] Error:', error.message);
        return { task: null, error };
      }

      const createdTask = dbTaskToAppTask(data);

      // Asynchronously log event and notification (non-blocking for UI speed)
      this.logTaskEvent({
        taskId: createdTask.id,
        userId,
        eventType: 'CREATED',
      }).catch((e) => console.warn('Could not record task event:', e.message));

      this.createNotification({
        userId,
        title: 'Task Created',
        message: `Task "${createdTask.title}" scheduled with Priority Score ${createdTask.priority}.`,
      }).catch((e) => console.warn('Could not record notification:', e.message));

      return { task: createdTask, error: null };
    } catch (err) {
      console.error('[taskService.createTask] Unexpected exception:', err);
      return { task: null, error: err };
    }
  },

  /**
   * Updates an existing task in `public.tasks`.
   * 
   * @param {string} taskId
   * @param {Object} updatedFields
   * @param {string} userId
   * @returns {Promise<{ task: Object|null, error: Object|null }>}
   */
  async updateTask(taskId, updatedFields, userId) {
    if (!isSupabaseConfigured) {
      return { task: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const patch = {
        updated_at: new Date().toISOString(),
      };

      if (updatedFields.title !== undefined) patch.title = updatedFields.title.trim();
      if (updatedFields.description !== undefined) patch.description = updatedFields.description;
      if (updatedFields.category !== undefined) patch.category = updatedFields.category;
      if (updatedFields.deadline !== undefined) patch.deadline = updatedFields.deadline;
      if (updatedFields.importance !== undefined) patch.importance = updatedFields.importance;
      if (updatedFields.duration !== undefined) {
        patch.estimated_effort = parseFloat(updatedFields.duration) || 1.0;
      }
      if (updatedFields.status !== undefined) {
        patch.status = updatedFields.status === 'Completed' ? 'completed' : 'pending';
      }
      if (updatedFields.priority !== undefined) {
        patch.priority_score = updatedFields.priority;
      }
      if (updatedFields.completedAt !== undefined) {
        patch.completed_at = updatedFields.completedAt;
      }
      if (updatedFields.postponedCount !== undefined) {
        patch.postponed_count = updatedFields.postponedCount;
      }

      let query = supabase.from('tasks').update(patch).eq('id', taskId);
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.select().single();

      if (error) {
        console.error('[taskService.updateTask] Error:', error.message);
        return { task: null, error };
      }

      const updatedTask = dbTaskToAppTask(data);

      if (userId) {
        this.logTaskEvent({
          taskId,
          userId,
          eventType: 'UPDATED',
        }).catch((e) => console.warn('Could not record task event:', e.message));
      }

      return { task: updatedTask, error: null };
    } catch (err) {
      console.error('[taskService.updateTask] Unexpected exception:', err);
      return { task: null, error: err };
    }
  },

  /**
   * Marks a task as completed with timestamp.
   * 
   * @param {string} taskId
   * @param {string} userId
   * @param {string} taskTitle
   * @returns {Promise<{ task: Object|null, error: Object|null }>}
   */
  async completeTask(taskId, userId, taskTitle = 'Task') {
    const completedAt = new Date().toISOString();
    const result = await this.updateTask(
      taskId,
      {
        status: 'Completed',
        completedAt,
      },
      userId
    );

    if (result.task && userId) {
      this.logTaskEvent({
        taskId,
        userId,
        eventType: 'COMPLETED',
      }).catch((e) => console.warn('Could not record task event:', e.message));

      this.createNotification({
        userId,
        title: 'Task Completed 🎉',
        message: `Great focus! "${taskTitle}" marked as completed and cleared from priority queue.`,
      }).catch((e) => console.warn('Could not record notification:', e.message));
    }

    return result;
  },

  /**
   * Reopens a completed task back to pending status.
   * 
   * @param {string} taskId
   * @param {string} userId
   * @param {number} priorityScore
   * @returns {Promise<{ task: Object|null, error: Object|null }>}
   */
  async reopenTask(taskId, userId, priorityScore) {
    const result = await this.updateTask(
      taskId,
      {
        status: 'Pending',
        completedAt: null,
        priority: priorityScore,
      },
      userId
    );

    if (result.task && userId) {
      this.logTaskEvent({
        taskId,
        userId,
        eventType: 'REOPENED',
      }).catch((e) => console.warn('Could not record task event:', e.message));
    }

    return result;
  },

  /**
   * Postpones a task to a new deadline and increments postponement counter.
   * 
   * @param {Object} params
   * @param {string} params.taskId
   * @param {string} params.newDeadline
   * @param {number} params.postponedCount
   * @param {string} params.userId
   * @param {string} [params.taskTitle]
   * @param {number} [params.newPriority]
   * @returns {Promise<{ task: Object|null, error: Object|null }>}
   */
  async postponeTask({ taskId, newDeadline, postponedCount, userId, taskTitle = 'Task', newPriority }) {
    const result = await this.updateTask(
      taskId,
      {
        deadline: newDeadline,
        status: 'Pending',
        postponedCount,
        priority: newPriority,
      },
      userId
    );

    if (result.task && userId) {
      this.logTaskEvent({
        taskId,
        userId,
        eventType: 'POSTPONED',
      }).catch((e) => console.warn('Could not record task event:', e.message));

      this.createNotification({
        userId,
        title: 'Task Postponed ⏳',
        message: `"${taskTitle}" postponed. Delay count incremented to ${postponedCount}. Priority recalculated.`,
      }).catch((e) => console.warn('Could not record notification:', e.message));
    }

    return result;
  },

  /**
   * Deletes a task from `public.tasks`.
   * Safely removes referencing events if needed.
   * 
   * @param {string} taskId
   * @param {string} userId
   * @returns {Promise<{ success: boolean, error: Object|null }>}
   */
  async deleteTask(taskId, userId) {
    if (!isSupabaseConfigured) {
      return { success: false, error: new Error('Supabase is not configured.') };
    }

    try {
      // 1. Clean up referencing events to respect foreign key constraint
      try {
        await supabase.from('task_events').delete().eq('task_id', taskId);
      } catch (e) {
        // Continue if CASCADE already handles it
      }

      // 2. Delete task row
      let query = supabase.from('tasks').delete().eq('id', taskId);
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;
      if (error) {
        console.error('[taskService.deleteTask] Error:', error.message);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('[taskService.deleteTask] Unexpected exception:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Logs a task activity event to `public.task_events`.
   * 
   * @param {Object} params
   * @param {string} params.taskId
   * @param {string} params.userId
   * @param {string} params.eventType 'CREATED' | 'UPDATED' | 'COMPLETED' | 'POSTPONED' | 'REOPENED'
   * @returns {Promise<{ success: boolean, error: Object|null }>}
   */
  async logTaskEvent({ taskId, userId, eventType }) {
    if (!isSupabaseConfigured || !userId) return { success: false, error: null };

    try {
      const { data, error } = await supabase.from('task_events').insert({
        task_id: taskId,
        user_id: userId,
        event_type: eventType,
      });

      return { success: !error, error };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  /**
   * Dispatches an in-app student notification into `public.notifications`.
   * 
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.title
   * @param {string} params.message
   * @returns {Promise<{ success: boolean, error: Object|null }>}
   */
  async createNotification({ userId, title, message }) {
    if (!isSupabaseConfigured || !userId) return { success: false, error: null };

    try {
      const { data, error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        is_read: false,
      });

      return { success: !error, error };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  /**
   * Fetches task events history for the user from `public.task_events`.
   * 
   * @param {string} userId
   * @returns {Promise<{ events: Array, error: Object|null }>}
   */
  async fetchTaskEvents(userId) {
    if (!isSupabaseConfigured || !userId) return { events: [], error: null };

    try {
      const { data, error } = await supabase
        .from('task_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      return { events: data || [], error };
    } catch (err) {
      return { events: [], error: err };
    }
  },

  /**
   * Fetches user notifications from `public.notifications`.
   * 
   * @param {string} userId
   * @returns {Promise<{ notifications: Array, error: Object|null }>}
   */
  async fetchNotifications(userId) {
    if (!isSupabaseConfigured || !userId) return { notifications: [], error: null };

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      return { notifications: data || [], error };
    } catch (err) {
      return { notifications: [], error: err };
    }
  },

  /**
   * Marks a notification as read.
   * 
   * @param {string|number} notifId
   * @returns {Promise<{ success: boolean, error: Object|null }>}
   */
  async markNotificationRead(notifId) {
    if (!isSupabaseConfigured) return { success: false, error: null };

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notifId);

      return { success: !error, error };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  /**
   * Marks all unread notifications as read for the user.
   * 
   * @param {string} userId
   * @returns {Promise<{ success: boolean, error: Object|null }>}
   */
  async markAllNotificationsRead(userId) {
    if (!isSupabaseConfigured || !userId) return { success: false, error: null };

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      return { success: !error, error };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  /**
   * Performs a safe, one-time migration of LocalStorage tasks to Supabase.
   * Prevents duplicate imports by tracking a user-specific migration flag.
   * 
   * @param {Array<Object>} localTasks
   * @param {string} userId
   * @returns {Promise<{ migratedCount: number, error: Object|null }>}
   */
  async migrateLocalTasks(localTasks = [], userId) {
    if (!isSupabaseConfigured || !userId) {
      return { migratedCount: 0, error: new Error('Cannot migrate: missing auth session.') };
    }

    const migrationKey = `ksp_migrated_${userId}`;
    const alreadyMigrated = localStorage.getItem(migrationKey);

    if (alreadyMigrated === 'true') {
      return { migratedCount: 0, error: null, alreadyMigrated: true };
    }

    if (!Array.isArray(localTasks) || localTasks.length === 0) {
      localStorage.setItem(migrationKey, 'true');
      return { migratedCount: 0, error: null, alreadyMigrated: false };
    }

    try {
      // Map valid tasks (omitting local string IDs like 'task-1' so Postgres assigns UUIDs)
      const recordsToInsert = localTasks.map((t) => appTaskToDbTask(t, userId));

      const { data, error } = await supabase
        .from('tasks')
        .insert(recordsToInsert)
        .select();

      if (error) {
        console.error('[taskService.migrateLocalTasks] Error:', error.message);
        return { migratedCount: 0, error, alreadyMigrated: false };
      }

      // Mark migration flag in localStorage to prevent duplicate imports on refresh
      localStorage.setItem(migrationKey, 'true');

      // Log notification
      this.createNotification({
        userId,
        title: 'Local Tasks Migrated ☁️',
        message: `Successfully migrated ${data?.length || 0} local tasks to your Supabase cloud storage!`,
      }).catch(() => {});

      return {
        migratedCount: data?.length || 0,
        migratedTasks: (data || []).map(dbTaskToAppTask),
        error: null,
        alreadyMigrated: false,
      };
    } catch (err) {
      console.error('[taskService.migrateLocalTasks] Exception:', err);
      return { migratedCount: 0, error: err, alreadyMigrated: false };
    }
  },
};

