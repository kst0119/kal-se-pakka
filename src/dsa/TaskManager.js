/**
 * TaskManager.js
 * 
 * Central DSA Coordinator for KAL SE PAKKA – Smart Procrastination & Task Management System.
 * 
 * Combines:
 *  1. Hash Map (JavaScript Map) for O(1) average time task lookups, mutations, and status checks.
 *  2. Max Heap (MaxHeap) for O(log N) dynamic priority queue maintenance and O(1) next-task extraction.
 * 
 * Invariant Guarantee:
 *  - The Hash Map stores ALL tasks (both active and completed).
 *  - The Max Heap stores ONLY active (pending / in-progress / overdue) tasks.
 *  - The Map and Max Heap remain strictly synchronized on every insert, update, status toggle, and deletion.
 */

import { MaxHeap } from './MaxHeap.js';
import { calculatePriorityScore } from './priorityCalculator.js';

export class TaskManager {
  constructor() {
    // Hash Map: taskId -> full enriched task object (O(1) lookup)
    this.taskMap = new Map();

    // Custom Max Heap for pending task priority queue
    this.maxHeap = new MaxHeap();
  }

  /**
   * Initializes or resets the TaskManager with an array of tasks.
   * Clears existing state, calculates priority scores, and populates both Map and Heap.
   * 
   * Time Complexity: O(N log N) for N insertions into the heap
   * 
   * @param {Array<Object>} tasks
   */
  setTasks(tasks = []) {
    this.taskMap.clear();
    this.maxHeap.clear();

    if (!Array.isArray(tasks)) return;

    for (const rawTask of tasks) {
      if (!rawTask || !rawTask.id) continue;

      // 1. Calculate Priority Score using the (0.5*U + 0.3*I + 0.2*E) formula
      const priorityData = calculatePriorityScore(rawTask);

      const enrichedTask = {
        ...rawTask,
        priority: priorityData.priorityScore,
        priorityData,
      };

      // 2. Store in Hash Map (O(1))
      this.taskMap.set(enrichedTask.id, enrichedTask);

      // 3. Insert into Max Heap ONLY if not completed (O(log N))
      if (enrichedTask.status !== 'Completed') {
        this.maxHeap.insert(enrichedTask);
      }
    }
  }

  /**
   * Adds a new task to the manager.
   * Inserts into Hash Map and, if pending, into the Max Heap.
   * 
   * Time Complexity:
   *  - Hash Map insertion: O(1)
   *  - Max Heap insertion: O(log N)
   *  - Overall: O(log N)
   * 
   * @param {Object} taskData
   * @returns {Object} Enriched task with calculated priority
   */
  addTask(taskData) {
    if (!taskData || !taskData.id) {
      throw new Error('Task must have a valid id.');
    }

    const priorityData = calculatePriorityScore(taskData);

    const enrichedTask = {
      ...taskData,
      priority: priorityData.priorityScore,
      priorityData,
    };

    // Add to Hash Map (O(1))
    this.taskMap.set(enrichedTask.id, enrichedTask);

    // Add to Max Heap if active (O(log N))
    if (enrichedTask.status !== 'Completed') {
      this.maxHeap.insert(enrichedTask);
    }

    return enrichedTask;
  }

  /**
   * Updates an existing task by ID.
   * Recalculates priority if relevant fields (deadline, importance, duration, status) changed.
   * Synchronizes Hash Map and Max Heap state.
   * 
   * Time Complexity:
   *  - Hash Map lookup: O(1)
   *  - Max Heap update / insert / remove: O(log N)
   *  - Overall: O(log N)
   * 
   * @param {string|number} id
   * @param {Object} updatedFields
   * @returns {Object|null} The updated task or null if not found
   */
  updateTask(id, updatedFields) {
    // 1. O(1) Hash Map lookup
    if (!this.taskMap.has(id)) {
      return null;
    }

    const existingTask = this.taskMap.get(id);
    const wasCompleted = existingTask.status === 'Completed';

    // Merge updates
    const mergedTask = {
      ...existingTask,
      ...updatedFields,
      id, // ensure ID is immutable
    };

    // 2. Recalculate priority
    const priorityData = calculatePriorityScore(mergedTask);
    mergedTask.priority = priorityData.priorityScore;
    mergedTask.priorityData = priorityData;

    // 3. Update Hash Map (O(1))
    this.taskMap.set(id, mergedTask);

    // 4. Synchronize with Max Heap (O(log N))
    const isNowCompleted = mergedTask.status === 'Completed';

    if (wasCompleted && !isNowCompleted) {
      // Reopened task: insert back into priority queue
      this.maxHeap.insert(mergedTask);
    } else if (!wasCompleted && isNowCompleted) {
      // Newly completed task: remove from priority queue
      this.maxHeap.remove(id);
    } else if (!isNowCompleted) {
      // Task remains active: update priority in heap
      if (this.maxHeap.contains(id)) {
        this.maxHeap.updatePriority(id, mergedTask.priority, mergedTask);
      } else {
        this.maxHeap.insert(mergedTask);
      }
    }

    return mergedTask;
  }

