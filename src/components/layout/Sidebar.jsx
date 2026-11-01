import React from 'react';
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  TrendingUp,
  History,
  Clock,
  Sparkles,
  Code2,
  RotateCcw,
  X
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, stats, resetToSampleData } = useTask();

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
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
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
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-72 bg-dark-950/95 lg:bg-dark-950/60
          border-r border-slate-800/80 flex flex-col backdrop-blur-xl
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-xl">
              <span>⏳</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  KAL SE PAKKA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  DSA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Smart Task & Delay Tracker</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
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
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/25 to-purple-600/15 text-white border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/50'
                        : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Procrastination motivational quote / project badge */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Anti-Procrastination Rule #1</span>
          </div>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "Stop waiting for 'Kal'. The best way to reduce algorithmic anxiety is starting the first 5 minutes today."
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <Code2 className="w-3.5 h-3.5 text-sky-400" />
              DSA Mini-Project v1.0
            </span>
            <button
              onClick={resetToSampleData}
              title="Reset sample college tasks"
              className="hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* User preview */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs ring-2 ring-purple-500/20">
              AS
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">Aryan Sharma</div>
              <div className="text-[11px] text-slate-400 truncate">CS & Engineering • Sem 5</div>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" title="Online" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

