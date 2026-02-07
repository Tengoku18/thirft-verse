import {
  savePushTokenToProfile,
  unregisterPushToken,
} from "@/lib/push-notifications";
import { supabase } from "@/lib/supabase";
import {
  clearAuth,
  clearProfile,
  clearPersistedSignupState,
  fetchCurrentSession,
  fetchUserProfile,
  setSession,
  setUser,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: any }>;
  verifyOtpAndResetPassword: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const session = useAppSelector((state) => state.auth.session);
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    // Check active session on mount

    const initializeAuth = async () => {
      try {
        // Fetch session from Supabase and update Redux
        const result = await dispatch(fetchCurrentSession()).unwrap();

        if (result) {
          // Fetch user profile data
          await dispatch(fetchUserProfile(result.user.id));
          // Save push token to profile (awaits token initialization if needed)
          await savePushTokenToProfile(result.user.id);
        } else {
          console.log("ℹ️  No active session found - user is not logged in");
        }
      } catch (err) {
        // Check if it's just "no session" which is normal, not an error
        const errorMessage = (err as any)?.message || String(err);
        if (errorMessage.toLowerCase().includes("no active session") ||
            errorMessage.toLowerCase().includes("not logged in")) {
          console.log("ℹ️  No active session - user is not logged in");
        } else {
          // This is an actual error, log it
          console.error("💥 AuthContext: Error initializing auth:", err);
        }
        dispatch(clearAuth());
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Update Redux store with new session
      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));

      // On SIGNED_IN, fetch user profile
      if (event === "SIGNED_IN" && session) {
        await dispatch(fetchUserProfile(session.user.id));
      }

      // On SIGNED_OUT, clear auth and profile
      if (event === "SIGNED_OUT") {
        dispatch(clearAuth());
        dispatch(clearProfile());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.session) {
      dispatch(setSession(data.session));
      dispatch(setUser(data.user));

      if (data.user) {
        await dispatch(fetchUserProfile(data.user.id));
        // Save push token to profile (awaits token initialization if needed)
        await savePushTokenToProfile(data.user.id);
      }
    }

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
    // Unregister push token before signing out
    if (user?.id) {
      await unregisterPushToken(user.id);
    }
    await supabase.auth.signOut();
    // Clear Redux store
    dispatch(clearAuth());
    dispatch(clearProfile());
    // Clear persisted signup state
    dispatch(clearPersistedSignupState());
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "thriftverse://reset-password",
    });

    return { error };
  };

  const verifyOtpAndResetPassword = async (
    email: string,
    token: string,
    newPassword: string
  ) => {
    // First verify the OTP
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });

    if (verifyError) {
      console.error("❌ AuthContext: OTP verification failed:", verifyError);
      return { error: verifyError };
    }

    // Then update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error: updateError };
  };

  const refreshProfile = async () => {
    if (user) {
      await dispatch(fetchUserProfile(user.id));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
        verifyOtpAndResetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
