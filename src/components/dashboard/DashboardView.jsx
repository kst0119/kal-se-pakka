import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Flame,
  Smile,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { getTodayFormatted } from '../../utils/dateUtils';
import StatCard from './StatCard';
import NextRecommendedTask from './NextRecommendedTask';
import TodayOverview from './TodayOverview';
import ProductivityIndicator from './ProductivityIndicator';
import Button from '../common/Button';

const DashboardView = () => {
  const { stats, setActiveTab } = useTask();
  const { user } = useAuth();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Bestie';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-charcoal-850 border border-cream-300 dark:border-charcoal-750 p-6 sm:p-8 shadow-card-light dark:shadow-card-dark transition-colors">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-500/10 border border-coral-500/20 text-coral-600 dark:text-coral-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-coral-500 animate-bounce" />
              <span>DSA Anti-Procrastination Engine</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-charcoal-950 dark:text-white tracking-tight">
              Hey {firstName}! Ready to lock in? 🔥
            </h1>

            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 max-w-2xl leading-relaxed font-medium">
              Today is <span className="text-coral-600 dark:text-coral-400 font-bold">{getTodayFormatted()}</span>.
              You have <span className="font-black text-charcoal-950 dark:text-white font-mono">{stats.pending}</span> pending task{stats.pending === 1 ? '' : 's'}
              {stats.overdue > 0 ? (
                <span> and <span className="text-rose-500 font-black font-mono">{stats.overdue} overdue</span>. Let's conquer them before saying "Kal Se Pakka"!</span>
              ) : (
                <span>. You are on track with your deadlines today!</span>
              )}
            </p>

            {stats.humorMessage && (
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 italic pt-1 flex items-center gap-1.5 font-medium">
                <Smile className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>"{stats.humorMessage.message}"</span>
              </p>
            )}
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
              icon={Plus}
              onClick={() => setActiveTab('add-task')}
              className="shadow-coral-glow"
            >
              New Task
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          subtitle="All academic & personal items"
          icon={Layers}
          accentColor="coral"
          onClick={() => setActiveTab('tasks')}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          subtitle="In queue & in progress"
          icon={Clock}
          accentColor="amber"
          onClick={() => setActiveTab('tasks')}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle={`${stats.completionRate}% completion rate`}
          icon={CheckCircle2}
          accentColor="lime"
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
            <h2 className="text-lg font-black text-charcoal-950 dark:text-white tracking-tight">
              Next Recommended Task
            </h2>
            <span className="text-xs text-charcoal-500 dark:text-charcoal-400 font-bold hidden sm:inline">
              (Extracted from Max Heap Root)
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
