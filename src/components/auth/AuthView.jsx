/**
 * AuthView.jsx
 * 
 * Playful Gen-Z Authentication Screens for KAL SE PAKKA.
 * Supports:
 *  - Real Supabase Email/Password Login
 *  - Full Registration (Full Name, Email, Password, Confirm Password)
 *  - Password Reset / Forgot Password
 *  - Theme Toggle (Cream Light / Charcoal Dark)
 *  - Smooth navigation back to Landing Page
 */

import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  Loader2,
  Sun,
  Moon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';

const AuthView = ({ initialMode = 'login', onBackToLanding }) => {
  const { login, signup, resetPassword, isConfigured } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Mode: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState(initialMode);

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

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Validation
  const validateForm = () => {
    setErrorMsg('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid college or personal email address.');
      return false;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name, bestie.');
        return false;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Double-check and try again!');
        return false;
      }
    }

    if (mode === 'login' && !password) {
      setErrorMsg('Please enter your password.');
      return false;
    }

    return true;
  };

  // Submit handler
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
          const rawErr = result.error?.message || '';
          if (rawErr.toLowerCase().includes('invalid login credentials')) {
            setErrorMsg('Invalid email or password. Check for typos!');
          } else if (rawErr.toLowerCase().includes('email not confirmed')) {
            setErrorMsg('Email not verified yet. Check your inbox for the Supabase confirmation link!');
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
            setErrorMsg('An account with this email already exists. Try logging in!');
          } else {
            setErrorMsg(rawErr || 'Failed to create account.');
          }
        } else {
          if (result.isEmailConfirmationRequired) {
            setSuccessMsg(
              'Account created! A confirmation link was sent to your email. Verify it and then log in.'
            );
            setTimeout(() => setMode('login'), 3500);
          } else {
            setSuccessMsg('Account created successfully! Logging you in...');
          }
        }
      } else if (mode === 'forgot') {
        const result = await resetPassword(email.trim());
        if (!result.success) {
          setErrorMsg(result.error?.message || 'Failed to dispatch password reset email.');
        } else {
          setSuccessMsg(
            'Password reset instructions sent! Check your inbox and spam folder.'
          );
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative transition-colors duration-200">
      
      {/* Top Controls: Back button & Theme Toggle */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6 z-10">
        {onBackToLanding ? (
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-600 dark:text-cream-200 hover:text-coral-500 dark:hover:text-coral-400 transition-colors p-2 rounded-xl bg-white/70 dark:bg-charcoal-850/70 border border-cream-300 dark:border-charcoal-750 cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-cream-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-charcoal-700 dark:text-cream-100 hover:border-coral-500 transition-all cursor-pointer shadow-sm"
          title={isDark ? 'Switch to Warm Cream Light Mode' : 'Switch to Dark Charcoal Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-charcoal-700" />}
        </button>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Brand Narrative & Key Highlights */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-coral-500 flex items-center justify-center text-white font-black text-2xl shadow-coral-glow">
                <span>⏳</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-2xl font-black text-charcoal-950 dark:text-white tracking-tight">
                    KAL SE PAKKA
                  </h1>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-lime-400 text-charcoal-950 shadow-sm">
                    DSA PRO
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">
                  Smart Procrastination & Task Management
                </p>
              </div>
            </div>

            <p className="text-sm text-charcoal-600 dark:text-charcoal-300 font-medium leading-relaxed mt-2">
              Say goodbye to endless delay cycles. Schedule tasks with a real binary Max Heap, dynamic delay penalties, and Supabase cloud persistence.
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 shadow-sm">
              <div className="p-2 rounded-xl bg-coral-500/10 text-coral-500 shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-charcoal-950 dark:text-white">
                  Custom Max Heap Priority Engine
                </h4>
                <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                  Dynamically balances <code className="text-coral-500 font-bold font-mono">Urgency</code>, <code className="text-amber-500 font-bold font-mono">Importance</code>, and <code className="text-lime-600 dark:text-lime-400 font-bold font-mono">Effort</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 shadow-sm">
              <div className="p-2 rounded-xl bg-lime-400/20 text-lime-800 dark:text-lime-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-charcoal-950 dark:text-white">
                  Mathematical Procrastination Score
                </h4>
                <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                  Tracks overdue backlog and delay taxes with real telemetry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-charcoal-850 border border-cream-200 dark:border-charcoal-750 shadow-sm">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-charcoal-950 dark:text-white">
                  Cloud Persistent Sessions
                </h4>
                <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                  Encrypted tokens and Row-Level Security guarantee user privacy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-7">
          <div className="w-full max-w-md mx-auto bg-white dark:bg-charcoal-850 border border-cream-300 dark:border-charcoal-750 rounded-3xl p-6 sm:p-8 shadow-elevated">
            
            {/* Header & Tabs */}
            <div className="mb-6">
              {mode === 'forgot' ? (
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => switchMode('login')}
                    className="p-1 rounded-lg text-charcoal-500 hover:text-charcoal-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-black text-charcoal-950 dark:text-white tracking-tight">
                    Reset Password
                  </h2>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4 border-b border-cream-200 dark:border-charcoal-800 pb-3">
                  <div>
                    <h2 className="text-xl font-black text-charcoal-950 dark:text-white tracking-tight">
                      {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
                    </h2>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                      {mode === 'login'
                        ? 'Sign in to access your priority queue'
                        : 'Ready to beat procrastination for good?'}
                    </p>
                  </div>

                  <div className="flex bg-cream-200 dark:bg-charcoal-800 p-1 rounded-xl border border-cream-300 dark:border-charcoal-700">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        mode === 'login'
                          ? 'bg-coral-500 text-white shadow-sm'
                          : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-950 dark:hover:text-white'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        mode === 'signup'
                          ? 'bg-coral-500 text-white shadow-sm'
                          : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-950 dark:hover:text-white'
                      }`}
                    >
                      Signup
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-fade-in font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2 animate-fade-in font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 dark:text-cream-200 mb-1.5">
                    Full Name <span className="text-coral-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Aryan Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal-950 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 dark:text-cream-200 mb-1.5">
                  Email Address <span className="text-coral-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal-950 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-charcoal-700 dark:text-cream-200">
                      Password <span className="text-coral-500">*</span>
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-[11px] text-coral-600 dark:text-coral-400 hover:underline font-bold transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      className="w-full bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-charcoal-950 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-cream-200 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 dark:text-cream-200 mb-1.5">
                    Confirm Password <span className="text-coral-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="w-full bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-charcoal-950 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-cream-200 transition-colors cursor-pointer"
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
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-black text-xs shadow-coral-glow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
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
                          ? 'Create Free Account'
                          : 'Send Password Reset Link'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom switcher */}
            <div className="mt-6 pt-4 border-t border-cream-200 dark:border-charcoal-800 text-center">
              {mode === 'login' && (
                <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
                  Don't have an account yet?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-coral-500 hover:underline font-extrabold transition-colors cursor-pointer"
                  >
                    Sign up now
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
                  Already registered?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="text-coral-500 hover:underline font-extrabold transition-colors cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}

              {mode === 'forgot' && (
                <button
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal-600 dark:text-charcoal-300 hover:text-coral-500 font-bold transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-charcoal-500 dark:text-charcoal-400 z-10">
        KAL SE PAKKA • Powered by React, Vite, Tailwind & Supabase
      </div>
    </div>
  );
};

export default AuthView;
