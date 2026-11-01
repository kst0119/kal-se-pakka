import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  FileText,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  FolderGit2,
  GraduationCap,
  User,
  MoreHorizontal,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';
import Button from '../common/Button';

const AddTaskView = () => {
  const { addTask, setActiveTab } = useTask();

  // Helper to format ISO datetime for input (default tomorrow at 18:00)
  const getDefaultDeadline = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Assignment',
    deadline: getDefaultDeadline(),
    importance: 'Medium',
    duration: 2.0,
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'Assignment', label: 'Assignment', icon: BookOpen, desc: 'Lab work, Problem sets' },
    { id: 'Project', label: 'Project', icon: FolderGit2, desc: 'Mini-project, Codebase' },
    { id: 'Exam', label: 'Exam', icon: GraduationCap, desc: 'Mid-term, Final exam revision' },
    { id: 'Personal', label: 'Personal', icon: User, desc: 'LeetCode, Resume, Skills' },
    { id: 'Other', label: 'Other', icon: MoreHorizontal, desc: 'Registration, Miscellaneous' },
  ];

  const importanceLevels = [
    { id: 'Low', label: 'Low', desc: 'Can be done flexibly', color: 'border-sky-500/40 text-sky-300 bg-sky-500/10' },
    { id: 'Medium', label: 'Medium', desc: 'Standard coursework deadline', color: 'border-amber-500/40 text-amber-300 bg-amber-500/10' },
    { id: 'High', label: 'High', desc: 'Urgent submission or heavy weightage', color: 'border-rose-500/40 text-rose-300 bg-rose-500/10' },
  ];

  const durationPresets = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Please choose a deadline date and time';
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Estimated time must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newTask = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      deadline: formData.deadline,
      importance: formData.importance,
      duration: parseFloat(formData.duration),
      notes: formData.notes.trim(),
    };

    addTask(newTask);

    // Navigate to tasks view
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveTab('tasks');
    }, 300);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Assignment',
      deadline: getDefaultDeadline(),
      importance: 'Medium',
      duration: 2.0,
      notes: '',
    });
    setErrors({});
  };

  // Quick preset deadline setter
  const applyQuickDeadline = (hoursAhead) => {
    const d = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);
    setFormData(prev => ({ ...prev, deadline: d.toISOString().slice(0, 16) }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-purple-950/20 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Create New Task</h2>
            <p className="text-xs text-slate-400">
              Schedule academic assignments and goals. The scheduler prioritizes them against your deadlines.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* 1. Task Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Implement Dijkstra's Algorithm in C++ with priority queue"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              className={`w-full bg-slate-800/80 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-500/80 focus:ring-rose-500/50'
                  : 'border-slate-700/80 focus:ring-indigo-500/50 focus:border-indigo-500/50'
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* 2. Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Description <span className="text-slate-500 text-[11px] font-normal normal-case">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Add key requirements, instructions from professor, or test cases to cover..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* 3. Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Category <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500/50'
                        : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{cat.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight truncate">{cat.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Deadline with Date & Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Deadline Date & Time <span className="text-rose-400">*</span>
              </label>

              {/* Quick shortcut presets */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(6)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300"
                >
                  +6 Hours
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(24)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(72)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300"
                >
                  +3 Days
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => {
                  setFormData({ ...formData, deadline: e.target.value });
                  if (errors.deadline) setErrors({ ...errors, deadline: null });
                }}
                className={`w-full bg-slate-800/80 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                  errors.deadline
                    ? 'border-rose-500/80 focus:ring-rose-500/50'
                    : 'border-slate-700/80 focus:ring-indigo-500/50'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.deadline}
              </p>
            )}
          </div>

          {/* 5. Importance Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Importance / Priority Level <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {importanceLevels.map((lvl) => {
                const isSelected = formData.importance === lvl.id;

                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, importance: lvl.id })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `${lvl.color} ring-1 ring-current`
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-200">{lvl.label} Priority</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <p className="text-xs text-slate-400">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Estimated Completion Time (Hours) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Estimated Completion Time (Hours) <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative w-full sm:w-44">
                <input
                  type="number"
                  step="0.5"
                  min="0.25"
                  max="40"
                  value={formData.duration}
                  onChange={(e) => {
                    setFormData({ ...formData, duration: parseFloat(e.target.value) || '' });
                    if (errors.duration) setErrors({ ...errors, duration: null });
                  }}
                  className={`w-full bg-slate-800/80 border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 ${
                    errors.duration
                      ? 'border-rose-500/80 focus:ring-rose-500/50'
                      : 'border-slate-700/80 focus:ring-indigo-500/50'
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  hrs
                </span>
              </div>

              {/* Quick selector pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 mr-1">Quick:</span>
                {durationPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: preset })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                      formData.duration === preset
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800/70 border-slate-700/70 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset}h
                  </button>
                ))}
              </div>
            </div>
            {errors.duration && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.duration}
              </p>
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Form
            </button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setActiveTab('tasks')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Schedule Task'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskView;

