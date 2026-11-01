import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTask } from './context/TaskContext';
import AuthView from './components/auth/AuthView';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import MyTasksView from './components/tasks/MyTasksView';
import AddTaskView from './components/tasks/AddTaskView';
import ProductivityView from './components/productivity/ProductivityView';
import TaskHistoryView from './components/history/TaskHistoryView';
import PostponeModal from './components/common/PostponeModal';
import EditTaskModal from './components/common/EditTaskModal';
import Toast from './components/common/Toast';

const MainLayout = () => {
  const { activeTab } = useTask();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Render the current view according to active tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <MyTasksView />;
      case 'add-task':
        return <AddTaskView />;
      case 'productivity':
        return <ProductivityView />;
      case 'history':
        return <TaskHistoryView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Header Bar */}
        <Header setIsMobileOpen={setIsMobileOpen} />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
          <p>
            KAL SE PAKKA – Smart Procrastination & Task Management System • College DSA Mini Project
          </p>
        </footer>
      </div>

      {/* Modals & Floating Notifications */}
      <PostponeModal />
      <EditTaskModal />
      <Toast />
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();

  // If restoring session or checking auth state, display a sleek loading splash
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 flex items-center justify-center shadow-xl shadow-indigo-600/30 text-white font-black text-3xl animate-bounce">
            <span>⏳</span>
          </div>
          <div className="mt-6 flex items-center gap-2 text-white font-bold text-lg tracking-tight">
            <span>KAL SE PAKKA</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              DSA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            Verifying Supabase authentication session...
          </p>
        </div>
      </div>
    );
  }

  // If unauthenticated, display the full auth view (Login / Signup / Forgot Password)
  if (!user) {
    return <AuthView />;
  }

  // If authenticated, render the protected application dashboard & task system
  return (
    <TaskProvider>
      <MainLayout />
    </TaskProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
