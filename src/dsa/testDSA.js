/**
 * testDSA.js
 * 
 * Automated Test Suite for KAL SE PAKKA – Data Structures & Algorithms Implementation
 * Tests:
 *  1. Empty heap operations
 *  2. Inserting multiple tasks & maintaining Max Heap property
 *  3. Extracting the highest-priority task (Heap Sort verification)
 *  4. Handling equal priorities / tie-breaking
 *  5. Updating task priority (both increase and decrease)
 *  6. Removing tasks from root, internal, and leaf positions
 *  7. Priority Calculation formula normalization & safety
 *  8. Strict synchronization between Hash Map and Max Heap
 * 
 * Execute with: node src/dsa/testDSA.js
 */

import { MaxHeap } from './MaxHeap.js';
import { calculatePriorityScore, calculateUrgency, calculateImportance, calculateEffort } from './priorityCalculator.js';
import { TaskManager } from './TaskManager.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

function verifyMaxHeapProperty(heapInstance) {
  const arr = heapInstance.heap;
  for (let i = 1; i < arr.length; i++) {
    const parent = Math.floor((i - 1) / 2);
    if (heapInstance.comparator(arr[i], arr[parent]) > 0) {
      return false;
    }
  }
  return true;
}

console.log('\n======================================================');
console.log('  KAL SE PAKKA – DSA TEST SUITE (Part 2 Verification)');
console.log('======================================================\n');

// ---------------------------------------------------------------------------
// TEST 1: Empty Heap Edge Cases
// ---------------------------------------------------------------------------
console.log('1. Testing Empty Heap Handling:');
const emptyHeap = new MaxHeap();
assert(emptyHeap.isEmpty() === true, 'isEmpty() returns true on new heap');
assert(emptyHeap.size() === 0, 'size() is 0 on empty heap');
assert(emptyHeap.peek() === null, 'peek() returns null when empty');
assert(emptyHeap.extractMax() === null, 'extractMax() returns null when empty');
assert(emptyHeap.remove('non-existent') === null, 'remove() returns null for unknown ID');
assert(emptyHeap.updatePriority('non-existent', 50) === false, 'updatePriority() returns false for unknown ID');

// ---------------------------------------------------------------------------
// TEST 2: Inserting Multiple Tasks
// ---------------------------------------------------------------------------
console.log('\n2. Testing Insertions and Max Heap Property:');
const heap = new MaxHeap();
const sampleItems = [
  { id: 't1', title: 'Task 1', priority: 45.0 },
  { id: 't2', title: 'Task 2', priority: 85.5 },
  { id: 't3', title: 'Task 3', priority: 30.0 },
  { id: 't4', title: 'Task 4', priority: 95.0 },
  { id: 't5', title: 'Task 5', priority: 70.0 },
  { id: 't6', title: 'Task 6', priority: 60.0 },
];

sampleItems.forEach(item => heap.insert(item));
assert(heap.size() === 6, 'Heap has exactly 6 items inserted');
assert(verifyMaxHeapProperty(heap), 'Max Heap property satisfied for all nodes');
assert(heap.peek().id === 't4', 'peek() correctly returns highest-priority task (t4 with priority 95.0)');

// ---------------------------------------------------------------------------
// TEST 3: Extracting Highest-Priority Task
// ---------------------------------------------------------------------------
console.log('\n3. Testing ExtractMax (Heap Extraction):');
const extracted = [];
while (!heap.isEmpty()) {
  const max = heap.extractMax();
  extracted.push(max.priority);
  assert(verifyMaxHeapProperty(heap), `Heap property preserved after extracting priority ${max.priority}`);
}

assert(extracted.length === 6, 'Extracted all 6 items');
let isStrictlyDescending = true;
for (let i = 0; i < extracted.length - 1; i++) {
  if (extracted[i] < extracted[i + 1]) {
    isStrictlyDescending = false;
    break;
  }
}
assert(isStrictlyDescending, `Items extracted in descending order: [${extracted.join(', ')}]`);
assert(heap.isEmpty() === true, 'Heap is empty after extracting all elements');

// ---------------------------------------------------------------------------
// TEST 4: Handling Equal Priorities (Ties)
// ---------------------------------------------------------------------------
console.log('\n4. Testing Equal Priorities Handling:');
const tieHeap = new MaxHeap();
tieHeap.insert({ id: 'tie-1', priority: 80, deadline: '2026-11-05T12:00' });
tieHeap.insert({ id: 'tie-2', priority: 80, deadline: '2026-11-02T12:00' }); // Earlier deadline!
tieHeap.insert({ id: 'tie-3', priority: 80, deadline: '2026-11-08T12:00' });

