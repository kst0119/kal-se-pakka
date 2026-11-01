import React from 'react';
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  TrendingUp,
  History,
  Sparkles,
  Code2,
  RotateCcw,
  LogOut,
  X,
  Sun,
  Moon,
  Flame,
  Cloud,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, stats, resetToSampleData, cloudSyncStatus, migrateLocalData } = useTask();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'College Student';
  const displayEmail = user?.email || 'Authenticated User';
  
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'KP';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks',
      label: 'My Tasks',
      icon: ListTodo,
      badge: stats.pending > 0 ? stats.pending : null,
      badgeColor: 'bg-lime-400 text-charcoal-950 font-black',
    },
    {
      id: 'add-task',
      label: 'Add Task',
      icon: PlusCircle,
      badge: null,
    },
    {
      id: 'productivity',
      label: 'Productivity',
      icon: TrendingUp,
      badge: 'Stats',
      badgeColor: 'bg-coral-500/15 text-coral-600 dark:text-coral-400 font-bold border border-coral-500/20',
    },
    {
      id: 'history',
      label: 'Task History',
      icon: History,
      badge: null,
    },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-72 bg-cream-50/95 dark:bg-charcoal-950/95
          border-r border-cream-300/80 dark:border-charcoal-800 flex flex-col backdrop-blur-xl
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-cream-200 dark:border-charcoal-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white font-black text-xl shadow-coral-glow">
              <span>⏳</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-charcoal-950 dark:text-white">
                  KAL SE PAKKA
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-lime-400 text-charcoal-950 shadow-sm">
                  DSA PRO
                </span>
              </div>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">Smart Task & Delay Tracker</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-200 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-extrabold tracking-wider uppercase text-charcoal-400 dark:text-charcoal-500">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 group cursor-pointer
                  ${
                    isActive
                      ? 'bg-coral-500 text-white shadow-coral-glow'
                      : 'text-charcoal-700 dark:text-charcoal-300 hover:text-charcoal-950 dark:hover:text-white hover:bg-cream-200/70 dark:hover:bg-charcoal-850'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-charcoal-400 dark:text-charcoal-500 group-hover:text-charcoal-700 dark:group-hover:text-cream-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.badgeColor || 'bg-cream-200 dark:bg-charcoal-800 text-charcoal-700 dark:text-cream-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Motivational Quote / Reset Sample Card */}
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-800 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2 text-coral-600 dark:text-coral-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-coral-500" />
            <span>Anti-Procrastination Rule #1</span>
          </div>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-300 italic leading-relaxed font-medium">
            "Stop waiting for 'Kal'. The best way to reduce algorithmic anxiety is starting the first 5 minutes today."
          </p>
          <div className="mt-3 pt-2.5 border-t border-cream-200 dark:border-charcoal-800 flex items-center justify-between text-[11px] text-charcoal-400 dark:text-charcoal-500">
            <span className="flex items-center gap-1 text-charcoal-500 dark:text-charcoal-400 font-medium">
              <Code2 className="w-3.5 h-3.5 text-lime-500" />
              DSA v2.0
            </span>
            <button
              onClick={resetToSampleData}
              title="Reset sample college tasks in cloud"
              className="hover:text-coral-500 flex items-center gap-1 transition-colors font-bold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Cloud Sync & Theme Toggle Bar */}
        <div className="px-5 py-2.5 flex items-center justify-between text-[11px] text-charcoal-500 dark:text-charcoal-400 border-t border-cream-200 dark:border-charcoal-800 bg-cream-100/50 dark:bg-charcoal-900/40">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                cloudSyncStatus === 'synced'
                  ? 'bg-lime-500'
                  : cloudSyncStatus === 'syncing'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-400'
              }`}
            />
            <span className="text-[11px] font-bold text-charcoal-700 dark:text-cream-200">
              {cloudSyncStatus === 'synced'
                ? 'Cloud Synced'
                : cloudSyncStatus === 'syncing'
                ? 'Syncing...'
                : 'Supabase Active'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={migrateLocalData}
              title="Import local tasks to cloud database"
              className="hover:text-coral-500 text-[10px] text-charcoal-500 dark:text-charcoal-400 transition-colors font-bold cursor-pointer"
            >
              Migrate Local
            </button>

            <span className="text-cream-300 dark:text-charcoal-700">|</span>

            {/* Quick Theme Switcher */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-1 rounded-lg text-charcoal-600 dark:text-cream-300 hover:text-coral-500 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Authenticated User Profile & Logout */}
        <div className="p-4 border-t border-cream-200 dark:border-charcoal-800 bg-white/70 dark:bg-charcoal-900/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 shrink-0 rounded-full bg-coral-500 flex items-center justify-center font-black text-white text-xs shadow-coral-glow select-none">
              {initials}
            </div>
            <div className="truncate min-w-0">
              <div className="text-xs font-bold text-charcoal-950 dark:text-cream-100 truncate" title={displayName}>
                {displayName}
              </div>
              <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 truncate" title={displayEmail}>
                {displayEmail}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of Kal Se Pakka"
            className="p-2 rounded-xl text-charcoal-400 hover:text-rose-500 hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
