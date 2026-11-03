/**
 * LandingPage.jsx
 * 
 * Playful Gen-Z Public Landing Page for KAL SE PAKKA.
 * Features:
 *  - Bold editorial hero typography
 *  - Live interactive dashboard visual preview
 *  - Smart Max Heap Priority Queue explanation (DSA engine)
 *  - "The Wall of Excuses" (Humorous procrastination hall of fame)
 *  - Light (Warm Cream) and Dark (Charcoal) theme toggle
 *  - Direct CTAs to Login and Signup
 */

import React from 'react';
import {
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Flame,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Sun,
  Moon,
  Binary,
  Code2,
  Rocket,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const LandingPage = ({ onOpenAuth }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { loginAsGuest } = useAuth();

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 transition-colors duration-200">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-cream-100/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-cream-300/80 dark:border-charcoal-800 px-4 sm:px-8 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white font-black text-xl shadow-coral-glow">
              <span>⏳</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-charcoal-950 dark:text-white">
                  KAL SE PAKKA
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-lime-400 text-charcoal-950 shadow-sm">
                  DSA PRO
                </span>
              </div>
              <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-medium hidden sm:block">
                Smart Procrastination & Priority Queue
              </p>
            </div>
          </div>

          {/* Right Nav Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-cream-100 hover:border-coral-500 transition-all cursor-pointer shadow-sm"
              title={isDark ? 'Switch to Warm Cream Light Mode' : 'Switch to Dark Charcoal Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-charcoal-700" />}
            </button>

            {/* Instant Demo CTA */}
            <button
              onClick={() => loginAsGuest('College Scholar')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-coral-600 dark:text-coral-400 hover:underline px-3 py-2 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Instant Demo</span>
            </button>

            {/* Login CTA */}
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs sm:text-sm font-bold text-charcoal-700 dark:text-cream-200 hover:text-coral-500 dark:hover:text-coral-400 px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            {/* Get Started Coral Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenAuth('signup')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-16 max-w-6xl mx-auto text-center">
        {/* Playful Eyebrow pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-500/10 border border-coral-500/25 text-coral-600 dark:text-coral-400 text-xs font-bold mb-6 animate-fade-in shadow-sm">
          <Flame className="w-4 h-4 text-coral-500 animate-bounce" />
          <span>DSA-POWERED ANTI-PROCRASTINATION ENGINE</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-charcoal-950 dark:text-white max-w-4xl mx-auto">
          Your deadlines aren't going to <span className="text-coral-500 underline decoration-lime-400 decoration-wavy decoration-4">chase themselves</span>.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-charcoal-600 dark:text-charcoal-300 font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
          Stop romanticizing tomorrow. Start getting things done today. Powered by a Custom Max Heap that schedules tasks based on urgency, importance, and effort.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onOpenAuth('signup')}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto shadow-coral-glow"
          >
            Start Conquering Tasks • Free
          </Button>

          <Button
            variant="lime"
            size="lg"
            onClick={() => loginAsGuest('College Scholar')}
            icon={Rocket}
            iconPosition="left"
            className="w-full sm:w-auto shadow-lime-glow"
          >
            Instant Demo Access
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto"
          >
            Sign In with Supabase
          </Button>
        </div>

        {/* Micro Credibility */}
        <div className="flex items-center justify-center gap-6 text-xs text-charcoal-500 dark:text-charcoal-400 font-semibold mt-8">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-lime-500" /> Real Supabase Auth
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-coral-500" /> Max-Heap O(log N)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero False Promises
          </span>
        </div>

        {/* 3. Product Dashboard Live Preview Mockup */}
        <div className="mt-12 sm:mt-16 p-3 sm:p-4 rounded-3xl bg-cream-200/60 dark:bg-charcoal-800/60 border border-cream-300 dark:border-charcoal-700 shadow-2xl">
          <div className="rounded-2xl bg-white dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-750 p-4 sm:p-6 text-left overflow-hidden shadow-inner">
            
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cream-200 dark:border-charcoal-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-coral-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-lime-400" />
                <span className="text-xs font-mono font-bold text-charcoal-500 dark:text-charcoal-400 ml-2">
                  kalsepakka.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-lime-400 text-charcoal-950">
                  Priority Heap: Active
                </span>
              </div>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              
              {/* Highlight Card: Highest-Priority Recommended Task */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-cream-50 dark:bg-charcoal-850 border-2 border-coral-500/40 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-coral-500 text-white">
                    🎯 Max Heap Root Recommendation
                  </span>
                  <span className="text-sm font-black text-coral-500 font-mono">
                    Priority Score: 96 / 100
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-charcoal-950 dark:text-white">
                  Operating Systems CPU Scheduler Simulation
                </h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-1">
                  Partner completed FCFS; finish Round Robin and SJF Gantt chart before midnight!
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-coral-600 dark:text-coral-400 font-mono">
                    <Clock className="w-3.5 h-3.5" /> Due in 3 hours
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-coral-500/10 text-coral-600 dark:text-coral-300 text-[11px]">
                    Assignment • High Importance
                  </span>
                </div>
              </div>

              {/* Procrastination Index Gauge Mock */}
              <div className="p-5 rounded-2xl bg-cream-50 dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-charcoal-700 dark:text-charcoal-300">
                    <TrendingUp className="w-4 h-4 text-coral-500" />
                    <span>Procrastination Index</span>
                  </div>
                  <div className="text-3xl font-black text-charcoal-950 dark:text-white mt-2 font-mono">
                    38<span className="text-sm font-medium text-charcoal-400">/100</span>
                  </div>
                  <div className="text-[11px] font-bold text-lime-600 dark:text-lime-400 mt-1">
                    🟢 Mild Procrastination • Manageable
                  </div>
                </div>
                <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 italic mt-3 pt-3 border-t border-cream-200 dark:border-charcoal-800">
                  "ATE AND LEFT NO CRUMBS. 💅 3 tasks completed today."
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. Smart Max Heap Priority Engine Explanation */}
      <section className="px-4 sm:px-8 py-16 bg-white dark:bg-charcoal-850 border-y border-cream-300/80 dark:border-charcoal-800 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-coral-500">
              Data Structures in Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-charcoal-950 dark:text-white mt-2">
              Why an Array isn't enough for your chaotic schedule.
            </h2>
            <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mt-3">
              Standard to-do apps sort by created date. KAL SE PAKKA uses an actual binary Max Heap with dynamic priority calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-750">
              <div className="w-12 h-12 rounded-xl bg-coral-500/10 text-coral-500 flex items-center justify-center font-black text-lg mb-4">
                <Binary className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-charcoal-950 dark:text-white">
                The Priority Formula
              </h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-2 leading-relaxed">
                <code className="text-coral-500 font-mono font-bold">0.5×Urgency + 0.3×Importance + 0.2×Effort</code>
              </p>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-2">
                Closer deadlines automatically bubble tasks up to the root of the heap in <code className="text-lime-500 font-mono">O(log N)</code> time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-750">
              <div className="w-12 h-12 rounded-xl bg-lime-400/20 text-lime-800 dark:text-lime-400 flex items-center justify-center font-black text-lg mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-charcoal-950 dark:text-white">
                Delay & Postponement Tax
              </h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-2 leading-relaxed">
                Postponing increments <code className="font-mono text-coral-500 font-bold">postponed_count</code>.
              </p>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-2">
                Every "Kal Se Pakka" increases your algorithmic delay debt, visually confronting you with your postponement habits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-750">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-charcoal-950 dark:text-white">
                Supabase Row-Level Security
              </h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-2 leading-relaxed">
                Real database persistence with JWT auth sessions.
              </p>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-2">
                No user can ever peek at or tamper with another student's task backlog. Enforced natively in PostgreSQL.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Humorous Procrastination Section: "The Wall of Excuses" */}
      <section className="px-4 sm:px-8 py-16 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-coral-500">
            Student Reality Check
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-charcoal-950 dark:text-white mt-1">
            The "Kal Se Pakka" Hall of Fame 💀
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 mt-2">
            Recognize any of these legendary excuses? It's time to retire them.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 shadow-sm">
            <span className="text-2xl">🌅</span>
            <p className="text-xs font-bold text-charcoal-900 dark:text-cream-100 mt-2 italic leading-snug">
              "Bhai kal subah 5 baje uth ke sab nipta dunga."
            </p>
            <div className="text-[10px] text-coral-500 font-extrabold mt-3 uppercase tracking-wider">
              Outcome: Woke up at 11:30 AM
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 shadow-sm">
            <span className="text-2xl">🍿</span>
            <p className="text-xs font-bold text-charcoal-900 dark:text-cream-100 mt-2 italic leading-snug">
              "Bas ek episode dekh ke pakka assignment start karunga."
            </p>
            <div className="text-[10px] text-coral-500 font-extrabold mt-3 uppercase tracking-wider">
              Outcome: Season 3 completed
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 shadow-sm">
            <span className="text-2xl">📅</span>
            <p className="text-xs font-bold text-charcoal-900 dark:text-cream-100 mt-2 italic leading-snug">
              "Syllabus toh 2 din ka hai, weekend pe aaram se ho jayega."
            </p>
            <div className="text-[10px] text-coral-500 font-extrabold mt-3 uppercase tracking-wider">
              Outcome: Exam tomorrow morning
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 shadow-sm">
            <span className="text-2xl">🧠</span>
            <p className="text-xs font-bold text-charcoal-900 dark:text-cream-100 mt-2 italic leading-snug">
              "Abhi vibe nahi aa rahi, raat ko dimaag zyada tez chalta hai."
            </p>
            <div className="text-[10px] text-coral-500 font-extrabold mt-3 uppercase tracking-wider">
              Outcome: Asleep at 10 PM
            </div>
          </div>

        </div>
      </section>

      {/* 6. Bottom Conversion Banner */}
      <section className="px-4 sm:px-8 py-16 bg-cream-200 dark:bg-charcoal-950 border-t border-cream-300 dark:border-charcoal-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-coral-500 text-white font-black text-2xl shadow-coral-glow">
            ⏳
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-charcoal-950 dark:text-white tracking-tight">
            Ready to turn "Kal Se" into <span className="text-coral-500">"Aaj Hi"</span>?
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600 dark:text-charcoal-300 max-w-xl mx-auto">
            Join students who have stopped postponing and started executing. Free, open source, and built for college life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth('signup')}
              icon={ArrowRight}
              iconPosition="right"
              className="shadow-coral-glow w-full sm:w-auto"
            >
              Create Your Free Account Now
            </Button>
            <Button
              variant="lime"
              size="lg"
              onClick={() => loginAsGuest('College Scholar')}
              icon={Rocket}
              iconPosition="left"
              className="w-full sm:w-auto shadow-lime-glow"
            >
              Instant Demo Access
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-cream-300 dark:border-charcoal-800 px-6 py-8 text-center text-xs text-charcoal-500 dark:text-charcoal-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-charcoal-900 dark:text-white">KAL SE PAKKA</span>
            <span>• College DSA Mini Project</span>
          </div>
          <div>
            Built with React 18, Vite, Tailwind CSS, Recharts & Supabase Auth/DB
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;