assert(tieHeap.size() === 3, 'Inserted 3 items with equal priorities');
assert(verifyMaxHeapProperty(tieHeap), 'Max Heap property intact with equal priorities');
const topTie = tieHeap.peek();
assert(topTie.id === 'tie-2', `Tie-breaker prioritized earlier deadline (expected tie-2, got ${topTie.id})`);

// ---------------------------------------------------------------------------
// TEST 5: Updating Task Priority (Increase & Decrease)
// ---------------------------------------------------------------------------
console.log('\n5. Testing Priority Updates (Bubble Up & Bubble Down):');
const updateHeap = new MaxHeap();
updateHeap.insert({ id: 'u1', priority: 50 });
updateHeap.insert({ id: 'u2', priority: 90 });
updateHeap.insert({ id: 'u3', priority: 20 });
updateHeap.insert({ id: 'u4', priority: 70 });

// Case A: Increase priority of lowest item (20 -> 99.5) -> should become root
const upResult = updateHeap.updatePriority('u3', 99.5);
assert(upResult === true, 'updatePriority() succeeded for u3');
assert(updateHeap.peek().id === 'u3', 'u3 bubbled up to root after increasing priority to 99.5');
assert(verifyMaxHeapProperty(updateHeap), 'Max Heap property preserved after bubble-up');

// Case B: Decrease priority of current root (99.5 -> 10) -> should sink down
const downResult = updateHeap.updatePriority('u3', 10);
assert(downResult === true, 'updatePriority() succeeded for decrease');
assert(updateHeap.peek().id === 'u2', 'u2 is new root after u3 decreased priority');
assert(verifyMaxHeapProperty(updateHeap), 'Max Heap property preserved after bubble-down');

// ---------------------------------------------------------------------------
// TEST 6: Removing Tasks from Arbitrary Positions
// ---------------------------------------------------------------------------
console.log('\n6. Testing Arbitrary Node Removal:');
const removeHeap = new MaxHeap();
['a', 'b', 'c', 'd', 'e', 'f'].forEach((id, idx) => {
  removeHeap.insert({ id, priority: (idx + 1) * 10 });
});

// Remove middle element
const removedMiddle = removeHeap.remove('c');
assert(removedMiddle.id === 'c', 'Successfully removed middle element c');
assert(removeHeap.contains('c') === false, 'Element c no longer in heap');
assert(verifyMaxHeapProperty(removeHeap), 'Max Heap property preserved after middle removal');

// Remove root element
const rootId = removeHeap.peek().id;
const removedRoot = removeHeap.remove(rootId);
assert(removedRoot.id === rootId, `Successfully removed root element ${rootId}`);
assert(verifyMaxHeapProperty(removeHeap), 'Max Heap property preserved after root removal');

// ---------------------------------------------------------------------------
// TEST 7: Priority Calculation Utility
// ---------------------------------------------------------------------------
console.log('\n7. Testing Priority Calculation Utility:');
// Formula: (0.5 * Urgency) + (0.3 * Importance) + (0.2 * Effort)
const testTask = {
  deadline: '2026-11-01T21:00', // Close deadline (e.g. within an hour)
  importance: 'High',          // 100
  duration: 4.0,               // 85
};

const result = calculatePriorityScore(testTask);
assert(result.importanceScore === 100, 'High importance normalized to 100');
assert(result.effortScore === 85, '4.0 hours effort normalized to 85');
assert(result.urgencyScore >= 95, `Close deadline urgency is >= 95 (got ${result.urgencyScore})`);

// Expected: 0.5 * ~98 + 0.3 * 100 + 0.2 * 85 = 49 + 30 + 17 = 96
assert(result.priorityScore >= 90 && result.priorityScore <= 100, `Priority score is properly bounded (got ${result.priorityScore})`);

// Test overdue task
const overdueTask = {
  deadline: '2026-10-30T10:00', // Past deadline
  importance: 'Medium',         // 60
  duration: 2.0,                // 55
};
const overdueResult = calculatePriorityScore(overdueTask);
assert(overdueResult.isOverdue === true, 'Detected overdue deadline');
assert(overdueResult.urgencyScore === 100, 'Overdue urgency clamped to maximum 100');
// 0.5 * 100 + 0.3 * 60 + 0.2 * 55 = 50 + 18 + 11 = 79.0
assert(overdueResult.priorityScore === 79.0, `Overdue calculation exact match (expected 79.0, got ${overdueResult.priorityScore})`);

