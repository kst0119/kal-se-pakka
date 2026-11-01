# KAL SE PAKKA – Smart Procrastination & Task Management System

> **A College Mini-Project in Data Structures & Algorithms (DSA)**  
> An intelligent productivity dashboard designed to help college students combat academic procrastination through algorithmic task scheduling, priority scoring, and accountability tracking.

---

## 📌 1. Project Overview

**"KAL SE PAKKA"** (*"Definitely Tomorrow"*) is a common mindset among students that leads to delayed submissions, cramming before exams, and lost academic momentum. 

This project aims to transform that mindset into actionable daily progress. Unlike conventional to-do list applications that treat all tasks as static linear lists, **KAL SE PAKKA** is designed to leverage core **Data Structures and Algorithms (DSA)** to dynamically calculate task priority, recommend the optimal next task to tackle, and maintain an audit log of postponement patterns.

---

## ⚠️ 2. Problem Statement

College students frequently handle overlapping deadlines across coursework, programming labs, mid-term examinations, mini-projects, and personal goals. Existing task managers suffer from key limitations:

1. **Static Prioritization:** Standard applications rely solely on user-selected tags or simple due dates without factoring in remaining time, estimated effort, or past delay habits.
2. **Lack of Decision Guidance:** When faced with multiple urgent items, students experience decision paralysis and default to low-impact tasks or procrastination.
3. **No Delay Accountability:** Postponing a deadline is often frictionless, leading to repeated rescheduling without measuring the cumulative academic impact.

---

## 🎯 3. Project Objectives

- **Algorithmic Prioritization:** Dynamically compute task weights using urgency, academic weightage, and estimated duration.
- **Next-Best-Action Engine:** Surface the single most critical task for the user to work on right now, eliminating choice fatigue.
- **Postponement Audit:** Log every rescheduled deadline alongside student-provided reasons to track and analyze procrastination triggers.
- **Modern & Responsive User Experience:** Deliver an intuitive, distraction-free SaaS dashboard optimized for desktop and mobile viewports.
- **Direct Practical Application of DSA:** Demonstrate how foundational computer science data structures (Priority Queues/Heaps, Hash Maps, Arrays) solve practical scheduling bottlenecks.

---

## ⚙️ 4. Planned Features

| Feature Module | Description |
| :--- | :--- |
| **Dashboard** | Overview of active tasks, today's schedule, key metrics (Total, Pending, Completed, Overdue), and the Smart Next Recommended Task. |
| **Smart Task Recommendation** | Algorithmic highlight section explaining *why* a particular task is prioritized (e.g., imminent penalty vs. high-impact revision). |
| **Task Management ("My Tasks")** | Dual-view interface (Cards & Table) with multi-criteria search, category filters, priority filters, and sorting controls. |
| **Add Task Form** | Form supporting task metadata: title, description, category, deadline (date & time), priority, and estimated completion hours. |
| **Procrastination Accountability** | Interactive postponement modal that captures reschedule duration and underlying reasons, logging entries into history. |
| **Productivity Analytics (Placeholder)** | Visual analytics displaying completion velocity, category workloads, and study habit trends. |
| **Task History Archive** | Comprehensive audit trail of completed tasks and logged postponements with the ability to restore/reopen tasks. |

---

## 🧠 5. DSA Concepts to be Implemented

This project focuses on applying core Data Structures and Algorithms to real-world task scheduling:

### 1. Custom Max-Heap / Priority Queue
- **Purpose:** Power the **Smart Next Task Recommendation Engine**.
- **Operation:** Tasks are evaluated with a composite priority function:
  $$\text{Priority Score} = f(\text{Deadline Urgency}, \text{Importance Weight}, \text{Estimated Duration}, \text{Delay Penalty})$$
- **Complexity:**
  - `insert(task)`: $\mathcal{O}(\log N)$
  - `extractMax()`: $\mathcal{O}(\log N)$
  - `peekMax()`: $\mathcal{O}(1)$
- **Relevance:** Ensures the application always extracts the most critical pending task in logarithmic time, even as task volume grows.

### 2. Hash Map (Hash Table / Key-Value Map)
- **Purpose:** Constant-time task lookup, state mutation, and category aggregation.
- **Operation:**
  - Maps unique task identifiers (`taskId`) directly to task objects.
  - Used for category frequency indexing and status indexing.
- **Complexity:**
  - Lookup (`get`): Average $\mathcal{O}(1)$
  - Insertion / Update: Average $\mathcal{O}(1)$
  - Deletion: Average $\mathcal{O}(1)$
- **Relevance:** Enables immediate status toggles and lookups without scanning the entire task dataset.

### 3. Arrays (Sequential Lists)
- **Purpose:** Linear storage for tabular renders, chronologically sorted task streams, and history audit logging.
- **Operation:**
  - Dynamic array structures utilized for sorting algorithms (e.g., merge sort / quicksort variants for multi-attribute sorting by date, priority, or duration).
