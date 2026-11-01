import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTask } from './context/TaskContext';
import LandingPage from './components/landing/LandingPage';
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
    <div className="min-h-screen bg-cream-100 dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 flex transition-colors duration-200">
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
        <footer className="border-t border-cream-300 dark:border-charcoal-800 px-6 py-4 text-center text-xs text-charcoal-500 dark:text-charcoal-400">
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
  // State for unauthenticated user: null (Landing page) | 'login' | 'signup'
  const [authMode, setAuthMode] = useState(null);

  // If restoring session or checking auth state, display a sleek loading splash
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-coral-500 flex items-center justify-center text-white font-black text-3xl shadow-coral-glow animate-bounce">
            <span>⏳</span>
          </div>
          <div className="mt-5 flex items-center gap-2 font-black text-lg tracking-tight">
            <span>KAL SE PAKKA</span>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-lime-400 text-charcoal-950">
              DSA PRO
            </span>
          </div>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-2 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-coral-500 animate-ping" />
            Loading Supabase cloud session...
          </p>
        </div>
      </div>
    );
  }

  // If unauthenticated: Show Landing Page by default, or Auth view when user clicks Sign In / Get Started
  if (!user) {
    if (authMode) {
      return (
        <AuthView
          initialMode={authMode}
          onBackToLanding={() => setAuthMode(null)}
        />
      );
    }
    return <LandingPage onOpenAuth={(mode) => setAuthMode(mode || 'signup')} />;
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
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
