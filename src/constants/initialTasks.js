// Initial realistic sample tasks for college student productivity & DSA mini project context
export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'AVL Tree Self-Balancing Rotations',
    description: 'Implement LL, RR, LR, and RL rotations in C++ for DSA Lab 4 submission with test test cases.',
    category: 'Assignment',
    deadline: '2026-11-01T18:00',
    importance: 'High',
    duration: 2.5,
    status: 'Pending',
    createdAt: '2026-10-30T10:00:00Z',
    procrastinationScore: 82, // Higher urgency * importance heuristic
    notes: 'Need to submit zip archive on College Moodle before 6 PM.'
  },
  {
    id: 'task-2',
    title: 'Operating Systems CPU Scheduler Simulation',
    description: 'Build Round Robin and Priority preemptive scheduling algorithms with Gantt chart calculation.',
    category: 'Project',
    deadline: '2026-11-02T23:59',
    importance: 'High',
    duration: 4.0,
    status: 'In Progress',
    createdAt: '2026-10-28T14:30:00Z',
    procrastinationScore: 78,
    notes: 'Partner already finished FCFS; need to complete SJF & Round Robin.'
  },
  {
    id: 'task-3',
    title: 'DAA Mid-Semester Exam Prep: Dynamic Programming',
    description: 'Revise 0/1 Knapsack, Longest Common Subsequence (LCS), and Matrix Chain Multiplication proofs.',
    category: 'Exam',
    deadline: '2026-11-05T09:00',
    importance: 'High',
    duration: 5.0,
    status: 'Pending',
    createdAt: '2026-10-31T09:00:00Z',
    procrastinationScore: 65,
    notes: 'Solve at least 5 previous year university exam questions.'
  },
  {
    id: 'task-4',
    title: 'Computer Networks Packet Tracer Lab',
    description: 'Configure VLAN routing and subnet mask allocation for 4 departmental subnets in Cisco Packet Tracer.',
    category: 'Assignment',
    deadline: '2026-11-04T17:00',
    importance: 'Medium',
    duration: 2.0,
    status: 'Pending',
    createdAt: '2026-10-29T11:00:00Z',
    procrastinationScore: 48,
    notes: 'Verify ping connectivity between faculty and student VLANs.'
  },
  {
    id: 'task-5',
    title: 'Software Engineering UML Diagrams & SRS',
    description: 'Submit Software Requirements Specification document along with Use Case and Class diagrams.',
    category: 'Assignment',
    deadline: '2026-10-31T23:59', // Overdue
    importance: 'Medium',
    duration: 1.5,
    status: 'Overdue',
    createdAt: '2026-10-25T16:00:00Z',
    procrastinationScore: 94,
    notes: 'Late submission window active with 10% penalty.'
  },
  {
    id: 'task-6',
    title: 'Update Tech Resume & LeetCode Profile',
    description: 'Add recent DSA projects, linked list & graph problems count, and push latest GitHub repos.',
    category: 'Personal',
    deadline: '2026-11-07T20:00',
    importance: 'Medium',
    duration: 2.0,
    status: 'Completed',
    completedAt: '2026-11-01T14:15:00Z',
    createdAt: '2026-10-27T12:00:00Z',
    procrastinationScore: 30,
    notes: 'Reviewed by senior mentor and approved.'
  },
  {
    id: 'task-7',
    title: 'Discrete Math: Master Theorem & Recurrence Relations',
    description: 'Solve homework problem set 5 focusing on divide-and-conquer recurrence relations and generating functions.',
    category: 'Assignment',
    deadline: '2026-11-06T15:00',
    importance: 'Low',
    duration: 1.5,
    status: 'Pending',
    createdAt: '2026-10-30T18:00:00Z',
    procrastinationScore: 38,
    notes: 'Reference Rosen Chapter 8.'
  },
  {
    id: 'task-8',
    title: 'Register for Inter-College Hackathon 2026',
    description: 'Form team of 3, submit abstract for Web3/AI track, and confirm team registration.',
    category: 'Other',
    deadline: '2026-11-08T18:00',
    importance: 'Low',
    duration: 0.5,
    status: 'Completed',
    completedAt: '2026-10-31T19:20:00Z',
    createdAt: '2026-10-29T15:00:00Z',
    procrastinationScore: 20,
    notes: 'Registration code #HK-2026-9812'
  }
];

export const CATEGORIES = ['All', 'Assignment', 'Project', 'Exam', 'Personal', 'Other'];
export const IMPORTANCE_LEVELS = ['Low', 'Medium', 'High'];
export const TASK_STATUSES = ['All', 'Pending', 'In Progress', 'Completed', 'Overdue'];

