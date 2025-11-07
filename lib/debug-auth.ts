import { supabase } from './supabase';

/**
 * Debug helper to check authentication status
 * Call this to see detailed info about your auth state
 */
export const debugAuthStatus = async () => {
  console.log('🔍 ===== AUTH DEBUG INFO =====');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not Set');
  console.log('  SUPABASE_KEY:', process.env.EXPO_PUBLIC_SUPABASE_KEY ? '✅ Set' : '❌ Not Set');

  // Check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  console.log('\n🔐 Session Status:');
  if (sessionError) {
    console.log('  ❌ Session Error:', sessionError);
  } else if (!session) {
    console.log('  ❌ No active session - User is NOT logged in');
  } else {
    console.log('  ✅ Session found!');
    console.log('  User ID:', session.user.id);
    console.log('  Email:', session.user.email);
    console.log('  Session expires:', new Date(session.expires_at! * 1000).toLocaleString());
    console.log('  Access token (first 20 chars):', session.access_token.substring(0, 20) + '...');
  }

  // Check user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  console.log('\n👤 User Status:');
  if (userError) {
    console.log('  ❌ User Error:', userError);
  } else if (!user) {
    console.log('  ❌ No user found');
  } else {
    console.log('  ✅ User found!');
    console.log('  User ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Created:', new Date(user.created_at).toLocaleString());
    console.log('  Metadata:', user.user_metadata);
  }

  console.log('\n🔍 ===== END DEBUG INFO =====');

  return { session, user };
};
