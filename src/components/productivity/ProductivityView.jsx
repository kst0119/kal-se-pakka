import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Code2,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';

const ProductivityView = () => {
  const { stats, tasks } = useTask();

  // Weekly data mockup for placeholder chart
  const weeklyData = [
    { day: 'Mon', completed: 4, planned: 5, hours: 6.5 },
    { day: 'Tue', completed: 3, planned: 3, hours: 4.0 },
    { day: 'Wed', completed: 5, planned: 6, hours: 7.5 },
    { day: 'Thu', completed: 2, planned: 4, hours: 3.5 },
    { day: 'Fri', completed: 4, planned: 4, hours: 5.0 },
    { day: 'Sat', completed: 1, planned: 3, hours: 2.0 },
    { day: 'Sun', completed: 3, planned: 4, hours: 4.5 },
  ];

  // Category distribution calculation
  const categoryCounts = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const total = tasks.length || 1;

  const categoryBreakdown = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    count,
    percent: Math.round((count / total) * 100),
  }));

  const maxWeekly = Math.max(...weeklyData.map(d => Math.max(d.completed, d.planned)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Productivity Intelligence Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Focus & Procrastination Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time analytics evaluating submission velocity, deadline buffer compliance, and task execution throughput.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Streak</div>
              <div className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
                4 Days
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Adherence</div>
              <div className="text-xl font-black text-emerald-400">
                {stats.completionRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Completed Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-white">
            {stats.completionRate}%
          </div>
          <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12% vs last week</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Procrastination Score</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-300">
            {stats.overdue > 0 ? 'Elevated' : 'Low'}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {stats.overdue} slipped deadline{stats.overdue === 1 ? '' : 's'}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Study Hours</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-white">
            28.5 hrs
          </div>
          <div className="mt-1 text-xs text-indigo-400 flex items-center gap-1">
            <span>Logged across 8 modules</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Scheduler Efficiency</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-white">
            92.4%
          </div>
          <div className="mt-1 text-xs text-purple-400">
            DSA Priority Engine v1
          </div>
        </Card>
      </div>

      {/* Main Charts Placeholder Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Completion Bar Chart Placeholder */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-2">
                <div>
                  <h3 className="font-bold text-white text-base">Weekly Task Throughput (Placeholder)</h3>
                  <p className="text-xs text-slate-400">Planned vs Completed Tasks per day</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-slate-300">Planned</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-slate-300">Completed</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2">
                {weeklyData.map((d, i) => {
                  const plannedHeight = (d.planned / maxWeekly) * 100;
                  const completedHeight = (d.completed / maxWeekly) * 100;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        {d.completed}/{d.planned}
                      </div>

                      <div className="w-full flex items-end justify-center gap-1.5 h-44">
                        {/* Planned bar */}
                        <div
                          style={{ height: `${plannedHeight}%` }}
                          className="w-1/2 bg-slate-700/60 rounded-t-md transition-all duration-300 group-hover:bg-indigo-500/40"
                          title={`Planned: ${d.planned}`}
                        />
                        {/* Completed bar */}
                        <div
                          style={{ height: `${completedHeight}%` }}
                          className="w-1/2 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-sm"
                          title={`Completed: ${d.completed}`}
                        />
                      </div>

                      <span className="text-xs font-semibold text-slate-400 mt-1">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Average 3.2 tasks completed per day</span>
              <span className="text-indigo-400 font-medium">Chart visualization preview</span>
            </div>
          </Card>
        </div>

        {/* Category Breakdown & Allocation */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-800 mb-4">
                <h3 className="font-bold text-white text-base">Category Distribution</h3>
                <p className="text-xs text-slate-400">Active coursework distribution</p>
              </div>

              <div className="space-y-4">
                {categoryBreakdown.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{item.name}</span>
                      <span className="font-mono text-slate-400">{item.count} tasks ({item.percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${item.percent}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Workload Balance
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Assignments form the highest bulk of your schedule. Focus early morning blocks for heavy project work.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* College DSA Mini Project Architecture Placeholder Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Upcoming DSA Algorithmic Engine Roadmap (Phase 2 Preview)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Mini Project Architecture
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This frontend foundation connects directly to the core Data Structures & Algorithms being implemented for this college project:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-semibold text-indigo-300">1. Priority Queue (Min-Heap)</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Extracts highest urgency task in O(log N) time based on dynamic weights.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-semibold text-purple-300">2. Greedy Interval Scheduling</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Maximizes completed assignments within available daily free study slots.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-semibold text-sky-300">3. Dynamic Procrastination Index</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Evaluates delay patterns and triggers adaptive reminders before deadlines hit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityView;

