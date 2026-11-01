import React, { useState } from 'react';
import { TaskProvider, useTask } from './context/TaskContext';
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

function App() {
  return (
    <TaskProvider>
      <MainLayout />
    </TaskProvider>
  );
}

export default App;

