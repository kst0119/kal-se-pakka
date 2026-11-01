/**
 * AuthContext.jsx
 * 
 * Global Supabase Authentication Context for KAL SE PAKKA.
 * Provides real session persistence, auth state listener, and methods for:
 *  - signup(fullName, email, password)
 *  - login(email, password)
 *  - logout()
 *  - resetPassword(email)
 * 
 * Invariants:
 *  - Preserves persistent sessions across browser refreshes.
 *  - Properly unsubscribes from Supabase auth state change events on unmount.
 *  - Exposes user metadata (e.g. full_name) to components.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

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
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        const { session: currentSession, error } = await authService.getSession();
        if (error) {
          console.warn('[AuthContext] Session retrieval error:', error.message);
        }

        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setLoading(false);
        }
      } catch (err) {
        console.error('[AuthContext] Initialization failed:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 2. Subscribe to auth changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
    const { unsubscribe } = authService.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      setUser(newSession?.user || null);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
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
        setAuthError(error.message);
        return { success: false, error };
      }

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

      setUser(newUser);
      setSession(newSession);
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
      const { error } = await authService.signOut();
      if (error) {
        console.warn('[AuthContext] Sign out warning:', error.message);
      }
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (err) {
      console.error('[AuthContext] Sign out error:', err);
      // Force clear local state anyway
      setUser(null);
      setSession(null);
      return { success: false, error: err };
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

