import React, { useState, useEffect } from 'react';
import {
  X,
  Edit3,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  FolderGit2,
  GraduationCap,
  User,
  MoreHorizontal,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Button from './Button';

const EditTaskModal = () => {
  const { editModalTask, setEditModalTask, updateTask, tasks } = useTask();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Assignment',
    deadline: '',
    importance: 'Medium',
    duration: 2.0,
    status: 'Pending',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when editModalTask changes
  useEffect(() => {
    if (editModalTask) {
      setFormData({
        title: editModalTask.title || '',
        description: editModalTask.description || '',
        category: editModalTask.category || 'Assignment',
        deadline: editModalTask.deadline ? editModalTask.deadline.slice(0, 16) : '',
        importance: editModalTask.importance || 'Medium',
        duration: editModalTask.duration !== undefined ? editModalTask.duration : 2.0,
        status: editModalTask.status || 'Pending',
        notes: editModalTask.notes || '',
      });
      setErrors({});
    }
  }, [editModalTask]);

  if (!editModalTask) return null;

  const categories = [
    { id: 'Assignment', label: 'Assignment', icon: BookOpen },
    { id: 'Project', label: 'Project', icon: FolderGit2 },
    { id: 'Exam', label: 'Exam', icon: GraduationCap },
    { id: 'Personal', label: 'Personal', icon: User },
    { id: 'Other', label: 'Other', icon: MoreHorizontal },
  ];

  const importanceLevels = [
    { id: 'Low', label: 'Low', color: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10' },
    { id: 'Medium', label: 'Medium', color: 'border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10' },
    { id: 'High', label: 'High', color: 'border-rose-500/40 text-rose-700 dark:text-rose-300 bg-rose-500/10' },
  ];

  const statuses = ['Pending', 'In Progress', 'Completed', 'Overdue'];

  const validate = () => {
    const newErrors = {};
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      newErrors.title = 'Task title is mandatory';
    } else if (trimmedTitle.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else {
      // Duplicate title check (excluding current task being edited)
      const duplicate = tasks.find(
        t => t.id !== editModalTask.id &&
             t.status !== 'Completed' &&
             t.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
      );
      if (duplicate) {
        newErrors.title = 'Another pending task with this title already exists';
      }
    }

    if (!formData.deadline) {
      newErrors.deadline = 'A valid deadline date and time is required';
    } else {
      const d = new Date(formData.deadline);
      if (isNaN(d.getTime())) {
        newErrors.deadline = 'Invalid date format';
      }
    }

    const durationNum = parseFloat(formData.duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      newErrors.duration = 'Estimated duration must be greater than 0 hours';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    await updateTask(editModalTask.id, {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      deadline: formData.deadline,
      importance: formData.importance,
      duration: parseFloat(formData.duration),
      status: formData.status,
      notes: formData.notes.trim(),
    });

    setIsSubmitting(false);
    setEditModalTask(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-cream-50 dark:bg-charcoal-850 border border-cream-300 dark:border-charcoal-750 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 dark:border-charcoal-750 bg-cream-100/60 dark:bg-charcoal-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-coral-500/15 text-coral-500 border border-coral-500/25">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal-900 dark:text-cream-100 text-lg">Edit Task Details</h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Updates recalculate Max Heap priority automatically</p>
            </div>
          </div>
          <button
            onClick={() => setEditModalTask(null)}
            className="p-1.5 rounded-lg text-charcoal-400 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
              Task Title <span className="text-coral-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              className={`w-full bg-white dark:bg-charcoal-900 border rounded-xl px-3.5 py-2.5 text-sm text-charcoal-900 dark:text-cream-100 focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-500 focus:ring-rose-500/40'
                  : 'border-cream-300 dark:border-charcoal-700 focus:ring-coral-500/40 focus:border-coral-500'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-coral-500 bg-coral-500/15 text-coral-600 dark:text-coral-300 shadow-sm font-bold'
                        : 'border-cream-300 dark:border-charcoal-700 bg-white/70 dark:bg-charcoal-800/60 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-500/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-1" />
                    <span className="text-[11px] font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deadline & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
                Deadline <span className="text-coral-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => {
                  setFormData({ ...formData, deadline: e.target.value });
                  if (errors.deadline) setErrors({ ...errors, deadline: null });
                }}
                className={`w-full bg-white dark:bg-charcoal-900 border rounded-xl px-3 py-2 text-xs font-mono text-charcoal-900 dark:text-cream-100 focus:outline-none focus:ring-2 ${
                  errors.deadline
                    ? 'border-rose-500 focus:ring-rose-500/40'
                    : 'border-cream-300 dark:border-charcoal-700 focus:ring-coral-500/40 focus:border-coral-500'
                }`}
              />
              {errors.deadline && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.deadline}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
                Duration (Hours) <span className="text-coral-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.25"
                max="40"
                value={formData.duration}
                onChange={(e) => {
                  setFormData({ ...formData, duration: e.target.value });
                  if (errors.duration) setErrors({ ...errors, duration: null });
                }}
                className={`w-full bg-white dark:bg-charcoal-900 border rounded-xl px-3 py-2 text-xs font-mono text-charcoal-900 dark:text-cream-100 focus:outline-none focus:ring-2 ${
                  errors.duration
                    ? 'border-rose-500 focus:ring-rose-500/40'
                    : 'border-cream-300 dark:border-charcoal-700 focus:ring-coral-500/40 focus:border-coral-500'
                }`}
              />
              {errors.duration && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Importance & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
                Importance Level
              </label>
              <div className="flex gap-2">
                {importanceLevels.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, importance: lvl.id })}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      formData.importance === lvl.id
                        ? `${lvl.color} ring-1 ring-current`
                        : 'border-cream-300 dark:border-charcoal-700 bg-white/70 dark:bg-charcoal-800/60 text-charcoal-600 dark:text-charcoal-400 hover:border-coral-500/30'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-white dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-charcoal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500"
              >
                {statuses.map((st) => (
                  <option key={st} value={st} className="bg-white dark:bg-charcoal-900">
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
              Notes / Reminders
            </label>
            <input
              type="text"
              placeholder="e.g. Discuss with lab partner first"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-white dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200 dark:border-charcoal-750">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setEditModalTask(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
