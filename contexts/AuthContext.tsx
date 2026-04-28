import {
  savePushTokenToProfile,
  unregisterPushToken,
} from "@/lib/push-notifications";
import { supabase } from "@/lib/supabase";
import {
  clearAuth,
  clearNotifications,
  clearProfile,
  fetchCurrentSession,
  fetchUnreadCount,
  fetchUserProfile,
  resetSignup,
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
    // Do NOT call getSession()/getUser() here — that would race with
    // initializeApp() in app/index.tsx and risk concurrent token refreshes
    // tripping refresh-token reuse detection. Rely on INITIAL_SESSION instead.
    //
    // IMPORTANT: keep this callback sync. Async callbacks run inside an
    // exclusive lock; calling supabase.auth.* APIs from inside would deadlock.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔐 [auth] ${event}`, session ? `user=${session.user.id}` : "no session");

      if (event === "TOKEN_REFRESHED") {
        const expiresAt = session?.expires_at
          ? new Date(session.expires_at * 1000).toISOString()
          : "unknown";
        console.log(`🔄 [auth] TOKEN_REFRESHED — new expiry: ${expiresAt}`);
      }

      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));

      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        // TODO: these three dispatches are duplicated inside signIn() and the
        // OAuth flows — on every fresh sign-in they fire twice. Remove them
        // from signIn/signInWithGoogle/signInWithApple now that the listener
        // handles them.
        dispatch(fetchUserProfile(session.user.id));
        dispatch(fetchUnreadCount(session.user.id));
        savePushTokenToProfile(session.user.id).catch((err) =>
          console.warn("⚠️  Failed to save push token:", err),
        );
      }

      if (event === "SIGNED_OUT") {
        console.warn("🚪 [auth] SIGNED_OUT received — session ended (could be manual signOut, token revoked, or refresh failed)");
        dispatch(clearAuth());
        dispatch(clearProfile());
        dispatch(clearNotifications());
        dispatch(resetSignup());
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
      const { error: sessionError, data: sessionData } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

      // Check for email conflict error
      if (sessionError) {
        // Supabase returns specific errors for email conflicts
        if (
          sessionError.message &&
          (sessionError.message.toLowerCase().includes("email") ||
            sessionError.message.toLowerCase().includes("already"))
        ) {
          return {
            error: {
              message:
                "Account exists with this email, please use email/password",
            },
          };
        }
        return { error: sessionError };
      }

      await AsyncStorage.setItem(REMEMBER_ME_KEY, "true");

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
        // Check for email conflict error
        if (
          authError.message &&
          (authError.message.toLowerCase().includes("email") ||
            authError.message.toLowerCase().includes("already"))
        ) {
          return {
            error: {
              message:
                "Account exists with this email, please use email/password",
            },
          };
        }
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

      await AsyncStorage.setItem(REMEMBER_ME_KEY, "true");

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
      const { error: sessionError, data: sessionData } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

      // Check for email conflict error
      if (sessionError) {
        // Supabase returns specific errors for email conflicts
        if (
          sessionError.message &&
          (sessionError.message.toLowerCase().includes("email") ||
            sessionError.message.toLowerCase().includes("already"))
        ) {
          return {
            error: {
              message:
                "Account exists with this email, please use email/password",
            },
          };
        }
        return { error: sessionError };
      }

      await AsyncStorage.setItem(REMEMBER_ME_KEY, "true");

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
    dispatch(resetSignup());

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
