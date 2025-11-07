import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: any }>;
  verifyOtpAndResetPassword: (email: string, token: string, newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    console.log('🔄 AuthContext: Checking for existing session...');

    const initializeAuth = async () => {
      try {
        // IMPORTANT: Use getSession() to check if we have a valid session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ AuthContext: Error getting session:', error);
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        if (session) {
          console.log('✅ AuthContext: Session found!', {
            userId: session.user.id,
            email: session.user.email,
            expiresAt: new Date(session.expires_at! * 1000).toLocaleString(),
          });

          // Check if session is expired
          const now = Math.floor(Date.now() / 1000);
          if (session.expires_at && session.expires_at < now) {
            console.log('⚠️ AuthContext: Session expired, refreshing...');
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

            if (refreshError || !refreshData.session) {
              console.error('❌ AuthContext: Failed to refresh session:', refreshError);
              setSession(null);
              setUser(null);
            } else {
              console.log('✅ AuthContext: Session refreshed successfully!');
              setSession(refreshData.session);
              setUser(refreshData.session.user);
            }
          } else {
            setSession(session);
            setUser(session.user);
          }
        } else {
          console.log('❌ AuthContext: No session found');
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        console.error('💥 AuthContext: Unexpected error:', err);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 AuthContext: Auth state changed:', event, {
        userId: session?.user?.id,
        email: session?.user?.email,
      });

      // On SIGNED_IN, make sure the session is valid
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ AuthContext: User signed in, setting session');
      }

      // On TOKEN_REFRESHED, update the session
      if (event === 'TOKEN_REFRESHED' && session) {
        console.log('✅ AuthContext: Token refreshed');
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 AuthContext: Attempting signInWithPassword for:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('📧 AuthContext: signInWithPassword response:', { data, error });

    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPasswordForEmail = async (email: string) => {
    console.log('🔐 AuthContext: Requesting password reset for:', email);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'thriftverse://reset-password',
    });

    console.log('📧 AuthContext: resetPasswordForEmail response:', { error });
    return { error };
  };

  const verifyOtpAndResetPassword = async (email: string, token: string, newPassword: string) => {
    console.log('🔐 AuthContext: Verifying OTP and resetting password for:', email);

    // First verify the OTP
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });

    if (verifyError) {
      console.error('❌ AuthContext: OTP verification failed:', verifyError);
      return { error: verifyError };
    }

    console.log('✅ AuthContext: OTP verified, updating password...');

    // Then update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    console.log('📧 AuthContext: Password update response:', { error: updateError });
    return { error: updateError };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPasswordForEmail, verifyOtpAndResetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
