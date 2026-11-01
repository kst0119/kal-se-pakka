import React from 'react';
import { Menu, Plus, Calendar, Search, LogOut, Sun, Moon } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getTodayFormatted } from '../../utils/dateUtils';
import Button from '../common/Button';
import NotificationDropdown from '../common/NotificationDropdown';

const Header = ({ setIsMobileOpen }) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, stats } = useTask();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'KP';

  const titles = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Manage priorities, analyze deadlines, and overcome procrastination.',
    },
    tasks: {
      title: 'My Tasks & Schedule',
      subtitle: `Viewing ${stats.total} total tasks across coursework and personal goals.`,
    },
    'add-task': {
      title: 'Add New Task',
      subtitle: 'Schedule a new assignment, project milestone, or personal conquest.',
    },
    productivity: {
      title: 'Productivity & Analytics',
      subtitle: 'Track your focus velocity, delay penalties, and completion trends.',
    },
    history: {
      title: 'Task History & Archive',
      subtitle: 'Review completed coursework and audit postponed tasks.',
    },
  };

  const currentInfo = titles[activeTab] || titles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-cream-100/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-cream-300/80 dark:border-charcoal-800 px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side: Hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 text-charcoal-700 dark:text-cream-200 hover:text-charcoal-950 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-charcoal-950 dark:text-white tracking-tight">
                {currentInfo.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-0.5 hidden sm:block font-medium">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right side: Today's Date, Search, Notifications, Theme & Profile */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto w-full sm:w-auto">
          {/* Today's date pill */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-850 border border-cream-300 dark:border-charcoal-750 text-xs font-bold text-charcoal-700 dark:text-cream-200 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-coral-500" />
            <span>{getTodayFormatted()}</span>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:w-48 lg:w-56">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
              className="w-full bg-white dark:bg-charcoal-850 border border-cream-300 dark:border-charcoal-750 rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal-950 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all font-medium shadow-sm"
            />
          </div>

          {/* Notification Centre Bell */}
          <NotificationDropdown />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-charcoal-700 dark:text-cream-100 hover:border-coral-500 transition-all cursor-pointer shadow-sm"
            title={isDark ? 'Switch to Warm Cream Light Theme' : 'Switch to Dark Charcoal Theme'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-charcoal-700" />}
          </button>

          {/* Quick Add Task button */}
          {activeTab !== 'add-task' && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setActiveTab('add-task')}
              className="shrink-0 shadow-coral-glow"
            >
              Add Task
            </Button>
          )}

          {/* User profile avatar & Quick Sign Out */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-cream-300 dark:border-charcoal-800">
            <div
              className="w-8 h-8 rounded-xl bg-coral-500 flex items-center justify-center font-black text-white text-[11px] shadow-sm select-none"
              title={`${displayName} • ${user?.email || 'Logged in'}`}
            >
              {initials}
            </div>
            <button
              onClick={logout}
              title="Sign out of Kal Se Pakka"
              className="p-1.5 text-charcoal-400 hover:text-rose-500 hover:bg-cream-200 dark:hover:bg-charcoal-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
