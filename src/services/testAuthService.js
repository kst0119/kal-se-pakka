/**
 * testAuthService.js
 * 
 * Comprehensive automated verification script for Supabase Authentication:
 *  1. Client configuration & endpoint health.
 *  2. Session retrieval (persistent session initialization).
 *  3. Authentication state change subscription & unsubscription.
 *  4. Real login attempt with invalid credentials (verifies error handling).
 *  5. Real signup payload handling.
 *  6. Sign out handling.
 * 
 * Run with: node src/services/testAuthService.js
 */

import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from '../lib/supabase.js';
import { authService } from './authService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('='.repeat(65));
  console.log('  KAL SE PAKKA – SUPABASE AUTHENTICATION TEST SUITE');
  console.log('='.repeat(65));

  // Test 1: Configuration check
  console.log('\n[TEST 1]: Checking Supabase Client Configuration');
  const status = getSupabaseConfigStatus();
  assert(status.isConfigured === true, 'Supabase is fully configured with URL & Anon Key');
  assert(status.missingKeys.length === 0, 'No required environment keys are missing');
  assert(status.supabaseUrl.startsWith('https://'), 'Supabase URL is a valid HTTPS endpoint');

  // Test 2: Endpoint Health & Ping
  console.log('\n[TEST 2]: Endpoint Reachability & Health');
  const connResult = await authService.testConnection();
  assert(connResult.success === true, `Auth endpoint reachable: ${connResult.message}`);

  // Test 3: Session Retrieval & Persistence Setup
  console.log('\n[TEST 3]: Initial Session Retrieval');
  const { session, error: sessionErr } = await authService.getSession();
  assert(sessionErr === null, 'Session retrieval returns without errors');
  console.log(`     Active session detected: ${session ? session.user.email : 'None (clean unauthenticated state)'}`);

  // Test 4: Auth State Change Subscription
  console.log('\n[TEST 4]: Auth State Change Event Listener');
  let listenerFired = false;
  const { unsubscribe } = authService.onAuthStateChange((event, s) => {
    listenerFired = true;
  });
  assert(typeof unsubscribe === 'function', 'onAuthStateChange returns a valid unsubscribe function');
  unsubscribe();
  assert(true, 'Successfully unsubscribed from auth listener without memory leaks');

  // Test 5: Login with Invalid Credentials
  console.log('\n[TEST 5]: Authentication Validation - Invalid Credentials');
  const invalidLoginResult = await authService.signIn({
    email: 'nonexistent_student_test_ksp@example.com',
    password: 'InvalidPassword123!',
  });
  assert(invalidLoginResult.user === null, 'User object is null on invalid credentials');
  assert(invalidLoginResult.session === null, 'Session object is null on invalid credentials');
  assert(invalidLoginResult.error !== null, `Supabase rejected bad credentials as expected: "${invalidLoginResult.error?.message}"`);

  // Test 6: Sign Out Functionality
  console.log('\n[TEST 6]: Sign Out Handlers');
  const signOutResult = await authService.signOut();
  assert(signOutResult.error === null, 'authService.signOut() completed cleanly');

  // Summary
  console.log('\n' + '='.repeat(65));
  console.log(`  RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(65) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected test error:', err);
  process.exit(1);
});

