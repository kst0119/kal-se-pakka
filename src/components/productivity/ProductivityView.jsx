import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  Sparkles,
  Smile,
  Hourglass,
  Calendar,
  Inbox,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateUtils';

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1.5 border ${
        isDark
          ? 'bg-charcoal-900/95 border-charcoal-700 text-cream-100'
          : 'bg-cream-50/95 border-cream-300 text-charcoal-900'
      }`}>
        {label && (
          <p className={`font-bold pb-1 border-b ${
            isDark ? 'text-cream-200 border-charcoal-750' : 'text-charcoal-800 border-cream-200'
          }`}>
            {label}
          </p>
        )}
        {payload.map((entry, idx) => (
          <p key={idx} className="flex items-center justify-between gap-3 font-mono" style={{ color: entry.color || entry.fill }}>
            <span className="font-medium">{entry.name}:</span>
            <span className={`font-bold ${isDark ? 'text-cream-50' : 'text-charcoal-950'}`}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProductivityView = () => {
  const { stats, setActiveTab } = useTask();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    total,
    completed,
    pending,
    overdue,
    postponed,
    completionRate,
    procrastinationScore,
    completedHours,
    pendingHours,
    totalEstimatedHours = (completedHours || 0) + (pendingHours || 0),
    humorMessage,
    chartData,
    recommendedTask,
  } = stats;

  const { completedVsPending, category, weekly, trend } = chartData || {};

  // Theme-aware colors
  const gridColor = isDark ? '#262933' : '#E6DFD5';
  const axisColor = isDark ? '#9CA3AF' : '#78716C';

  // Palette colors for charts
  const chartColors = {
    Completed: '#84CC16',  // Lime Green
    'In Progress': '#F59E0B', // Amber
    Pending: '#FF5C35',   // Coral Orange
    Overdue: '#EF4444',   // Rose / Red
  };

  // Procrastination Rating level
  const getProcrastinationLevel = (score) => {
    if (score >= 70) return { label: 'Danger Zone 🔥', color: 'text-rose-500', badge: 'bg-rose-500/10 border-rose-500/25 text-rose-500 dark:text-rose-400' };
    if (score >= 40) return { label: 'Lagging Behind ⚠️', color: 'text-amber-500', badge: 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400' };
    if (score > 0) return { label: 'In The Zone ⚡', color: 'text-coral-500', badge: 'bg-coral-500/10 border-coral-500/25 text-coral-600 dark:text-coral-400' };
    return { label: 'Locked In 👑', color: 'text-lime-600 dark:text-lime-400', badge: 'bg-lime-500/15 border-lime-500/30 text-lime-700 dark:text-lime-300' };
  };

  const procLevel = getProcrastinationLevel(procrastinationScore);

  return (
    <div className="space-y-6">
      {/* 1. Contextual Humour & Motivation Banner */}
      {humorMessage && (
        <div className="relative overflow-hidden rounded-2xl bg-cream-100/90 dark:bg-charcoal-850 border border-coral-500/30 p-5 shadow-card transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-coral-500/15 text-coral-500 border border-coral-500/25 shrink-0 mt-0.5">
                <Flame className="w-5 h-5 text-coral-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-coral-600 dark:text-coral-400">
                    {humorMessage.title}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${procLevel.badge}`}>
                    Procrastination Score: {procrastinationScore}/100
                  </span>
                </div>
                <p className="text-sm font-semibold text-charcoal-900 dark:text-cream-100 italic">
                  "{humorMessage.message}"
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('tasks')}
              className="shrink-0 self-end sm:self-auto"
            >
              Take Action
            </Button>
          </div>
        </div>
      )}

      {/* 2. Top Summary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Tasks */}
        <Card className="p-4 border-l-4 border-l-charcoal-400 dark:border-l-charcoal-600">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-350 text-[11px] font-bold uppercase tracking-wider">
            <span>Total Tasks</span>
            <Layers className="w-4 h-4 text-charcoal-600 dark:text-charcoal-300" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-charcoal-900 dark:text-cream-100">
            {total}
          </div>
          <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5 font-medium">
            {totalEstimatedHours} hrs workload
          </div>
        </Card>

        {/* Completed Tasks */}
        <Card className="p-4 border-l-4 border-l-lime-500">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-350 text-[11px] font-bold uppercase tracking-wider">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-lime-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-lime-600 dark:text-lime-400">
            {completed}
          </div>
          <div className="text-[11px] text-lime-600 dark:text-lime-400 mt-0.5 font-semibold">
            {completionRate}% finished
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="p-4 border-l-4 border-l-coral-500">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-350 text-[11px] font-bold uppercase tracking-wider">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-coral-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-coral-600 dark:text-coral-400">
            {pending}
          </div>
          <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5 font-medium">
            {pendingHours} hrs in queue
          </div>
        </Card>

        {/* Overdue Tasks */}
        <Card className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-350 text-[11px] font-bold uppercase tracking-wider">
            <span>Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-rose-500">
            {overdue}
          </div>
          <div className={`text-[11px] mt-0.5 ${overdue > 0 ? 'text-rose-500 font-bold' : 'text-charcoal-500 dark:text-charcoal-400'}`}>
            {overdue > 0 ? 'Needs panic mode 🚨' : 'Zero slips 🎯'}
          </div>
        </Card>

        {/* Postponed Tasks */}
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-350 text-[11px] font-bold uppercase tracking-wider">
            <span>Postponed</span>
            <Hourglass className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {postponed}
          </div>
          <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5 font-medium">
            "Kal Se Pakka" calls
          </div>
        </Card>

        {/* Procrastination Score */}
        <Card className="p-4 border-l-4 border-l-coral-500">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-350 text-[11px] font-bold uppercase tracking-wider">
            <span>Procrastination</span>
            <Zap className="w-4 h-4 text-coral-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-coral-600 dark:text-coral-400">
            {procrastinationScore}
            <span className="text-xs text-charcoal-500 dark:text-charcoal-400 font-normal">/100</span>
          </div>
          <div className={`text-[10px] mt-0.5 font-bold uppercase ${procLevel.color}`}>
            {procLevel.label}
          </div>
        </Card>
      </div>

      {/* 3. Next Recommended Task Highlight from Max Heap */}
      {recommendedTask && (
        <div className="p-5 rounded-2xl bg-cream-100/90 dark:bg-charcoal-850 border-l-4 border-l-coral-500 border border-cream-300 dark:border-charcoal-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lime-500/15 text-lime-700 dark:text-lime-300 border border-lime-500/30">
                Max Heap Top Priority
              </span>
              <span className="text-xs font-mono font-bold text-coral-600 dark:text-coral-400">
                ⚡ Priority Score: {recommendedTask.priority?.toFixed(1) || '0.0'}
              </span>
            </div>
            <h4 className="text-base font-bold text-charcoal-900 dark:text-cream-100">
              {recommendedTask.title}
            </h4>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-300">
              Deadline: <span className="font-mono text-coral-600 dark:text-coral-400 font-semibold">{formatDate(recommendedTask.deadline)}</span> • Estimated Effort: <span className="font-mono text-charcoal-700 dark:text-cream-200 font-semibold">{recommendedTask.duration} hrs</span>
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => setActiveTab('dashboard')}
            className="shrink-0"
          >
            Open in Dashboard
          </Button>
        </div>
      )}

      {/* 4. Charts Row 1: Completed vs Pending (Pie) & Tasks by Category (Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Completed vs Pending Distribution */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-cream-200 dark:border-charcoal-750 mb-4">
                <h3 className="font-bold text-charcoal-900 dark:text-cream-100 text-base">Task Status Breakdown</h3>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Completed vs Pending vs Overdue</p>
              </div>

              {completedVsPending && completedVsPending.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completedVsPending}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {completedVsPending.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[entry.name] || entry.color || '#FF5C35'}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip isDark={isDark} />} />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Inbox className="w-10 h-10 text-charcoal-400 dark:text-charcoal-500 mb-2" />
                  <p className="text-sm font-semibold text-charcoal-800 dark:text-cream-200">No task records</p>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1 max-w-xs">
                    Create tasks to generate real-time status telemetry.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-cream-200 dark:border-charcoal-750 flex items-center justify-between text-xs text-charcoal-500 dark:text-charcoal-400">
              <span>Completion Velocity: {completionRate}%</span>
              <span className="text-coral-500 font-semibold">Live Recharts Pie</span>
            </div>
          </Card>
        </div>

        {/* Chart 2: Tasks by Category */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-cream-200 dark:border-charcoal-750 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-charcoal-900 dark:text-cream-100 text-base">Tasks by Academic Category</h3>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Completed vs Pending per domain</p>
                </div>
                <span className="text-xs font-mono text-charcoal-500 dark:text-charcoal-400">
                  {category?.length || 0} active categories
                </span>
              </div>

              {category && category.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={category} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="category" stroke={axisColor} fontSize={11} tickLine={false} />
                      <YAxis stroke={axisColor} fontSize={11} allowDecimals={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip isDark={isDark} />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="completed" name="Completed" fill="#84CC16" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" name="Pending" fill="#FF5C35" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="overdue" name="Overdue" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Inbox className="w-10 h-10 text-charcoal-400 dark:text-charcoal-500 mb-2" />
                  <p className="text-sm font-semibold text-charcoal-800 dark:text-cream-200">No category data</p>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1 max-w-xs">
                    Assign categories (Assignment, Project, Exam) to compare workload.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-cream-200 dark:border-charcoal-750 flex items-center justify-between text-xs text-charcoal-500 dark:text-charcoal-400">
              <span>Categorical Distribution</span>
              <span className="text-lime-600 dark:text-lime-400 font-semibold">Recharts Grouped Bar</span>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. Charts Row 2: Weekly Productivity & Completion Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Weekly Productivity (Last 7 Days) */}
        <div className="lg:col-span-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-cream-200 dark:border-charcoal-750 mb-4">
                <h3 className="font-bold text-charcoal-900 dark:text-cream-100 text-base">Weekly Productivity (Past 7 Days)</h3>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Planned deadlines vs Actual completed tasks</p>
              </div>

              {weekly && weekly.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="day" stroke={axisColor} fontSize={11} tickLine={false} />
                      <YAxis stroke={axisColor} fontSize={11} allowDecimals={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip isDark={isDark} />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="planned" name="Planned / Due" fill={isDark ? '#3D4251' : '#D5CDBE'} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" name="Completed" fill="#84CC16" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Calendar className="w-10 h-10 text-charcoal-400 dark:text-charcoal-500 mb-2" />
                  <p className="text-sm font-semibold text-charcoal-800 dark:text-cream-200">No weekly activity</p>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1 max-w-xs">
                    Complete tasks across this week to track your streak.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-cream-200 dark:border-charcoal-750 flex items-center justify-between text-xs text-charcoal-500 dark:text-charcoal-400">
              <span>7-Day Productivity Window</span>
              <span className="text-coral-500 font-semibold">Recharts Bar</span>
            </div>
          </Card>
        </div>

        {/* Chart 4: Task Completion Trend (Area) */}
        <div className="lg:col-span-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-cream-200 dark:border-charcoal-750 mb-4">
                <h3 className="font-bold text-charcoal-900 dark:text-cream-100 text-base">Cumulative Completion Trend</h3>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Growth of completed tasks over time</p>
              </div>

              {trend && trend.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="5%" stopColor="#84CC16" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#84CC16" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="label" stroke={axisColor} fontSize={11} tickLine={false} />
                      <YAxis stroke={axisColor} fontSize={11} allowDecimals={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip isDark={isDark} />} />
                      <Area
                        type="monotone"
                        dataKey="completions"
                        name="Completed Tasks"
                        stroke="#84CC16"
                        strokeWidth={2.5}
                        fill="url(#trendGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Inbox className="w-10 h-10 text-charcoal-400 dark:text-charcoal-500 mb-2" />
                  <p className="text-sm font-semibold text-charcoal-800 dark:text-cream-200">No completions yet</p>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1 max-w-xs">
                    Mark tasks completed to trace your upward progress velocity curve.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-cream-200 dark:border-charcoal-750 flex items-center justify-between text-xs text-charcoal-500 dark:text-charcoal-400">
              <span>Velocity Curve</span>
              <span className="text-lime-600 dark:text-lime-400 font-semibold">Recharts Area</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductivityView;
