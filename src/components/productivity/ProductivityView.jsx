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
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1">
        {label && <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>}
        {payload.map((entry, idx) => (
          <p key={idx} className="flex items-center gap-2 font-mono" style={{ color: entry.color || entry.fill }}>
            <span>{entry.name}:</span>
            <span className="font-bold text-white">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProductivityView = () => {
  const { stats, setActiveTab } = useTask();

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
    humorMessage,
    chartData,
    recommendedTask,
  } = stats;

  const { completedVsPending, category, weekly, trend } = chartData || {};

  // Procrastination Rating level
  const getProcrastinationLevel = (score) => {
    if (score >= 70) return { label: 'High Delay Alert', color: 'text-rose-400', badge: 'bg-rose-500/15 border-rose-500/30 text-rose-300' };
    if (score >= 40) return { label: 'Moderate Procrastination', color: 'text-amber-400', badge: 'bg-amber-500/15 border-amber-500/30 text-amber-300' };
    if (score > 0) return { label: 'Active Control', color: 'text-indigo-400', badge: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300' };
    return { label: 'Procrastination Free', color: 'text-emerald-400', badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' };
  };

  const procLevel = getProcrastinationLevel(procrastinationScore);

  return (
    <div className="space-y-6">
      {/* 1. Contextual Humour & Motivation Banner */}
      {humorMessage && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 p-5 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 mt-0.5">
                <Smile className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                    {humorMessage.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Procrastination Score: {procrastinationScore}/100
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-100 italic">
                  "{humorMessage.message}"
                </p>
              </div>
            </div>

            <Button
              variant="outline"
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
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Total Tasks</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-white">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {totalEstimatedHours} hrs total
          </div>
        </Card>

        {/* Completed Tasks */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
            {completed}
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-0.5 font-medium">
            {completionRate}% finished
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-indigo-300">
            {pending}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {pendingHours} hrs in queue
          </div>
        </Card>

        {/* Overdue Tasks */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-rose-400">
            {overdue}
          </div>
          <div className={`text-[11px] mt-0.5 ${overdue > 0 ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
            {overdue > 0 ? 'Urgent attention' : 'Zero slips'}
          </div>
        </Card>

        {/* Postponed Tasks */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Postponed</span>
            <Hourglass className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-300">
            {postponed}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            "Kal Se Pakka" calls
          </div>
        </Card>

        {/* Procrastination Score */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Procrastination</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-purple-300">
            {procrastinationScore}
            <span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
          <div className={`text-[10px] mt-0.5 font-bold uppercase ${procLevel.color}`}>
            {procLevel.label}
          </div>
        </Card>
      </div>

      {/* 3. Next Recommended Task Highlight from Max Heap */}
      {recommendedTask && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Max Heap Top Priority
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                ⚡ Priority Score: {recommendedTask.priority?.toFixed(1) || '0.0'}
              </span>
            </div>
            <h4 className="text-base font-bold text-white">
              {recommendedTask.title}
            </h4>
            <p className="text-xs text-slate-300">
              Deadline: <span className="font-mono text-indigo-300">{formatDate(recommendedTask.deadline)}</span> • Estimated Effort: <span className="font-mono text-purple-300">{recommendedTask.duration} hrs</span>
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
              <div className="pb-3 border-b border-slate-800 mb-4">
                <h3 className="font-bold text-white text-base">Task Status Breakdown</h3>
                <p className="text-xs text-slate-400">Completed vs Pending vs Overdue</p>
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
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Inbox className="w-10 h-10 text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No task records</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Create tasks to generate real-time status telemetry.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Completion Velocity: {completionRate}%</span>
              <span className="text-indigo-400 font-medium">Live Recharts Pie</span>
            </div>
          </Card>
        </div>

        {/* Chart 2: Tasks by Category */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-800 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Tasks by Academic Category</h3>
                  <p className="text-xs text-slate-400">Completed vs Pending per domain</p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {category?.length || 0} active categories
                </span>
              </div>

              {category && category.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={category} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="category" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" name="Pending" fill="#6366F1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="overdue" name="Overdue" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Inbox className="w-10 h-10 text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No category data</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Assign categories (Assignment, Project, Exam) to compare workload.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Categorical Distribution</span>
              <span className="text-purple-400 font-medium">Recharts Grouped Bar</span>
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
              <div className="pb-3 border-b border-slate-800 mb-4">
                <h3 className="font-bold text-white text-base">Weekly Productivity (Past 7 Days)</h3>
                <p className="text-xs text-slate-400">Planned deadlines vs Actual completed tasks</p>
              </div>

              {weekly && weekly.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="planned" name="Planned / Due" fill="#334155" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" name="Completed" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Calendar className="w-10 h-10 text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No weekly activity</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>7-Day Productivity Window</span>
              <span className="text-indigo-400 font-medium">Recharts Bar</span>
            </div>
          </Card>
        </div>

        {/* Chart 4: Task Completion Trend (Area) */}
        <div className="lg:col-span-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-800 mb-4">
                <h3 className="font-bold text-white text-base">Cumulative Completion Trend</h3>
                <p className="text-xs text-slate-400">Growth of completed tasks over time</p>
              </div>

              {trend && trend.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="completions"
                        name="Completed Tasks"
                        stroke="#10B981"
                        strokeWidth={2.5}
                        fill="url(#trendGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Inbox className="w-10 h-10 text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No completions yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Mark tasks completed to trace your upward progress velocity curve.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Velocity Curve</span>
              <span className="text-emerald-400 font-medium">Recharts Area</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductivityView;
