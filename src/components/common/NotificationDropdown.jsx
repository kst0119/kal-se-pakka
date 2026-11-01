/**
 * NotificationDropdown.jsx
 * 
 * Interactive Notification Centre for KAL SE PAKKA.
 * Powered by Supabase `public.notifications` table.
 * Features:
 *  - Notification bell with unread counter badge
 *  - Dropdown panel with real-time notifications
 *  - Mark as read & Mark all as read
 *  - Read / Unread visual states
 *  - Playful Gen-Z empty state
 *  - Respects dark & light themes
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Sparkles, Clock, Check, X, ShieldAlert, Zap } from 'lucide-react';
import { useTask } from '../../context/TaskContext';

const NotificationDropdown = () => {
  const { notifications, unreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } = useTask();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-charcoal-600 dark:text-cream-200 hover:text-charcoal-900 dark:hover:text-white hover:bg-cream-200/80 dark:hover:bg-charcoal-800 transition-colors cursor-pointer"
        aria-label="Open notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-coral-500 text-white font-black text-[10px] shadow-sm animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-750 rounded-2xl shadow-elevated z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-cream-200 dark:border-charcoal-800 flex items-center justify-between bg-cream-50/50 dark:bg-charcoal-850/50">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-charcoal-900 dark:text-cream-50">
                Notifications
              </span>
              {unreadNotificationCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-coral-500/10 text-coral-600 dark:text-coral-400 border border-coral-500/20">
                  {unreadNotificationCount} unread
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-500/15 text-lime-800 dark:text-lime-300 border border-lime-500/30">
                  Caught up ✨
                </span>
              )}
            </div>

            {unreadNotificationCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-bold text-coral-600 dark:text-coral-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-cream-100 dark:divide-charcoal-800/60">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => {
                const isUnread = !notif.is_read;
                return (
                  <div
                    key={notif.id}
                    className={`p-3.5 transition-colors flex items-start gap-3 ${
                      isUnread
                        ? 'bg-cream-100/60 dark:bg-charcoal-800/40'
                        : 'hover:bg-cream-50 dark:hover:bg-charcoal-800/20'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isUnread
                          ? 'bg-coral-500/15 text-coral-500 dark:text-coral-400'
                          : 'bg-cream-200 dark:bg-charcoal-800 text-charcoal-400'
                      }`}
                    >
                      {notif.title?.includes('Completed') ? (
                        <Sparkles className="w-4 h-4 text-lime-500" />
                      ) : notif.title?.includes('Postponed') ? (
                        <Clock className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Zap className="w-4 h-4 text-coral-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs font-bold truncate ${isUnread ? 'text-charcoal-900 dark:text-cream-50' : 'text-charcoal-600 dark:text-charcoal-300'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-charcoal-400 dark:text-charcoal-500 shrink-0">
                          {formatTimestamp(notif.created_at)}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-600 dark:text-charcoal-300 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    {isUnread && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        title="Mark as read"
                        className="p-1 rounded-lg text-charcoal-400 hover:text-coral-500 dark:hover:text-coral-400 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors shrink-0 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              /* Playful Gen-Z Empty State */
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-cream-200 dark:bg-charcoal-800 flex items-center justify-center mx-auto text-xl shadow-sm">
                  ✨
                </div>
                <h4 className="text-xs font-bold text-charcoal-900 dark:text-cream-100">
                  Zero notifications yet!
                </h4>
                <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 max-w-xs mx-auto leading-relaxed">
                  You're all caught up, bestie! Activity alerts will appear here as you conquer tasks.
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-cream-100/60 dark:bg-charcoal-950 text-center border-t border-cream-200 dark:border-charcoal-800">
            <span className="text-[10px] text-charcoal-500 dark:text-charcoal-400 font-medium">
              Real-time sync powered by Supabase Cloud
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

