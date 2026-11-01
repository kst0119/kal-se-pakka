import React from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { getTodayFormatted } from '../../utils/dateUtils';
import StatCard from './StatCard';
import NextRecommendedTask from './NextRecommendedTask';
import TodayOverview from './TodayOverview';
import ProductivityIndicator from './ProductivityIndicator';
import Button from '../common/Button';

const DashboardView = () => {
  const { stats, setActiveTab } = useTask();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>DSA Anti-Procrastination Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Aryan! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Today is <span className="text-indigo-300 font-semibold">{getTodayFormatted()}</span>.
              You have <span className="font-semibold text-white font-mono">{stats.pending}</span> pending tasks
              {stats.overdue > 0 ? (
                <span> and <span className="text-rose-400 font-semibold font-mono">{stats.overdue} overdue</span>. Let's tackle them before saying "Kal Se Pakka"!</span>
              ) : (
                <span>. You are on track with your deadlines today.</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setActiveTab('tasks')}
            >
              View All Tasks
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setActiveTab('add-task')}
            >
              + New Task
            </Button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          subtitle="All academic & personal items"
          icon={Layers}
          accentColor="indigo"
          onClick={() => setActiveTab('tasks')}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          subtitle="In queue & in progress"
          icon={Clock}
          accentColor="purple"
          onClick={() => setActiveTab('tasks')}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle={`${stats.completionRate}% completion velocity`}
          icon={CheckCircle2}
          accentColor="emerald"
          onClick={() => setActiveTab('history')}
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdue}
          subtitle={stats.overdue > 0 ? 'Urgent attention required' : 'Zero backlog slips'}
          icon={AlertTriangle}
          accentColor="rose"
          onClick={() => setActiveTab('tasks')}
        />
      </div>

      {/* Next Recommended Task Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Next Recommended Task
            </h2>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              (DSA Urgency & Importance Priority Heuristic)
            </span>
          </div>
        </div>
        <NextRecommendedTask />
      </div>

      {/* Two Column Section: Today's Task Overview + Productivity Progress Indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TodayOverview />
        </div>
        <div className="lg:col-span-5">
          <ProductivityIndicator />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

