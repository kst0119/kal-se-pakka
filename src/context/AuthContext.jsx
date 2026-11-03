/**
 * AuthContext.jsx
 * 
 * Global Supabase Authentication Context for KAL SE PAKKA.
 * Provides real session persistence, auth state listener, and methods for:
 *  - signup(fullName, email, password)
 *  - login(email, password)
 *  - loginAsGuest(name)  [Instant Demo / Offline Access]
 *  - logout()
 *  - resetPassword(email)
 * 
 * Invariants:
 *  - Preserves persistent sessions across browser refreshes.
 *  - Supports seamless Guest/Demo access so users are never locked out of their tasks.
 *  - Properly unsubscribes from Supabase auth state change events on unmount.
 *  - Exposes user metadata (e.g. full_name) to components.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);
const STORAGE_KEY_GUEST = 'ksp_guest_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Check existing session on component mount
    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          // Check for existing guest session
          const savedGuest = localStorage.getItem(STORAGE_KEY_GUEST);
          if (savedGuest && isMounted) {
            const parsed = JSON.parse(savedGuest);
            setUser(parsed);
            setSession({ user: parsed });
          }
          if (isMounted) setLoading(false);
          return;
        }

        const { session: currentSession, error } = await authService.getSession();
        if (error) {
          console.warn('[AuthContext] Session retrieval error:', error.message);
        }

        if (isMounted) {
          if (currentSession?.user) {
            setUser(currentSession.user);
            setSession(currentSession);
          } else {
            // Check for existing guest session
            const savedGuest = localStorage.getItem(STORAGE_KEY_GUEST);
            if (savedGuest) {
              try {
                const parsed = JSON.parse(savedGuest);
                setUser(parsed);
                setSession({ user: parsed });
              } catch (e) {
                setUser(null);
                setSession(null);
              }
            } else {
              setUser(null);
              setSession(null);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('[AuthContext] Initialization failed:', err);
        if (isMounted) {
          const savedGuest = localStorage.getItem(STORAGE_KEY_GUEST);
          if (savedGuest) {
            try {
              const parsed = JSON.parse(savedGuest);
              setUser(parsed);
              setSession({ user: parsed });
            } catch (e) {}
          }
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 2. Subscribe to auth changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
    const { unsubscribe } = authService.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && newSession?.user) {
        localStorage.removeItem(STORAGE_KEY_GUEST);
        setSession(newSession);
        setUser(newSession.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        const savedGuest = localStorage.getItem(STORAGE_KEY_GUEST);
        if (!savedGuest) {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      } else if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        setLoading(false);
      }
    });

    // 3. Cleanup listener on unmount
    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  /**
   * Instant Demo / Guest Login without requiring Supabase email verification
   */
  const loginAsGuest = (name = 'College Scholar') => {
    setAuthError(null);
    const guestUser = {
      id: 'guest_user_demo',
      email: 'guest@kalsepakka.local',
      user_metadata: {
        full_name: name,
      },
      isGuest: true,
      created_at: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_GUEST, JSON.stringify(guestUser));
    } catch (e) {
      console.error('Could not save guest session', e);
    }

    setUser(guestUser);
    setSession({ user: guestUser });
    return { success: true, user: guestUser };
  };

  /**
   * Log in an existing user with email and password
   */
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const { user: loggedInUser, session: newSession, error } = await authService.signIn({
        email,
        password,
      });

      if (error) {
        const isEmailNotConfirmed =
          error.code === 'email_not_confirmed' ||
          (error.message && error.message.toLowerCase().includes('email not confirmed'));

        setAuthError(error.message);
        return { success: false, error, isEmailNotConfirmed };
      }

      localStorage.removeItem(STORAGE_KEY_GUEST);
      setUser(loggedInUser);
      setSession(newSession);
      return { success: true, user: loggedInUser, session: newSession };
    } catch (err) {
      const message = err.message || 'An unexpected error occurred during login.';
      setAuthError(message);
      return { success: false, error: err };
    }
  };

  /**
   * Sign up a new user with full name, email, and password
   */
  const signup = async ({ fullName, email, password }) => {
    setAuthError(null);
    try {
      const {
        user: newUser,
        session: newSession,
        isEmailConfirmationRequired,
        isExistingUser,
        error,
      } = await authService.signUp({
        email,
        password,
        metadata: {
          full_name: fullName.trim(),
        },
      });

      if (error) {
        setAuthError(error.message);
        return {
          success: false,
          error,
          isExistingUser,
          isEmailConfirmationRequired,
        };
      }

      if (newSession?.user) {
        localStorage.removeItem(STORAGE_KEY_GUEST);
        setUser(newUser);
        setSession(newSession);
      }

      return {
        success: true,
        user: newUser,
        session: newSession,
        isEmailConfirmationRequired,
      };
    } catch (err) {
      const message = err.message || 'An unexpected error occurred during registration.';
      setAuthError(message);
      return { success: false, error: err };
    }
  };

  /**
   * Log out the current user and clear local session state
   */
  const logout = async () => {
    setAuthError(null);
    try {
      localStorage.removeItem(STORAGE_KEY_GUEST);
      if (user && !user.isGuest) {
        const { error } = await authService.signOut();
        if (error) {
          console.warn('[AuthContext] Sign out warning:', error.message);
        }
      }
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (err) {
      console.error('[AuthContext] Sign out error:', err);
      localStorage.removeItem(STORAGE_KEY_GUEST);
      setUser(null);
      setSession(null);
      return { success: true };
    }
  };

  /**
   * Request password reset email
   */
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      const { error } = await authService.resetPasswordForEmail(email);
      if (error) {
        setAuthError(error.message);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      const message = err.message || 'Failed to send password reset email.';
      setAuthError(message);
      return { success: false, error: err };
    }
  };

  const clearError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    session,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    isConfigured: isSupabaseConfigured,
    login,
    loginAsGuest,
    signup,
    logout,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
