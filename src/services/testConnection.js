/**
 * testConnection.js
 * 
 * Verification utility for Supabase connection & configuration.
 * Run with: node src/services/testConnection.js
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log('\n======================================================');
console.log('  KAL SE PAKKA – SUPABASE CONNECTION TEST');
console.log('======================================================\n');

// 1. Check if .env file exists
const envPath = resolve(process.cwd(), '.env');
const envExamplePath = resolve(process.cwd(), '.env.example');

console.log('1. Checking Environment Files:');
if (existsSync(envPath)) {
  console.log('  ✓ [FOUND] .env file exists in project root.');
} else {
  console.log('  ✗ [MISSING] .env file not found.');
}

if (existsSync(envExamplePath)) {
  console.log('  ✓ [FOUND] .env.example template exists.');
} else {
  console.log('  ✗ [MISSING] .env.example not found.');
}

// 2. Parse .env content for Supabase variables
let supabaseUrl = '';
let supabaseAnonKey = '';

if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('VITE_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').trim();
    }
  }
}

console.log('\n2. Inspecting Configured Credentials:');
const isUrlConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseUrl.startsWith('http')
);

const isKeyConfigured = Boolean(
  supabaseAnonKey &&
  supabaseAnonKey !== 'your-anon-or-publishable-key-here' &&
  supabaseAnonKey.length > 20
);

if (isUrlConfigured) {
  console.log(`  ✓ VITE_SUPABASE_URL: ${supabaseUrl}`);
} else {
  console.log(`  ⚠ VITE_SUPABASE_URL: ${supabaseUrl ? `Placeholder value ("${supabaseUrl}")` : 'Not provided'}`);
}

if (isKeyConfigured) {
  console.log(`  ✓ VITE_SUPABASE_ANON_KEY: [Configured - length ${supabaseAnonKey.length} chars]`);
} else {
  console.log(`  ⚠ VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Placeholder value' : 'Not provided'}`);
}

// 3. Security Check: Service Role Key Guard
console.log('\n3. Security Verification:');
const contentToCheck = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
if (contentToCheck.includes('service_role') || contentToCheck.includes('SERVICE_ROLE')) {
  console.error('  ✗ [SECURITY RISK] Service-role key found in .env! Remove it immediately.');
} else {
  console.log('  ✓ [SAFE] No service-role keys detected. Only public/anon keys permitted.');
}

// 4. Live Connection Test
console.log('\n4. Live Endpoint Connection Test:');
if (!isUrlConfigured || !isKeyConfigured) {
  console.log('  ℹ Status: WAITING FOR CREDENTIALS');
  console.log('  ----------------------------------------------------');
  console.log('  To connect your Supabase project:');
  console.log('  1. Open your Supabase Dashboard: https://supabase.com/dashboard');
  console.log('  2. Select your project -> Project Settings -> API');
  console.log('  3. Copy your "Project URL" and paste it into .env as:');
  console.log('     VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('  4. Copy your "anon" / "public" API key and paste it as:');
  console.log('     VITE_SUPABASE_ANON_KEY=eyJhbGciOi...');
  console.log('  ----------------------------------------------------');
} else {
  console.log('  Attempting network handshake with Supabase endpoint...');
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    if (res.ok) {
      console.log(`  ✓ [SUCCESS] Connected to Supabase health check! HTTP status: ${res.status}`);
      console.log('  ✓ Supabase Auth API is active and responsive.');
    } else {
      console.log(`  ⚠ Endpoint responded with HTTP status: ${res.status} (${res.statusText})`);
    }
  } catch (err) {
    console.error(`  ✗ [ERROR] Could not reach Supabase endpoint: ${err.message}`);
  }
}

console.log('\n======================================================\n');