- **Complexity:**
  - Index-based access: $\mathcal{O}(1)$
  - Iteration & filtering: $\mathcal{O}(N)$

---

## 🛠️ 6. Planned Technology Stack

| Technology | Role |
| :--- | :--- |
| **React (v18+)** | Component-driven frontend architecture and state management |
| **Vite** | Modern, fast development server and build tool |
| **JavaScript (ES6+)** | Core language for UI components and upcoming DSA classes |
| **Tailwind CSS** | Utility-first CSS framework for custom dark-theme SaaS design |
| **Lucide React** | Consistent, modern icon set |
| **Recharts** *(Planned)* | Charting library for productivity and procrastination trend visualization |
| **Browser LocalStorage** | Client-side persistence for tasks and history logs across sessions |

---

## 📊 7. Current Development Status

> **Current Phase:** Parts 1, 2 & 3 Completed (UI, DSA Engine, and Full CRUD Synchronization)  
> **Next Phase:** Part 4 (Interactive Analytics & Advanced Recharts Engine)

### Progress Checklist

- [x] **Project Setup & Scaffolding:** React + Vite + Tailwind CSS configured.
- [x] **Modern Dark UI Design:** Charcoal/Navy background with purple and blue accents, custom scrollbars, and glassmorphism cards.
- [x] **Responsive Layout:** Desktop sidebar navigation and mobile overlay drawer.
- [x] **Dashboard View:** Stat cards, today's task overview, recommended task card, and productivity gauge.
- [x] **My Tasks View:** Grid and Table view toggles, real-time keyword search, category filters, and sorting.
- [x] **Add Task View:** Form with validation, duration steppers, quick deadline presets, and error states.
- [x] **Postponement Workflow:** Functional modal to record delay reasons and update deadlines.
- [x] **Task History View:** Completed task archive, postponement log, and deleted task audit trail.
- [x] **Data Persistence:** Context API with `localStorage` synchronization.
- [x] **Custom Max Heap (`MaxHeap.js`):** Binary heap with `insert`, `extractMax`, `peek`, `heapifyUp`, `heapifyDown`, `updatePriority`, and `remove` with $O(\log N)$ performance.
- [x] **Priority Calculation (`priorityCalculator.js`):** Mathematical formula $(0.5 \times \text{Urgency}) + (0.3 \times \text{Importance}) + (0.2 \times \text{Effort})$ with 0–100 normalization.
- [x] **Hash Map Synchronization (`TaskManager.js`):** JavaScript `Map` holding all tasks with $O(1)$ lookups, synchronized with the active Max Heap.
- [x] **Full Task CRUD Operations (Part 3):** Add, Edit (via EditTaskModal), Delete, Mark Completed, and Postpone with complete state synchronization.
- [x] **Comprehensive Validation & Duplicate Prevention (Part 3):** Mandatory titles, valid datetime deadlines, bounded effort hours, and active duplicate prevention.
- [x] **Multi-criteria Search & Filtering (Part 3):** Keyword title search, category pills, importance selector, and status filters (Pending, Completed, Overdue, Postponed).
- [x] **Automated DSA Test Suite (`testDSA.js`):** 75/75 automated test cases passed (`node src/dsa/testDSA.js`).
- [ ] **Interactive Visual Charts:** Full Recharts integration for productivity telemetry *(Part 4)*.
- [ ] **Greedy Interval Scheduling:** Time-slot allocation for study blocks *(Part 4)*.

---

## 💻 8. Installation & Run Instructions

Follow these steps to run the application locally on your computer:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (comes bundled with Node.js)

### Steps

1. **Clone or Navigate to the Project Directory:**
   ```bash
   cd KalSePakka
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. **Build for Production (Optional):**
   ```bash
   npm run build
   ```
   The compiled production assets will be generated in the `dist/` directory.

6. **Preview Production Build (Optional):**
   ```bash
   npm run preview
   ```

---

## 🔮 9. Future Enhancements

- **Greedy Interval Scheduling Algorithm:** Implement greedy activity selection to fit maximum high-priority tasks into a student's daily available free hours.
- **Procrastination Index Scoring:** An adaptive algorithm that increases task urgency weight the more times a student clicks "Postpone".
- **Pomodoro Focus Timer:** Integrated focus countdown with task completion tracking.
- **Import / Export Data:** Support backup and restore via JSON or CSV files.
- **LMS Calendar Integration:** Future sync capabilities with Google Classroom or university Moodle feeds via iCal.

---

## 🎓 Academic Submission Details

- **Project Title:** KAL SE PAKKA – Smart Procrastination & Task Management System
- **Subject:** Data Structures & Algorithms (DSA) Mini-Project
- **Department:** Department of Computer Science & Engineering
- **Current Version:** `1.0.0 (UI Foundation & Setup)`

---

*Built with passion to overcome procrastination, one task at a time.*

