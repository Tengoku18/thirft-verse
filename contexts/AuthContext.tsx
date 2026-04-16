import {
  savePushTokenToProfile,
  unregisterPushToken,
} from "@/lib/push-notifications";
import { supabase } from "@/lib/supabase";
import {
  clearAuth,
  clearNotifications,
  clearPersistedSignupState,
  clearProfile,
  fetchCurrentSession,
  fetchUnreadCount,
  fetchUserProfile,
  setSession,
  setUser,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect } from "react";

const REMEMBER_ME_KEY = "@thriftverse:remember_me";
const SAVED_EMAIL_KEY = "@thriftverse:saved_email";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ error: any }>;
  verifyOtpAndResetPassword: (
    email: string,
    token: string,
    newPassword: string,
  ) => Promise<{ error: any }>;
  hasPasswordAuth: () => boolean;
  getAuthProvider: () => string | null;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const session = useAppSelector((state) => state.auth.session);
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    // Initialize Auth on App Launch
    // Restores session ONLY if user explicitly checked "Remember me" on previous login

    const initializeAuth = async () => {
      try {
        // Check if user enabled "Remember me" on previous login
        const rememberMeEnabled = await AsyncStorage.getItem(REMEMBER_ME_KEY);

        // ONLY restore session if user explicitly enabled Remember me
        // This prevents auto-login on first launch or after unchecking the box
        if (rememberMeEnabled !== "true") {
          console.log(
            "ℹ️  Remember me not enabled - user must sign in manually",
          );
          return;
        }

        console.log(
          "✅ Remember me enabled - attempting to restore session...",
        );

        // Try to fetch existing session from Supabase
        const result = await dispatch(fetchCurrentSession()).unwrap();

        if (result) {
          console.log("✅ Session restored successfully!");
          // Fetch user profile data
          await dispatch(fetchUserProfile(result.user.id));
          // Fetch unread notification count for badge
          dispatch(fetchUnreadCount(result.user.id));
          // Save push token to profile (awaits token initialization if needed)
          await savePushTokenToProfile(result.user.id);
        } else {
          console.log("ℹ️  No active session found - user must sign in");
          // Clear the remember me flag since session is invalid
          await AsyncStorage.removeItem(REMEMBER_ME_KEY);
        }
      } catch (err) {
        // Session restoration failed or no session exists
        const errorMessage = (err as any)?.message || String(err);

        if (
          errorMessage.toLowerCase().includes("no active session") ||
          errorMessage.toLowerCase().includes("not logged in")
        ) {
          console.log("ℹ️  No active session - user is not logged in");
        } else {
          console.error("❌ Auth initialization error:", err);
        }

        // Clear remember me flag on any error to prevent infinite loops
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
        dispatch(clearAuth());
      }
    };

    initializeAuth();

    // Listen for auth changes from Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Update Redux store with new session
      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));

      // On SIGNED_IN, fetch user profile (fire-and-forget to avoid blocking setSession)
      if (event === "SIGNED_IN" && session) {
        dispatch(fetchUserProfile(session.user.id));
      }

      // On SIGNED_OUT, clear auth and profile
      if (event === "SIGNED_OUT") {
        dispatch(clearAuth());
        dispatch(clearProfile());
        dispatch(clearNotifications());
        dispatch(clearPersistedSignupState());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const signIn = async (
    email: string,
    password: string,
    rememberMe = false,
  ) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.session) {
      // Persist the remember-me preference for app relaunches
      // Save the checkbox state (true/false) so it persists user's preference
      if (rememberMe) {
        console.log(
          "✅ Remember me enabled - session will be restored on next launch",
        );
        await AsyncStorage.setItem(REMEMBER_ME_KEY, "true");
        // Save email for pre-filling the signin form
        await AsyncStorage.setItem(SAVED_EMAIL_KEY, email);
      } else {
        console.log("❌ Remember me disabled - preference saved");
        // Explicitly save as false to persist user's preference
        await AsyncStorage.setItem(REMEMBER_ME_KEY, "false");
        // But don't save email when unchecked
        await AsyncStorage.removeItem(SAVED_EMAIL_KEY);
      }

      dispatch(setSession(data.session));
      dispatch(setUser(data.user));

      if (data.user) {
        await dispatch(fetchUserProfile(data.user.id));
        dispatch(fetchUnreadCount(data.user.id));
        await savePushTokenToProfile(data.user.id);
      }
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    try {
      const redirectTo = makeRedirectUri();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) return { error };
      if (!data.url) {
        return { error: { message: "Failed to get Google sign-in URL" } };
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );

      if (result.type !== "success") {
        return { error: { message: "Sign in was cancelled" } };
      }

      // Extract tokens from the redirect URL hash fragment
      const url = result.url;
      const hashParams = new URLSearchParams(url.split("#")[1] || "");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (!accessToken || !refreshToken) {
        return {
          error: {
            message: "Failed to complete sign in. Please try again.",
          },
        };
      }

      // setSession triggers onAuthStateChange which handles Redux updates
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) return { error: sessionError };

      return { error: null };
    } catch (error) {
      console.error("Unexpected Google sign in error:", error);
      return {
        error: {
          message: "An unexpected error occurred. Please try again.",
        },
      };
    }
  };

  const signInWithApple = async () => {
    try {
      // Check if device supports Apple Authentication
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        // Fall back to OAuth flow for Android or older devices
        return await signInWithAppleOAuth();
      }

      // Native Sign in with Apple for iOS
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        return { error: { message: "No identity token received from Apple" } };
      }

      // Sign in via Supabase with the identity token
      const { error: authError, data } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });

      if (authError) {
        console.error("❌ Apple Sign-In Auth Error:", authError);
        return { error: authError };
      }

      // Save full name from credential (only available on first sign-in)
      if (credential.fullName) {
        const nameParts = [];
        if (credential.fullName.givenName) {
          nameParts.push(credential.fullName.givenName);
        }
        if (credential.fullName.middleName) {
          nameParts.push(credential.fullName.middleName);
        }
        if (credential.fullName.familyName) {
          nameParts.push(credential.fullName.familyName);
        }

        const fullName = nameParts.join(" ");

        try {
          await supabase.auth.updateUser({
            data: {
              full_name: fullName,
              given_name: credential.fullName.givenName || "",
              family_name: credential.fullName.familyName || "",
            },
          });
        } catch (updateError) {
          console.warn(
            "⚠️  Failed to update user with full name:",
            updateError,
          );
          // Continue even if name update fails - user is already signed in
        }
      }

      return { error: null };
    } catch (error: any) {
      if (error.code === "ERR_REQUEST_CANCELED") {
        return { error: { message: "Sign in was cancelled" } };
      }
      console.error("Unexpected Apple sign in error:", error);
      return {
        error: {
          message: "An unexpected error occurred. Please try again.",
        },
      };
    }
  };

  const signInWithAppleOAuth = async () => {
    try {
      const redirectTo = makeRedirectUri();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) return { error };
      if (!data.url) {
        return { error: { message: "Failed to get Apple sign-in URL" } };
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );

      if (result.type !== "success") {
        return { error: { message: "Sign in was cancelled" } };
      }

      // Extract tokens from the redirect URL hash fragment
      const url = result.url;
      const hashParams = new URLSearchParams(url.split("#")[1] || "");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (!accessToken || !refreshToken) {
        return {
          error: {
            message: "Failed to complete sign in. Please try again.",
          },
        };
      }

      // setSession triggers onAuthStateChange which handles Redux updates
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) return { error: sessionError };

      return { error: null };
    } catch (error) {
      console.error("Unexpected Apple OAuth error:", error);
      return {
        error: {
          message: "An unexpected error occurred. Please try again.",
        },
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    console.log("🚪 Signing out user...");

    // Unregister push token
    if (user?.id) {
      await unregisterPushToken(user.id);
    }

    // Keep remember me preference but clear the flag to prevent auto-login
    // Set to false so user sees unchecked checkbox on next signin screen
    await AsyncStorage.setItem(REMEMBER_ME_KEY, "false");
    // Also clear saved email for security - user should re-enter it on next login
    await AsyncStorage.removeItem(SAVED_EMAIL_KEY);

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear all auth/profile data from Redux
    dispatch(clearAuth());
    dispatch(clearProfile());
    dispatch(clearNotifications());
    await dispatch(clearPersistedSignupState());

    console.log("✅ Sign out complete");
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "thriftverse://reset-password",
    });

    return { error };
  };

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      // Get the current user's email
      const email = user?.email;
      if (!email) {
        return { error: { message: "User email not found" } };
      }

      // First, verify the current password by attempting to sign in
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password: currentPassword,
        });

      if (signInError) {
        return {
          error: {
            message: "Current password is incorrect",
            code: signInError.code,
          },
        };
      }

      // If sign in was successful, update to the new password
      if (signInData.session) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          return { error: updateError };
        }

        // Refresh the current session to ensure it's still valid
        await dispatch(fetchCurrentSession());
      }

      return { error: null };
    } catch (err) {
      console.error("❌ changePassword error:", err);
      return {
        error: {
          message: "An unexpected error occurred",
        },
      };
    }
  };

  /**
   * Checks if user has email/password authentication
   * Returns false for OAuth-only users (Google, Apple)
   */
  const hasPasswordAuth = (): boolean => {
    if (!user?.identities) return false;
    // Check if user has 'password' identity type
    return user.identities.some((identity) => identity.provider === "email");
  };

  /**
   * Gets the primary authentication provider
   * Returns 'email', 'google', 'apple', or null
   */
  const getAuthProvider = (): string | null => {
    if (!user?.identities || user.identities.length === 0) return null;
    // Return the first (primary) provider
    return user.identities[0]?.provider || null;
  };

  const verifyOtpAndResetPassword = async (
    email: string,
    token: string,
    newPassword: string,
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
        signInWithGoogle,
        signInWithApple,
        signUp,
        signOut,
        resetPasswordForEmail,
        verifyOtp,
        updatePassword,
        changePassword,
        hasPasswordAuth,
        getAuthProvider,
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