  /**
   * Removes a task from both the Hash Map and the Max Heap.
   * 
   * Time Complexity:
   *  - Hash Map delete: O(1)
   *  - Max Heap remove: O(log N)
   *  - Overall: O(log N)
   * 
   * @param {string|number} id
   * @returns {boolean} True if removed, false if not found
   */
  deleteTask(id) {
    if (!this.taskMap.has(id)) {
      return false;
    }

    // Remove from Hash Map
    this.taskMap.delete(id);

    // Remove from Max Heap
    this.maxHeap.remove(id);

    return true;
  }

  /**
   * Retrieves a task by ID in constant time via the Hash Map.
   * Time Complexity: O(1)
   * 
   * @param {string|number} id
   * @returns {Object|null}
   */
  getTask(id) {
    return this.taskMap.get(id) || null;
  }

  /**
   * Checks whether a task exists in the Hash Map.
   * Time Complexity: O(1)
   * 
   * @param {string|number} id
   * @returns {boolean}
   */
  hasTask(id) {
    return this.taskMap.has(id);
  }

  /**
   * Peeks the highest-priority pending task from the Max Heap without removing it.
   * Time Complexity: O(1)
   * 
   * @returns {Object|null}
   */
  getHighestPriorityTask() {
    return this.maxHeap.peek();
  }

  /**
   * Extracts (removes) the highest-priority pending task from the Max Heap.
   * Note: The task still remains in the Hash Map (unless deleted).
   * Time Complexity: O(log N)
   * 
   * @returns {Object|null}
   */
  extractHighestPriorityTask() {
    return this.maxHeap.extractMax();
  }

  /**
   * Returns an array of all tasks stored in the Hash Map.
   * Time Complexity: O(N)
   * 
   * @returns {Array<Object>}
   */
  getAllTasks() {
    return Array.from(this.taskMap.values());
  }

  /**
   * Returns all active (pending/in-progress/overdue) tasks directly from the Max Heap.
   * Time Complexity: O(N)
   * 
   * @returns {Array<Object>}
   */
  getPendingTasks() {
    return this.maxHeap.toArray();
  }

  /**
   * Returns current count of pending tasks in the priority queue.
   * Time Complexity: O(1)
   */
  getPendingCount() {
    return this.maxHeap.size();
  }

  /**
   * Returns total count of tasks in the Hash Map.
   * Time Complexity: O(1)
   */
  getTotalCount() {
    return this.taskMap.size;
  }

  /**
   * Recalculates priorities for all active tasks based on current time.
   * Updates Hash Map entries and re-establishes the Max Heap property.
   * Useful when wall-clock time passes and deadline urgencies change.
   */
  recalculateAll() {
    const all = Array.from(this.taskMap.values());
    this.setTasks(all);
  }

  /**
   * Verification helper to assert synchronization between Hash Map and Max Heap.
   * Validates:
   *  1. Every non-completed task in Map exists in Heap with identical priority.
   *  2. Heap contains no completed tasks.
   *  3. Heap size matches Map non-completed count.
   * 
   * @returns {{ synchronized: boolean, mapPendingCount: number, heapCount: number, mismatches: Array }}
   */
  verifySynchronization() {
    const mismatches = [];
    let mapPendingCount = 0;

    for (const [id, task] of this.taskMap.entries()) {
      if (task.status !== 'Completed') {
        mapPendingCount++;
        if (!this.maxHeap.contains(id)) {
          mismatches.push(`Pending task ${id} missing from Max Heap`);
        } else {
          const heapItem = this.maxHeap.get(id);
          if (heapItem.priority !== task.priority) {
            mismatches.push(
              `Task ${id} priority mismatch: Map=${task.priority}, Heap=${heapItem.priority}`
            );
          }
        }
      } else {
        if (this.maxHeap.contains(id)) {
          mismatches.push(`Completed task ${id} found in Max Heap`);
        }
      }
    }

    const heapCount = this.maxHeap.size();
    const isCountMatch = mapPendingCount === heapCount;
    if (!isCountMatch) {
      mismatches.push(`Count mismatch: Map pending=${mapPendingCount}, Heap=${heapCount}`);
    }

    return {
      synchronized: mismatches.length === 0,
      mapPendingCount,
      heapCount,
      mismatches,
    };
  }
}
