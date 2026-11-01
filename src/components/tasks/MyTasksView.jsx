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

        // Status filter
        if (selectedStatus !== 'All') {
          const taskOverdue = isOverdue(task.deadline, task.status);
          if (selectedStatus === 'Overdue') {
            if (!taskOverdue) return false;
          } else if (selectedStatus === 'Completed') {
            if (task.status !== 'Completed') return false;
          } else if (selectedStatus === 'In Progress') {
            if (task.status !== 'In Progress') return false;
          } else if (selectedStatus === 'Pending') {
            if (task.status !== 'Pending') return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline-asc') {
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
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-card backdrop-blur-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
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
              className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>

            {/* Importance Dropdown */}
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="All">All Importance</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-slate-200"
              >
                <option value="deadline-asc" className="bg-slate-900">Deadline (Earliest)</option>
                <option value="deadline-desc" className="bg-slate-900">Deadline (Latest)</option>
                <option value="importance-desc" className="bg-slate-900">Priority (High to Low)</option>
                <option value="duration-asc" className="bg-slate-900">Duration (Shortest)</option>
                <option value="duration-desc" className="bg-slate-900">Duration (Longest)</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800/70 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium whitespace-nowrap flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task Count & Quick Info Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-slate-400">
          Showing <span className="font-semibold text-white font-mono">{filteredTasks.length}</span>{' '}
          {filteredTasks.length === 1 ? 'task' : 'tasks'}
          {hasActiveFilters && ' (filtered)'}
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setActiveTab('add-task')}
        >
          Add Task
        </Button>
      </div>

      {/* Main View: Grid vs Table vs Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-4">
            <Inbox className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No tasks match your filter criteria</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Try adjusting your search terms, changing the category, or clear active filters.
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

