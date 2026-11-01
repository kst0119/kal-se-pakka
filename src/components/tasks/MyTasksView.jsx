import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  Inbox,
  Flame,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { CATEGORIES } from '../../constants/initialTasks';
import TaskCard from './TaskCard';
import TaskTable from './TaskTable';
import Button from '../common/Button';
import { isOverdue } from '../../utils/dateUtils';

const MyTasksView = () => {
  const { tasks, searchQuery, setSearchQuery, setActiveTab } = useTask();

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedImportance, setSelectedImportance] = useState('All');
  const [sortBy, setSortBy] = useState('deadline-asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchCat = task.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && task.category !== selectedCategory) {
          return false;
        }

        // Importance filter
        if (selectedImportance !== 'All' && task.importance !== selectedImportance) {
          return false;
        }

        // Status filter (Pending, Completed, Overdue, Postponed)
        if (selectedStatus !== 'All') {
          const taskOverdue = isOverdue(task.deadline, task.status);
          if (selectedStatus === 'Overdue') {
            if (!taskOverdue || task.status === 'Completed') return false;
          } else if (selectedStatus === 'Completed') {
            if (task.status !== 'Completed') return false;
          } else if (selectedStatus === 'Postponed') {
            if (!task.postponedCount || task.postponedCount <= 0) return false;
          } else if (selectedStatus === 'In Progress') {
            if (task.status !== 'In Progress') return false;
          } else if (selectedStatus === 'Pending') {
            if (task.status !== 'Pending') return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority-desc') {
          return (b.priority || 0) - (a.priority || 0);
        } else if (sortBy === 'deadline-asc') {
          return new Date(a.deadline) - new Date(b.deadline);
        } else if (sortBy === 'deadline-desc') {
          return new Date(b.deadline) - new Date(a.deadline);
        } else if (sortBy === 'importance-desc') {
          const order = { High: 3, Medium: 2, Low: 1 };
          return (order[b.importance] || 0) - (order[a.importance] || 0);
        } else if (sortBy === 'duration-asc') {
          return (a.duration || 0) - (b.duration || 0);
        } else if (sortBy === 'duration-desc') {
          return (b.duration || 0) - (a.duration || 0);
        }
        return 0;
      });
  }, [tasks, searchQuery, selectedCategory, selectedStatus, selectedImportance, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedImportance('All');
    setSortBy('deadline-asc');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    selectedStatus !== 'All' ||
    selectedImportance !== 'All';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-charcoal-850 rounded-3xl border border-cream-200 dark:border-charcoal-750 p-4 sm:p-5 shadow-card-light dark:shadow-card-dark space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-charcoal-950 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/50 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-400 hover:text-coral-500 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns + View toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs font-bold text-charcoal-800 dark:text-cream-200 focus:outline-none focus:ring-2 focus:ring-coral-500/50 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue ⚠️</option>
              <option value="Postponed">Postponed ⏳</option>
            </select>

            {/* Importance Dropdown */}
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs font-bold text-charcoal-800 dark:text-cream-200 focus:outline-none focus:ring-2 focus:ring-coral-500/50 cursor-pointer"
            >
              <option value="All">All Importance</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs font-bold text-charcoal-800 dark:text-cream-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-coral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-charcoal-800 dark:text-cream-200"
              >
                <option value="priority-desc">⚡ Priority (Max Heap Order)</option>
                <option value="deadline-asc">Deadline (Earliest)</option>
                <option value="deadline-desc">Deadline (Latest)</option>
                <option value="importance-desc">Priority (High to Low)</option>
                <option value="duration-asc">Duration (Shortest)</option>
                <option value="duration-desc">Duration (Longest)</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="flex items-center bg-cream-100 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-coral-500 text-white shadow-sm'
                    : 'text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-coral-500 text-white shadow-sm'
                    : 'text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-cream-200 dark:border-charcoal-800 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-charcoal-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-coral-500" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-coral-500 text-white shadow-coral-glow'
                    : 'bg-cream-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-950 dark:hover:text-white hover:bg-cream-200 dark:hover:bg-charcoal-750'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-coral-600 dark:text-coral-400 hover:underline font-extrabold whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task Count Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs sm:text-sm font-medium text-charcoal-500 dark:text-charcoal-400">
          Showing <span className="font-black text-charcoal-950 dark:text-white font-mono">{filteredTasks.length}</span>{' '}
          {filteredTasks.length === 1 ? 'task' : 'tasks'}
          {hasActiveFilters && ' (filtered)'}
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setActiveTab('add-task')}
          className="shadow-coral-glow"
        >
          Add Task
        </Button>
      </div>

      {/* Main View: Grid vs Table vs Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-charcoal-850 rounded-3xl border border-cream-200 dark:border-charcoal-750 p-12 text-center flex flex-col items-center justify-center shadow-card-light dark:shadow-card-dark">
          <div className="w-16 h-16 rounded-3xl bg-cream-200 dark:bg-charcoal-800 flex items-center justify-center text-3xl mb-4 shadow-sm">
            🤔
          </div>
          <h3 className="text-lg font-black text-charcoal-950 dark:text-white mb-1">
            Zero tasks match your filter criteria
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 max-w-sm mb-6 font-medium">
            Either you're in complete god mode with zero tasks, or your filters are a bit too strict, bestie!
          </p>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <Button variant="outline" size="md" onClick={resetFilters}>
                Clear All Filters
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setActiveTab('add-task')}
              className="shadow-coral-glow"
            >
              Create New Task
            </Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <TaskTable tasks={filteredTasks} />
      )}
    </div>
  );
};

export default MyTasksView;
