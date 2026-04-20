import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { clearAuth, clearPersistedSignupState, clearProfile, loadSignupState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";

type AppStatus =
  | "initializing" // Checking auth state
  | "checking_profile" // User authenticated, checking profile
  | "checking_signup" // Checking if signup is in progress
  | "signup_incomplete" // Signup in progress, redirect to appropriate step
  | "profile_incomplete" // Profile exists but incomplete
  | "ready" // All checks passed
  | "unauthenticated"; // No user session

export default function Index() {
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAuth();
  const profile = useAppSelector((state) => state.profile.profile);
  const profileLoading = useAppSelector((state) => state.profile.loading);
  const profileInitialized = useAppSelector((state) => state.profile.initialized);
  const signupState = useAppSelector((state) => state.signup);
  const [appStatus, setAppStatus] = useState<AppStatus>("initializing");
  const [signupLoaded, setSignupLoaded] = useState(false);
  // Tracks the last verified user ID so we only call getUser() once per session
  const verifiedUserIdRef = useRef<string | null>(null);

  // Load signup state on mount
  useEffect(() => {
    const loadState = async () => {
      await dispatch(loadSignupState());
      setSignupLoaded(true);
    };
    loadState();
  }, [dispatch]);

  useEffect(() => {
    const determineStatus = async () => {
      // Step 0: Wait for signup state to load
      if (!signupLoaded) {
        setAppStatus("initializing");
        return;
      }

      // Step 1: Check auth state
      if (authLoading) {
        setAppStatus("initializing");
        return;
      }

      // Step 2: No user - redirect to signin
      if (!user) {
        setAppStatus("unauthenticated");
        return;
      }

      // Step 2.5: Verify user still exists on server (once per session)
      // Catches deleted accounts with stale local sessions before checking
      // persisted signup state, which would otherwise redirect to signup screens.
      if (verifiedUserIdRef.current !== user.id) {
        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          await supabase.auth.signOut();
          dispatch(clearAuth());
          dispatch(clearProfile());
          await dispatch(clearPersistedSignupState());
          setAppStatus("unauthenticated");
          return;
        }
        verifiedUserIdRef.current = user.id;
      }

      // Step 3: User exists but might be in signup flow
      if (
        signupState.isSignupInProgress &&
        signupState.currentStep >= 2 &&
        signupState.currentStep <= 6
      ) {
        setAppStatus("signup_incomplete");
        return;
      }

      // Step 4: Wait until profile fetch has started AND completed.
      // profileInitialized is false until the first fetchUserProfile resolves.
      // Without this, profile=null + profileLoading=false (initial state) would
      // incorrectly trigger the "profile_incomplete" branch before fetch even starts.
      if (profileLoading || !profileInitialized) {
        setAppStatus("checking_profile");
        return;
      }

      // Step 5: Check if profile exists
      if (!profile) {
        setAppStatus("profile_incomplete");
        return;
      }

      // Step 6: Check required profile fields
      const isProfileComplete = profile.name && profile.store_username;
      if (!isProfileComplete) {
        setAppStatus("profile_incomplete");
        return;
      }

      setAppStatus("ready");
    };

    determineStatus();
  }, [authLoading, user, profileLoading, profile, profileInitialized, signupState, signupLoaded, dispatch]);

  // Hide the native splash screen and navigate when status is resolved
  useEffect(() => {
    const navigate = async () => {
      if (appStatus === "unauthenticated") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/signin");
      } else if (appStatus === "signup_incomplete") {
        await SplashScreen.hideAsync();
        const step = signupState.currentStep;
        if (step === 3) router.replace("/(auth)/signup-step3");
        else if (step === 4) router.replace("/(auth)/signup-step4");
        else if (step === 5) router.replace("/(auth)/signup-step5");
        else if (step === 6) router.replace("/(auth)/signup-step6");
        else router.replace("/(auth)/signup-step2");
      } else if (appStatus === "profile_incomplete") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/google-profile-setup" as any);
      } else if (appStatus === "ready") {
        await SplashScreen.hideAsync();
        router.replace("/(tabs)/home");
      }
    };
    navigate();
  }, [appStatus, signupState.currentStep]);

  // Native splash screen is visible while loading — no custom UI needed
  return null;
}
