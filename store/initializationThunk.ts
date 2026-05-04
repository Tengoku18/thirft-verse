import { getUserProfile } from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/lib/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

type AppInitStatus =
  | "initializing"
  | "checking_profile"
  | "oauth_profile_setup" // OAuth user at step 1 — needs name/terms screen
  | "signup_incomplete" // Email user mid-signup — resume at signup_step + 1
  | "profile_incomplete" // Auth done but required profile fields missing
  | "password_recovery" // Recovery session active — must change password before entering app
  | "ready"
  | "unauthenticated";

// Decode JWT AMR claim to detect recovery sessions without an extra network call.
// Recovery sessions have amr: [{ method: "recovery" }] per the OIDC spec.
function isRecoverySession(accessToken: string): boolean {
  try {
    const payload = accessToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = JSON.parse(atob(base64 + padding));
    return (
      Array.isArray(decoded?.amr) &&
      decoded.amr.some((m: { method: string }) => m.method === "recovery")
    );
  } catch {
    return false;
  }
}

interface InitializationResult {
  status: AppInitStatus;
  user: any | null;
  profile: Profile | null;
}

/**
 * Initialize app by fetching user and profile, then determining routing status.
 *
 * Flow:
 * 1. Check if user is authenticated
 * 2. If no user → unauthenticated
 * 3. If user exists → fetch profile from database
 * 4. Based on profile.auth_completed and profile.signup_step, determine next screen
 *
 * Logs each step for debugging persistence and signup flow issues.
 */
export const initializeApp = createAsyncThunk(
  "app/initialize",
  async (_, { rejectWithValue }) => {
    try {
      console.log("\n🚀 [STEP 1] App initialization started\n");

      // ──────────────────────────────────────────────────────────────
      // STEP 1: Fetch authenticated user from Supabase Auth
      // ──────────────────────────────────────────────────────────────
      console.log("📱 [STEP 1.1] Fetching user from Supabase Auth...");

      let user = null;
      let userError = null;

      try {
        const result = await supabase.auth.getUser();
        user = result.data?.user || null;
        userError = result.error;
      } catch (err) {
        console.warn("⚠️  [STEP 1.1] Auth check threw error:", err);
        userError = err;
      }

      if (userError) {
        console.warn(
          "⚠️  [STEP 1.1] Auth error (may be expected):",
          userError.message,
        );
        // Auth errors are expected when no session exists - treat as unauthenticated
        console.log("➡️  Status: UNAUTHENTICATED → Redirect to signin\n");
        return {
          status: "unauthenticated",
          user: null,
          profile: null,
        } as InitializationResult;
      }

      if (!user) {
        console.log("⚠️  [STEP 1.2] No authenticated user found");
        console.log("➡️  Status: UNAUTHENTICATED → Redirect to signin\n");
        return {
          status: "unauthenticated",
          user: null,
          profile: null,
        } as InitializationResult;
      }

      console.log(`✅ [STEP 1.2] User authenticated: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Provider: ${user.app_metadata?.provider || "email"}\n`);

      // ──────────────────────────────────────────────────────────────
      // STEP 1.3: Detect recovery sessions (forgot-password flow)
      // Primary: AsyncStorage flag set by onAuthStateChange PASSWORD_RECOVERY.
      // Fallback: decode JWT AMR claim (amr: [{method:"recovery"}]).
      // Either condition forces password change before entering the app.
      // ──────────────────────────────────────────────────────────────
      const recoveryPending = await AsyncStorage.getItem("@thriftverse:recovery_pending");
      if (recoveryPending === "true") {
        console.log("🔑 [STEP 1.3] Recovery pending flag set — redirecting to password change\n");
        return {
          status: "password_recovery",
          user,
          profile: null,
        } as InitializationResult;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (accessToken && isRecoverySession(accessToken)) {
        console.log("🔑 [STEP 1.3] Recovery session detected via JWT AMR — redirecting to password change\n");
        return {
          status: "password_recovery",
          user,
          profile: null,
        } as InitializationResult;
      }

      // ──────────────────────────────────────────────────────────────
      // STEP 2: Fetch user profile from database
      // ──────────────────────────────────────────────────────────────
      console.log("📋 [STEP 2.1] Fetching profile from database...");
      const profileResult = await getUserProfile(user.id);

      if (!profileResult.success || !profileResult.data) {
        console.log("⚠️  [STEP 2.2] No profile found in database");
        console.log(
          "➡️  Status: PROFILE_INCOMPLETE → Need to create profile\n",
        );
        return {
          status: "profile_incomplete",
          user,
          profile: null,
        } as InitializationResult;
      }

      const profile = profileResult.data as Profile;
      console.log(`✅ [STEP 2.2] Profile found: ${profile.store_username}`);
      console.log(`   signup_step: ${profile.signup_step}`);
      console.log(`   auth_completed: ${profile.auth_completed}\n`);

      // ──────────────────────────────────────────────────────────────
      // STEP 3: Determine app status based on profile state
      // ──────────────────────────────────────────────────────────────
      console.log("🎯 [STEP 3] Determining app status based on profile...\n");

      // Case 1: Profile has required fields but signup not completed
      if (!profile.auth_completed) {
        const provider = user.app_metadata?.provider;
        const isOAuth = provider === "google" || provider === "apple";

        // Case 1a: OAuth user at step 1 → needs name/terms screen
        if (isOAuth && profile.signup_step <= 1) {
          console.log(`   📌 OAuth user at step ${profile.signup_step}`);
          console.log(
            "➡️  Status: OAUTH_PROFILE_SETUP → Redirect to profile setup\n",
          );
          return {
            status: "oauth_profile_setup",
            user,
            profile,
          } as InitializationResult;
        }

        // Case 1b: Email/signup user mid-flow → resume at next step
        const nextStep = Math.min(
          6,
          Math.max(2, (profile.signup_step ?? 1) + 1),
        );
        console.log(`   📌 Signup incomplete at step ${profile.signup_step}`);
        console.log(
          `➡️  Status: SIGNUP_INCOMPLETE → Resume at signup-step${nextStep}\n`,
        );
        return {
          status: "signup_incomplete",
          user,
          profile,
        } as InitializationResult;
      }

      // Case 2: auth_completed = true but missing required profile fields
      if (!profile.name || !profile.store_username) {
        console.log("   📌 auth_completed but missing required fields");
        console.log(
          "➡️  Status: PROFILE_INCOMPLETE → Redirect to complete profile\n",
        );
        return {
          status: "profile_incomplete",
          user,
          profile,
        } as InitializationResult;
      }

      // Case 3: Profile is complete and auth is complete → Ready for app
      console.log("   ✅ All required fields present");
      console.log("➡️  Status: READY → Redirect to home\n");
      return {
        status: "ready",
        user,
        profile,
      } as InitializationResult;
    } catch (error) {
      console.warn(
        "⚠️  [WARNING] Error during initialization (treating as unauthenticated):",
        error,
      );
      // On any unexpected error, treat as unauthenticated to avoid blocking app startup
      return {
        status: "unauthenticated",
        user: null,
        profile: null,
      } as InitializationResult;
    }
  },
);
