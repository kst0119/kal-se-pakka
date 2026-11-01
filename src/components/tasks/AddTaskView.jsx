import React, { useState, useMemo } from 'react';
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
  Zap,
  Flame,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { calculatePriorityScore } from '../../dsa/priorityCalculator';
import Card from '../common/Card';
import Button from '../common/Button';

const AddTaskView = () => {
  const { addTask, setActiveTab, tasks } = useTask();

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
    { id: 'Assignment', label: 'Assignment', icon: BookOpen, desc: 'Lab work & problems' },
    { id: 'Project', label: 'Project', icon: FolderGit2, desc: 'Mini-project & code' },
    { id: 'Exam', label: 'Exam', icon: GraduationCap, desc: 'Mid-term & finals' },
    { id: 'Personal', label: 'Personal', icon: User, desc: 'LeetCode & resume' },
    { id: 'Other', label: 'Other', icon: MoreHorizontal, desc: 'Miscellaneous' },
  ];

  const importanceLevels = [
    { id: 'Low', label: 'Low', desc: 'Can be done flexibly', color: 'border-lime-500/40 text-lime-800 dark:text-lime-300 bg-lime-500/10' },
    { id: 'Medium', label: 'Medium', desc: 'Standard coursework', color: 'border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10' },
    { id: 'High', label: 'High', desc: 'Urgent submission', color: 'border-coral-500/40 text-coral-600 dark:text-coral-400 bg-coral-500/10' },
  ];

  const durationPresets = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0];

  // Live Priority Score Preview (Calculated dynamically via DSA priorityCalculator)
  const previewPriority = useMemo(() => {
    try {
      const calc = calculatePriorityScore({
        deadline: formData.deadline,
        importance: formData.importance,
        duration: formData.duration || 1.0,
      });
      return calc;
    } catch (e) {
      return { priorityScore: 50, urgencyScore: 50, importanceScore: 50, effortScore: 50 };
    }
  }, [formData.deadline, formData.importance, formData.duration]);

  const validate = () => {
    const newErrors = {};
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      newErrors.title = 'Task title is mandatory';
    } else if (trimmedTitle.length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    } else {
      const duplicate = tasks.find(
        (t) => t.status !== 'Completed' && t.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
      );
      if (duplicate) {
        newErrors.title = 'A pending task with this title already exists. Please choose a distinct title.';
      }
    }

    if (!formData.deadline) {
      newErrors.deadline = 'A valid deadline date and time is mandatory';
    } else {
      const parsedDate = new Date(formData.deadline);
      if (isNaN(parsedDate.getTime())) {
        newErrors.deadline = 'Invalid date and time format';
      }
    }

    if (!['Low', 'Medium', 'High'].includes(formData.importance)) {
      newErrors.importance = 'Please select a valid importance level';
    }

    const durationNum = parseFloat(formData.duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      newErrors.duration = 'Estimated effort must be greater than 0 hours';
    } else if (durationNum > 40) {
      newErrors.duration = 'Estimated effort cannot exceed 40 hours for a single task';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
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

    const result = await addTask(newTask);

    if (!result.success) {
      setErrors({ title: result.error });
      setIsSubmitting(false);
      return;
    }

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

  const applyQuickDeadline = (hoursAhead) => {
    const d = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);
    setFormData((prev) => ({ ...prev, deadline: d.toISOString().slice(0, 16) }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-charcoal-850 rounded-3xl border border-cream-200 dark:border-charcoal-750 p-6 sm:p-8 shadow-card-light dark:shadow-card-dark transition-colors">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cream-200 dark:border-charcoal-800">
          <div className="p-2.5 rounded-2xl bg-coral-500/10 text-coral-500">
            <Flame className="w-5 h-5 text-coral-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-950 dark:text-white tracking-tight">
              Schedule New Task
            </h2>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 font-medium mt-0.5">
              The Max Heap Priority Queue will dynamically calculate urgency and schedule your task.
            </p>
          </div>
        </div>

        {/* Live Priority Calculator Preview Widget */}
        <div className="mb-6 p-4 rounded-2xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-750 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-charcoal-950 flex items-center justify-center font-black text-lg shadow-lime-glow shrink-0">
              ⚡
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-charcoal-400">
                Live Heap Priority Preview
              </div>
              <div className="text-xs font-bold text-charcoal-700 dark:text-cream-200">
                Urgency (50%) + Importance (30%) + Effort (20%)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-500 font-medium hidden sm:inline">Calculated Score:</span>
            <span className="text-base font-black px-3 py-1 rounded-full bg-coral-500 text-white font-mono shadow-sm">
              {previewPriority.priorityScore.toFixed(1)} / 100
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Task Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-2">
              Task Title <span className="text-coral-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Implement AVL Tree rotations in C++ with test cases"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              className={`w-full bg-cream-50 dark:bg-charcoal-800 border rounded-2xl px-4 py-3 text-xs sm:text-sm text-charcoal-950 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 font-medium ${
                errors.title
                  ? 'border-rose-500 focus:ring-rose-500/50'
                  : 'border-cream-300 dark:border-charcoal-700 focus:ring-coral-500/50 focus:border-coral-500'
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* 2. Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-2">
              Description <span className="text-charcoal-400 text-[11px] font-normal normal-case">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Add key requirements, instructions from professor, or test cases to cover..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-cream-50 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-charcoal-950 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/50 font-medium"
            />
          </div>

          {/* 3. Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-2.5">
              Category <span className="text-coral-500">*</span>
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
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-coral-500 bg-coral-500/10 text-coral-600 dark:text-coral-400 ring-2 ring-coral-500/30'
                        : 'border-cream-200 dark:border-charcoal-750 bg-cream-50 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-coral-500' : 'text-charcoal-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-charcoal-900 dark:text-cream-100">{cat.label}</div>
                      <div className="text-[10px] text-charcoal-400 leading-tight truncate">{cat.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Deadline with Date & Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-cream-200">
                Deadline Date & Time <span className="text-coral-500">*</span>
              </label>

              {/* Quick shortcut presets */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-charcoal-500">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(6)}
                  className="px-2 py-0.5 rounded-lg bg-cream-200 dark:bg-charcoal-800 hover:bg-cream-300 dark:hover:bg-charcoal-750 text-coral-600 dark:text-coral-400 font-bold cursor-pointer"
                >
                  +6 Hours
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(24)}
                  className="px-2 py-0.5 rounded-lg bg-cream-200 dark:bg-charcoal-800 hover:bg-cream-300 dark:hover:bg-charcoal-750 text-coral-600 dark:text-coral-400 font-bold cursor-pointer"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(72)}
                  className="px-2 py-0.5 rounded-lg bg-cream-200 dark:bg-charcoal-800 hover:bg-cream-300 dark:hover:bg-charcoal-750 text-coral-600 dark:text-coral-400 font-bold cursor-pointer"
                >
                  +3 Days
                </button>
              </div>
            </div>

            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => {
                setFormData({ ...formData, deadline: e.target.value });
                if (errors.deadline) setErrors({ ...errors, deadline: null });
              }}
              className={`w-full bg-cream-50 dark:bg-charcoal-800 border rounded-2xl px-4 py-3 text-xs sm:text-sm text-charcoal-950 dark:text-cream-50 focus:outline-none focus:ring-2 font-medium ${
                errors.deadline
                  ? 'border-rose-500 focus:ring-rose-500/50'
                  : 'border-cream-300 dark:border-charcoal-700 focus:ring-coral-500/50'
              }`}
            />
            {errors.deadline && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.deadline}
              </p>
            )}
          </div>

          {/* 5. Importance Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-2.5">
              Importance / Weightage <span className="text-coral-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {importanceLevels.map((lvl) => {
                const isSelected = formData.importance === lvl.id;

                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, importance: lvl.id })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${lvl.color} ring-2 ring-current font-bold`
                        : 'border-cream-200 dark:border-charcoal-750 bg-cream-50 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-charcoal-900 dark:text-cream-50">{lvl.label} Priority</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-400">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Estimated Duration (Hours) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-cream-200 mb-2">
              Estimated Completion Time (Hours) <span className="text-coral-500">*</span>
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
                  className={`w-full bg-cream-50 dark:bg-charcoal-800 border rounded-2xl px-4 py-3 text-sm font-mono font-bold text-charcoal-950 dark:text-cream-50 focus:outline-none focus:ring-2 ${
                    errors.duration
                      ? 'border-rose-500 focus:ring-rose-500/50'
                      : 'border-cream-300 dark:border-charcoal-700 focus:ring-coral-500/50'
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-400">
                  hrs
                </span>
              </div>

              {/* Quick selector pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-charcoal-400 mr-1">Quick:</span>
                {durationPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: preset })}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      formData.duration === preset
                        ? 'bg-coral-500 border-coral-500 text-white shadow-sm'
                        : 'bg-cream-100 dark:bg-charcoal-800 border-cream-300 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-400'
                    }`}
                  >
                    {preset}h
                  </button>
                ))}
              </div>
            </div>
            {errors.duration && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.duration}
              </p>
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-cream-200 dark:border-charcoal-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-500 hover:text-charcoal-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
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
                className="shadow-coral-glow"
              >
                {isSubmitting ? 'Scheduling in Cloud...' : 'Schedule Task'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskView;