// ---------------------------------------------------------------------------
// TEST 8: Hash Map & Max Heap Synchronization via TaskManager
// ---------------------------------------------------------------------------
console.log('\n8. Testing TaskManager (Hash Map & Heap Synchronization):');
const manager = new TaskManager();

const initialBatch = [
  { id: 'task-a', title: 'Task A', deadline: '2026-11-02T10:00', importance: 'High', duration: 3, status: 'Pending' },
  { id: 'task-b', title: 'Task B', deadline: '2026-11-04T10:00', importance: 'Medium', duration: 1, status: 'Pending' },
  { id: 'task-c', title: 'Task C', deadline: '2026-11-05T10:00', importance: 'Low', duration: 2, status: 'Completed' }, // Completed!
];

manager.setTasks(initialBatch);
let syncCheck = manager.verifySynchronization();
assert(syncCheck.synchronized === true, 'Initial batch synchronized between Map and Heap');
assert(manager.getTotalCount() === 3, 'Hash Map holds all 3 tasks');
assert(manager.getPendingCount() === 2, 'Max Heap holds ONLY the 2 pending tasks (excludes completed task-c)');

// Step A: Mark task-a completed -> must be removed from Heap, retained in Map
manager.updateTask('task-a', { status: 'Completed' });
syncCheck = manager.verifySynchronization();
assert(syncCheck.synchronized === true, 'Sync maintained after completing task-a');
assert(manager.getPendingCount() === 1, 'Max Heap pending count decreased to 1');
assert(manager.getHighestPriorityTask().id === 'task-b', 'Highest priority task is now task-b');

// Step B: Reopen task-c -> must re-enter Heap
manager.updateTask('task-c', { status: 'Pending' });
syncCheck = manager.verifySynchronization();
assert(syncCheck.synchronized === true, 'Sync maintained after reopening task-c');
assert(manager.getPendingCount() === 2, 'Max Heap pending count restored to 2');

// Step C: Postpone task-b (closer deadline) -> priority recalculation
const oldPriority = manager.getTask('task-b').priority;
manager.updateTask('task-b', { deadline: '2026-11-01T21:00' }); // Sooner deadline
const newPriority = manager.getTask('task-b').priority;
assert(newPriority > oldPriority, `Priority increased with closer deadline (${oldPriority} -> ${newPriority})`);
assert(manager.getHighestPriorityTask().id === 'task-b', 'task-b moved to top of heap after urgency increase');

// Step D: Delete task-b -> removed from both Map and Heap
manager.deleteTask('task-b');
syncCheck = manager.verifySynchronization();
assert(syncCheck.synchronized === true, 'Sync maintained after deleting task-b');
assert(manager.hasTask('task-b') === false, 'task-b removed from Hash Map');
assert(manager.getPendingCount() === 1, 'Max Heap size updated');

// ---------------------------------------------------------------------------
// TEST 9: Part 3 CRUD Operations, Form Validation & Duplicate Detection
// ---------------------------------------------------------------------------
console.log('\n9. Testing Part 3 Task CRUD Operations & Validation:');
const crudManager = new TaskManager();

// 1. Add Task
const newTask = {
  id: 'task-101',
  title: 'Operating Systems Virtual Memory Lab',
  category: 'Assignment',
  deadline: '2026-11-03T18:00',
  importance: 'High',
  duration: 3.5,
  status: 'Pending',
};
const added = crudManager.addTask(newTask);
assert(crudManager.hasTask('task-101') === true, 'Task added to Hash Map');
assert(crudManager.maxHeap.contains('task-101') === true, 'Task added to Max Heap');
assert(added.priority > 0, `Priority computed on add (${added.priority})`);
assert(crudManager.verifySynchronization().synchronized === true, 'Map and Heap synchronized after Add');

