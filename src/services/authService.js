/**
 * authService.js
 * 
 * Reusable Authentication and Session Management Service for KAL SE PAKKA.
 * Built on top of the Supabase JavaScript client.
 * 
 * Operations:
 *  - signUp(email, password, metadata)
 *  - signIn(email, password)
 *  - signOut()
 *  - getSession()
 *  - getUser()
 *  - onAuthStateChange(callback)
 *  - resetPasswordForEmail(email, redirectTo)
 *  - testSupabaseConnection()
 * 
 * Invariants:
 *  - Uses ONLY anonymous/public credentials (never exposes service-role keys).
 *  - Sessions automatically persist to localStorage and refresh tokens.
 *  - Safely handles unconfigured environment states without crashing.
 */

import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from '../lib/supabase.js';

export const authService = {
  /**
   * Register a new user account with email and password.
   * 
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @param {Object} [params.metadata] Additional profile fields (e.g. full_name, college)
   * @returns {Promise<{ user: Object|null, session: Object|null, error: Object|null }>}
   */
  async signUp({ email, password, metadata = {} }) {
    if (!isSupabaseConfigured) {
      return {
        user: null,
        session: null,
        error: new Error('Supabase credentials are not configured. Check your .env file.'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        return { user: null, session: null, error };
      }

      // Check if user already exists (Supabase returns empty identities array when email confirmation is enabled and user exists)
      const isExistingUser = Boolean(
        data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0
      );

      // Email confirmation required if user created but no active session returned yet
      const isEmailConfirmationRequired = Boolean(
        data?.user && !data?.session && !isExistingUser
      );

      if (isExistingUser) {
        return {
          user: null,
          session: null,
          isExistingUser: true,
          isEmailConfirmationRequired: false,
          error: new Error('An account with this email already exists. Please sign in instead.'),
        };
      }

      return {
        user: data?.user || null,
        session: data?.session || null,
        isEmailConfirmationRequired,
        isExistingUser: false,
        error: null,
      };
    } catch (err) {
      return { user: null, session: null, error: err };
    }
  },

  /**
   * Sign in an existing user with email and password.
   * 
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{ user: Object|null, session: Object|null, error: Object|null }>}
   */
  async signIn({ email, password }) {
    if (!isSupabaseConfigured) {
      return {
        user: null,
        session: null,
        error: new Error('Supabase credentials are not configured. Check your .env file.'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      return {
        user: data?.user || null,
        session: data?.session || null,
        error,
      };
    } catch (err) {
      return { user: null, session: null, error: err };
    }
  },

  /**
   * Signs out the currently authenticated user and clears local session tokens.
   * 
   * @returns {Promise<{ error: Object|null }>}
   */
  async signOut() {
    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Retrieves the current active session from browser storage.
   * 
   * @returns {Promise<{ session: Object|null, error: Object|null }>}
   */
  async getSession() {
    if (!isSupabaseConfigured) {
      return { session: null, error: null };
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data?.session || null, error };
    } catch (err) {
      return { session: null, error: err };
    }
  },

  /**
   * Fetches the current authenticated user record from Supabase Auth.
   * 
   * @returns {Promise<{ user: Object|null, error: Object|null }>}
   */
  async getUser() {
    if (!isSupabaseConfigured) {
      return { user: null, error: null };
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: data?.user || null, error };
    } catch (err) {
      return { user: null, error: err };
    }
  },

  /**
   * Subscribes to authentication state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED).
   * 
   * @param {Function} callback (event, session) => void
   * @returns {{ unsubscribe: Function }}
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return {
        unsubscribe: () => {},
      };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },

  /**
   * Sends a password reset email to the specified address.
   * 
   * @param {string} email
   * @param {string} [redirectTo]
   * @returns {Promise<{ error: Object|null }>}
   */
  async resetPasswordForEmail(email, redirectTo = window?.location?.origin) {
    if (!isSupabaseConfigured) {
      return {
        error: new Error('Supabase credentials are not configured. Check your .env file.'),
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Tests the Supabase connection and reports diagnostics without inventing credentials.
   * 
   * @returns {Promise<{ success: boolean, configured: boolean, message: string, details?: any }>}
   */
  async testConnection() {
    const status = getSupabaseConfigStatus();

    // 1. If credentials missing or placeholders
    if (!status.isConfigured) {
      return {
        success: false,
        configured: false,
        message: `Missing Supabase environment variables: ${status.missingKeys.join(', ')}. Please add them to your .env file.`,
        missingKeys: status.missingKeys,
      };
    }

    // 2. Perform live network ping to Supabase Auth endpoint
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return {
          success: false,
          configured: true,
          message: `Supabase authentication endpoint error: ${error.message}`,
          error,
        };
      }

      return {
        success: true,
        configured: true,
        message: 'Successfully reached Supabase project endpoint!',
        hasActiveSession: Boolean(data?.session),
      };
    } catch (err) {
      return {
        success: false,
        configured: true,
        message: `Network failure connecting to Supabase: ${err.message}`,
        error: err,
      };
    }
  },
};

