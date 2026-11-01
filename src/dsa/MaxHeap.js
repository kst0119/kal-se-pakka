/**
 * MaxHeap.js
 * 
 * Custom Max Heap implementation for KAL SE PAKKA – Smart Procrastination & Task Management System.
 * 
 * Properties:
 * - Complete Binary Tree stored in a contiguous 0-indexed array.
 * - Max Heap Property: For every node i other than root, Priority(Parent(i)) >= Priority(i).
 * - Internal Hash Map (idToIndexMap) maintains constant-time O(1) position tracking
 *   to allow O(log N) updates and removals by task ID without linear search.
 * - Handles ties / equal priorities cleanly by preserving secondary ordering.
 */

export class MaxHeap {
  /**
   * Initializes an empty Max Heap.
   * @param {Function} [comparator] Optional custom comparator: returns positive if a has higher priority than b.
   */
  constructor(comparator = null) {
    // Array storage for heap elements
    this.heap = [];

    // Map: item.id -> index in this.heap
    // Enables O(1) index lookup for updatePriority() and remove()
    this.idToIndexMap = new Map();

    // Default comparator compares numerical .priority; secondary comparison on .deadline or .createdAt
    this.comparator = comparator || this._defaultComparator;
  }

  /**
   * Default comparator for Max Heap
   * Returns:
   *  > 0 if a has higher priority than b (a moves up)
   *  < 0 if b has higher priority than a
   *  = 0 if equal
   */
  _defaultComparator(a, b) {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    // Secondary tie-breaker: earlier deadline has higher urgency
    if (a.deadline && b.deadline) {
      const timeA = new Date(a.deadline).getTime();
      const timeB = new Date(b.deadline).getTime();
      if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
        return timeB - timeA; // earlier deadline is prioritized
      }
    }