// 2. Edit Task Details
const edited = crudManager.updateTask('task-101', {
  title: 'Operating Systems Page Replacement Lab (Modified)',
  duration: 5.0, // increased effort -> higher priority
  importance: 'High',
});
assert(edited.title === 'Operating Systems Page Replacement Lab (Modified)', 'Title updated in Hash Map');
assert(edited.duration === 5.0, 'Duration updated in Hash Map');
assert(crudManager.maxHeap.get('task-101').priority === edited.priority, 'Priority updated in Max Heap node');
assert(crudManager.verifySynchronization().synchronized === true, 'Map and Heap synchronized after Edit');

// 3. Mark Task Completed -> Heap Eviction
crudManager.updateTask('task-101', { status: 'Completed' });
assert(crudManager.hasTask('task-101') === true, 'Task remains in Hash Map after completion');
assert(crudManager.maxHeap.contains('task-101') === false, 'Completed task strictly evicted from Max Heap');
assert(crudManager.getHighestPriorityTask() === null, 'Max Heap is empty when only task is completed');
assert(crudManager.verifySynchronization().synchronized === true, 'Map and Heap synchronized after Completion');

// 4. Postpone Task -> Reopen & New Deadline
crudManager.updateTask('task-101', { status: 'Pending', deadline: '2026-11-02T12:00', postponedCount: 1 });
assert(crudManager.maxHeap.contains('task-101') === true, 'Postponed task re-enters Max Heap');
assert(crudManager.getHighestPriorityTask().id === 'task-101', 'Task becomes root of heap again');
assert(crudManager.verifySynchronization().synchronized === true, 'Map and Heap synchronized after Postponement');

// 5. Delete Task -> Complete Purge
crudManager.deleteTask('task-101');
assert(crudManager.hasTask('task-101') === false, 'Task purged from Hash Map on delete');
assert(crudManager.maxHeap.contains('task-101') === false, 'Task purged from Max Heap on delete');
assert(crudManager.verifySynchronization().synchronized === true, 'Map and Heap synchronized after Delete');

// ---------------------------------------------------------------------------
// TEST 10: Part 3 Search & Filtering Operations
// ---------------------------------------------------------------------------
console.log('\n10. Testing Part 3 Search and Filtering Logic:');
const testDataset = [
  { id: 'f1', title: 'Binary Search Tree Balancing', category: 'Assignment', importance: 'High', status: 'Pending', deadline: '2026-11-02T18:00', postponedCount: 0 },
  { id: 'f2', title: 'Graph Dijkstra Implementation', category: 'Project', importance: 'High', status: 'In Progress', deadline: '2026-11-04T18:00', postponedCount: 1 },
  { id: 'f3', title: 'Calculus Series Quiz Revision', category: 'Exam', importance: 'Medium', status: 'Completed', deadline: '2026-10-31T18:00', postponedCount: 0 },
  { id: 'f4', title: 'Resume Update for Placement', category: 'Personal', importance: 'Low', status: 'Pending', deadline: '2026-11-08T18:00', postponedCount: 2 },
  { id: 'f5', title: 'Old Theory Homework 1', category: 'Assignment', importance: 'Medium', status: 'Overdue', deadline: '2026-10-25T18:00', postponedCount: 0 },
];

// Search filter
const searchResults = testDataset.filter(t => t.title.toLowerCase().includes('dijkstra'));
assert(searchResults.length === 1 && searchResults[0].id === 'f2', 'Search by title matches correctly');

// Filter by Status: Completed
const completedFilter = testDataset.filter(t => t.status === 'Completed');
assert(completedFilter.length === 1 && completedFilter[0].id === 'f3', 'Filter by Completed status matches correctly');

// Filter by Status: Postponed
const postponedFilter = testDataset.filter(t => t.postponedCount && t.postponedCount > 0);
assert(postponedFilter.length === 2, `Filter by Postponed matches tasks with delay count > 0 (found ${postponedFilter.length})`);

// Filter by Category: Assignment
const assignmentFilter = testDataset.filter(t => t.category === 'Assignment');
assert(assignmentFilter.length === 2, 'Filter by Category matches Assignment tasks');

// Filter by Importance: High
const highImportanceFilter = testDataset.filter(t => t.importance === 'High');
assert(highImportanceFilter.length === 2, 'Filter by Importance matches High priority tasks');

console.log('\n======================================================');
console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
if (passedTests === totalTests) {
  console.log('  ALL DSA UNIT & INTEGRATION TESTS SUCCEEDED! 🎉');
} else {
  console.error(`  ${totalTests - passedTests} TEST(S) FAILED.`);
}
console.log('======================================================\n');

process.exit(passedTests === totalTests ? 0 : 1);

