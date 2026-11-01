/**
 * AuthView.jsx
 * 
 * Authentication interface for KAL SE PAKKA.
 * Supports:
 *  - Email & Password Login
 *  - Full Registration (Full Name, Email, Password, Confirm Password)
 *  - Forgot Password / Password Reset
 * 
 * Styled with KAL SE PAKKA's dark SaaS theme (navy/charcoal, indigo & purple accents).
 */

import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const AuthView = () => {
  const { login, signup, resetPassword, isConfigured } = useAuth();

  // Mode: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('login');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset notifications on tab switch
  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Form Validation
  const validateForm = () => {
    setErrorMsg('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return false;
      }
    }

    if (mode === 'login' && !password) {
      setErrorMsg('Please enter your password.');
      return false;
    }

    return true;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const result = await login(email.trim(), password);
        if (!result.success) {
          // Format common Supabase error messages
          const rawErr = result.error?.message || '';
          if (rawErr.toLowerCase().includes('invalid login credentials')) {
            setErrorMsg('Invalid email or password. Please verify and try again.');
          } else if (rawErr.toLowerCase().includes('email not confirmed')) {
            setErrorMsg('Email address not yet confirmed. Please check your inbox for the confirmation link.');
          } else {
            setErrorMsg(rawErr || 'Failed to sign in. Please try again.');
          }
        }
      } else if (mode === 'signup') {
        const result = await signup({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
        });

        if (!result.success) {
          const rawErr = result.error?.message || '';
          if (rawErr.toLowerCase().includes('already registered')) {
            setErrorMsg('An account with this email already exists. Please log in.');
          } else {
            setErrorMsg(rawErr || 'Failed to create account.');
          }
        } else {
          if (result.isEmailConfirmationRequired) {
            setSuccessMsg(
              'Account created! A confirmation email has been sent. Please verify your email before logging in.'
            );
            // Switch to login tab after brief pause
            setTimeout(() => setMode('login'), 4000);
          } else {
            setSuccessMsg('Account created successfully! Logging you in...');
          }
        }
      } else if (mode === 'forgot') {
        const result = await resetPassword(email.trim());
        if (!result.success) {
          setErrorMsg(result.error?.message || 'Failed to send password reset email.');
        } else {
          setSuccessMsg(
            'Password reset link has been sent to your email! Please check your inbox and spam folder.'
          );
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Brand Narrative & DSA Project Highlights */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          {/* Logo & Project Title */}
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 flex items-center justify-center shadow-xl shadow-indigo-600/30 text-white font-black text-2xl">
                <span>⏳</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    KAL SE PAKKA
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    DSA Pro
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Smart Procrastination & Task Management System
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mt-4">
              Stop deferring your academic milestones to tomorrow. Powered by real data structures, 
              custom Max-Heaps, and mathematical delay penalties to help students overcome procrastination.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Custom Max-Heap Priority Queue</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dynamic priority calculation: <code className="text-indigo-300">0.5×Urgency + 0.3×Importance + 0.2×Effort</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Algorithmic Procrastination Score</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Measures your delay habits with mathematical precision, tracking overdue and postponed tasks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white">Cloud Authentication & Persistent Session</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Secure email/password authentication powered by Supabase with persistent auth tokens.
                </p>
              </div>
            </div>
          </div>

          {/* College Project Tag */}
          <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>College DSA Mini Project • Sem 5 CSE Edition</span>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-7">
          <div className="w-full max-w-md mx-auto bg-dark-950/85 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
            
            {/* Header / Tabs */}
            <div className="mb-6">
              {mode === 'forgot' ? (
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => switchMode('login')}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {mode === 'login'
                        ? 'Sign in to access your priority queue & tasks'
                        : 'Start tracking tasks and beating procrastination'}
                    </p>
                  </div>

                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                        mode === 'login'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                        mode === 'signup'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Signup
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Supabase unconfigured warning banner (safeguard) */}
            {!isConfigured && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Notice:</span> Supabase environment variables are missing in <code>.env</code>. Please configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Aryan Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Password Input (Login & Signup) */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Password <span className="text-red-400">*</span>
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {mode === 'login'
                          ? 'Signing in...'
                          : mode === 'signup'
                          ? 'Creating account...'
                          : 'Sending reset link...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {mode === 'login'
                          ? 'Sign In to Dashboard'
                          : mode === 'signup'
                          ? 'Create Account'
                          : 'Send Password Reset Link'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer switcher */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              {mode === 'login' && (
                <p className="text-xs text-slate-400">
                  Don't have an account yet?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Sign up now
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p className="text-xs text-slate-400">
                  Already registered?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              )}

              {mode === 'forgot' && (
                <button
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Footer disclaimer */}
      <div className="mt-8 text-center text-xs text-slate-500 z-10">
        KAL SE PAKKA – Smart Procrastination & Task Management System • Built with React, Tailwind & Supabase
      </div>
    </div>
  );
};

export default AuthView;

