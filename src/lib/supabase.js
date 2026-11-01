/**
 * supabase.js
 * 
 * Reusable Supabase client configuration for KAL SE PAKKA.
 * 
 * Reads:
 *  - VITE_SUPABASE_URL: Project endpoint (e.g. https://xyz.supabase.co)
 *  - VITE_SUPABASE_ANON_KEY: Public Anon Key (safe for browser usage)
 * 
 * Security:
 *  - NEVER import or expose the Supabase service-role secret in frontend client code.
 *  - Sessions are persistently stored in browser localStorage with automatic token refresh.
 */

import { createClient } from '@supabase/supabase-js';

// Read Vite environment variables (with fallback for Node.js test runners)
const getEnvVar = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // ignore
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL').trim();
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY').trim();

// Validate credentials presence
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-or-publishable-key-here' &&
  supabaseUrl.startsWith('http')
);

// Diagnostic configuration helper
export const getSupabaseConfigStatus = () => {
  const missing = [];
  if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co') {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-or-publishable-key-here') {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }

  return {
    isConfigured: isSupabaseConfigured,
    missingKeys: missing,
    supabaseUrl: isSupabaseConfigured ? supabaseUrl : (supabaseUrl ? '(Invalid URL format)' : '(Not set)'),
  };
};

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '[Supabase Configuration Notice]: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing or contains placeholder values. Set them in your local .env file to enable cloud authentication & data sync.'
  );
}

// Fallback dummy credentials to prevent createClient from crashing if unconfigured
const clientUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const clientAnonKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

/**
 * Shared Supabase Client Instance
 * Configured with persistent sessions and automatic token refresh.
 */
export const supabase = createClient(clientUrl, clientAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'kal_se_pakka_auth_session',
  },
});

