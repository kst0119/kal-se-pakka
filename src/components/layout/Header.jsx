import React from 'react';
import { Menu, Plus, Calendar, Search, Sparkles } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { getTodayFormatted } from '../../utils/dateUtils';
import Button from '../common/Button';

const Header = ({ setIsMobileOpen }) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, stats } = useTask();

  const titles = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Manage priorities, analyze deadlines, and overcome procrastination.',
    },
    tasks: {
      title: 'My Tasks & Schedule',
      subtitle: `Viewing ${stats.total} total tasks across college coursework and projects.`,
    },
    'add-task': {
      title: 'Add New Task',
      subtitle: 'Schedule a new assignment, project milestone, or personal goal.',
    },
    productivity: {
      title: 'Productivity & Analytics',
      subtitle: 'Track your focus trends, procrastination index, and completion velocity.',
    },
    history: {
      title: 'Task History & Archive',
      subtitle: 'Review completed coursework and audit postponed tasks.',
    },
  };

  const currentInfo = titles[activeTab] || titles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side: Hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentInfo.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right side: Today's Date, Search & Quick Add button */}
        <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto">
          {/* Today's date pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs font-medium text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{getTodayFormatted()}</span>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'tasks' && e.target.value) {
                  setActiveTab('tasks');
                }
              }}
              className="w-full bg-slate-800/60 border border-slate-700/70 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
          </div>

          {/* Quick Add Task button */}
          {activeTab !== 'add-task' && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setActiveTab('add-task')}
              className="shrink-0"
            >
              Add Task
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