    // Tertiary tie-breaker: FIFO by insertion order or creation date
    return (b.insertionOrder || 0) - (a.insertionOrder || 0);
  }

  /**
   * Get parent index for node at index i
   * Time Complexity: O(1)
   */
  _parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  /**
   * Get left child index for node at index i
   * Time Complexity: O(1)
   */
  _leftChildIndex(i) {
    return 2 * i + 1;
  }

  /**
   * Get right child index for node at index i
   * Time Complexity: O(1)
   */
  _rightChildIndex(i) {
    return 2 * i + 2;
  }

  /**
   * Swaps elements at indices i and j, keeping the index map in sync.
   * Time Complexity: O(1)
   */
  _swap(i, j) {
    const itemA = this.heap[i];
    const itemB = this.heap[j];

    this.heap[i] = itemB;
    this.heap[j] = itemA;

    // Update position map
    if (itemB && itemB.id !== undefined) {
      this.idToIndexMap.set(itemB.id, i);
    }
    if (itemA && itemA.id !== undefined) {
      this.idToIndexMap.set(itemA.id, j);
    }
  }

  /**
   * Restores Max Heap property upwards starting from index.
   * Compares child with parent and swaps if child > parent.
   * Time Complexity: O(log N)
   * 
   * @param {number} index
   * @returns {number} Final index of the element
   */
  heapifyUp(index) {
    let curr = index;

    while (curr > 0) {
      const parent = this._parentIndex(curr);

      // If current element has higher priority than parent, swap
      if (this.comparator(this.heap[curr], this.heap[parent]) > 0) {
        this._swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }

    return curr;
  }

  /**
   * Restores Max Heap property downwards starting from index.
   * Compares parent with its children and swaps with the largest child.
   * Time Complexity: O(log N)
   * 
   * @param {number} index
   * @returns {number} Final index of the element
   */
  heapifyDown(index) {
    let curr = index;
    const length = this.heap.length;

    while (true) {
      let largest = curr;
      const left = this._leftChildIndex(curr);
      const right = this._rightChildIndex(curr);

      // Check if left child is larger than current largest
      if (
        left < length &&
        this.comparator(this.heap[left], this.heap[largest]) > 0
      ) {
        largest = left;
      }

      // Check if right child is larger than current largest
      if (
        right < length &&
        this.comparator(this.heap[right], this.heap[largest]) > 0
      ) {
        largest = right;
      }

      // If largest is not the current element, swap and continue down
      if (largest !== curr) {
        this._swap(curr, largest);
        curr = largest;
      } else {
        break;
      }
    }

    return curr;
  }

  /**
   * Inserts an element into the Max Heap.
   * Adds to bottom-right of the tree, then bubbles up.
   * Time Complexity: O(log N)
   * 
   * @param {Object} item Object with at least an `id` and `priority` property.
   * @returns {boolean} Success status
   */
  insert(item) {
    if (!item || item.id === undefined) {
      throw new Error('Heap items must have an id property.');
    }

    // If item already exists, update its priority instead of duplicating
    if (this.idToIndexMap.has(item.id)) {
      return this.updatePriority(item.id, item.priority, item);
    }

    // Stamp insertion order for tie-breaking
    const node = {
      ...item,
      insertionOrder: Date.now() + Math.random(),
    };

    const newIndex = this.heap.length;
    this.heap.push(node);
    this.idToIndexMap.set(node.id, newIndex);

    this.heapifyUp(newIndex);
    return true;
  }

  /**
   * Returns the highest-priority element without removing it.
   * Time Complexity: O(1)
   * 
   * @returns {Object|null}
   */
  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  /**
   * Removes and returns the highest-priority element from the heap.
   * Swaps root with last leaf, pops, and bubbles root down.
   * Time Complexity: O(log N)
   * 
   * @returns {Object|null}
   */
  extractMax() {
    if (this.heap.length === 0) {
      return null;
    }

    const maxItem = this.heap[0];
    this.idToIndexMap.delete(maxItem.id);

    // If only one element was in the heap
    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    // Move the last element to root and remove last element
    const last = this.heap.pop();
    this.heap[0] = last;
    this.idToIndexMap.set(last.id, 0);

    // Restore heap property downwards
    this.heapifyDown(0);

    return maxItem;
  }

  /**
   * Updates priority of an existing item by ID.
   * Uses idToIndexMap for O(1) lookup, then restores heap property.
   * Time Complexity: O(log N)
   * 
   * @param {string|number} id Target item ID
   * @param {number} newPriority New priority score
   * @param {Object} [updatedData] Optional updated task payload
   * @returns {boolean} True if updated, false if not found
   */
  updatePriority(id, newPriority, updatedData = null) {
    if (!this.idToIndexMap.has(id)) {
      return false;
    }

    const index = this.idToIndexMap.get(id);
    const oldPriority = this.heap[index].priority;

    // Update item data
    if (updatedData) {
      this.heap[index] = {
        ...this.heap[index],
        ...updatedData,
        id,
        priority: newPriority,
      };
    } else {
      this.heap[index].priority = newPriority;
    }

    // If priority increased, bubble up; if decreased, bubble down
    if (newPriority > oldPriority) {
      this.heapifyUp(index);
    } else if (newPriority < oldPriority) {
      this.heapifyDown(index);
    } else {
      // Re-evaluate in case tie-breaker fields (deadline, etc.) changed
      const upIndex = this.heapifyUp(index);
      if (upIndex === index) {
        this.heapifyDown(index);
      }
    }

    return true;
  }

  /**
   * Removes an element by its unique ID from anywhere in the heap.
   * Swaps with last leaf, pops, and restores heap property.
   * Time Complexity: O(log N)
   * 
   * @param {string|number} id
   * @returns {Object|null} The removed item, or null if not found
   */
  remove(id) {
    if (!this.idToIndexMap.has(id)) {
      return null;
    }

    const index = this.idToIndexMap.get(id);
    const removedItem = this.heap[index];
    this.idToIndexMap.delete(id);

    // If the element to remove is the last one in the heap
    if (index === this.heap.length - 1) {
      this.heap.pop();
      return removedItem;
    }

    // Replace target with the last element
    const last = this.heap.pop();
    this.heap[index] = last;
    this.idToIndexMap.set(last.id, index);

    // Bubble in appropriate direction
    const parent = this._parentIndex(index);
    if (index > 0 && this.comparator(this.heap[index], this.heap[parent]) > 0) {
      this.heapifyUp(index);
    } else {
      this.heapifyDown(index);
    }

    return removedItem;
  }

  /**
   * Returns current count of items in the heap.
   * Time Complexity: O(1)
   */
  size() {
    return this.heap.length;
  }

  /**
   * Returns true if heap is empty.
   * Time Complexity: O(1)
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Returns item by ID in O(1) time without modifying heap.
   */
  get(id) {
    if (!this.idToIndexMap.has(id)) return null;
    return this.heap[this.idToIndexMap.get(id)];
  }

  /**
   * Checks if an ID exists in the heap.
   * Time Complexity: O(1)
   */
  contains(id) {
    return this.idToIndexMap.has(id);
  }

  /**
   * Returns shallow copy of internal array.
   */
  toArray() {
    return [...this.heap];
  }

  /**
   * Clears all elements from the heap.
   * Time Complexity: O(1)
   */
  clear() {
    this.heap = [];
    this.idToIndexMap.clear();
  }
}

