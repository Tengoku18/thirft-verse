import { BodyMediumText, HeadingBoldText } from "@/components/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { loadSignupState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
  const [statusMessage, setStatusMessage] = useState("Starting up...");
  const [signupLoaded, setSignupLoaded] = useState(false);

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
        setStatusMessage("Starting up...");
        return;
      }

      // Step 1: Check auth state
      if (authLoading) {
        setAppStatus("initializing");
        setStatusMessage("Checking authentication...");
        return;
      }

      // Step 2: No user - redirect to signin
      // (No need to check signup state - signin will handle unverified email redirect)
      if (!user) {
        setAppStatus("unauthenticated");
        setStatusMessage("Please sign in");
        return;
      }

      // Step 3: User exists but might be in signup flow
      // If signup is in progress, route to the saved step.
      if (
        signupState.isSignupInProgress &&
        signupState.currentStep >= 2 &&
        signupState.currentStep <= 6
      ) {
        setAppStatus("signup_incomplete");
        setStatusMessage("Completing your signup...");
        return;
      }

      // Step 4: Wait until profile fetch has started AND completed.
      // profileInitialized is false until the first fetchUserProfile resolves.
      // Without this, profile=null + profileLoading=false (initial state) would
      // incorrectly trigger the "profile_incomplete" branch before fetch even starts.
      if (profileLoading || !profileInitialized) {
        setAppStatus("checking_profile");
        setStatusMessage("Loading your profile...");
        return;
      }

      // Step 5: Check if profile exists
      if (!profile) {
        setAppStatus("profile_incomplete");
        setStatusMessage("Setting up your store...");
        return;
      }

      // Step 6: Check required profile fields
      const isProfileComplete = profile.name && profile.store_username;
      if (!isProfileComplete) {
        setAppStatus("profile_incomplete");
        setStatusMessage("Complete your profile to continue");
        return;
      }

      // All checks passed
      setAppStatus("ready");
      setStatusMessage("Welcome back!");
    };

    determineStatus();
  }, [authLoading, user, profileLoading, profile, signupState, signupLoaded]);

  // Handle redirects based on status
  if (appStatus === "unauthenticated") {
    return <Redirect href="/(auth)/signin" />;
  }

  if (appStatus === "signup_incomplete") {
    if (signupState.currentStep === 2) {
      return <Redirect href="/(auth)/signup-step2" />;
    }
    if (signupState.currentStep === 3) {
      return <Redirect href="/(auth)/signup-step3" />;
    }
    if (signupState.currentStep === 4) {
      return <Redirect href="/(auth)/signup-step4" />;
    }
    if (signupState.currentStep === 5) {
      return <Redirect href="/(auth)/signup-step5" />;
    }
    if (signupState.currentStep === 6) {
      return <Redirect href="/(auth)/signup-step6" />;
    }
    return <Redirect href="/(auth)/signup-step2" />;
  }

  if (appStatus === "profile_incomplete") {
    return <Redirect href={"/(auth)/google-profile-setup" as any} />;
  }

  if (appStatus === "ready") {
    return <Redirect href="/(tabs)" />;
  }

  // Show status screen for all intermediate states
  return (
    <View className="flex-1 bg-[#FAF7F2] justify-center items-center px-8">
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        className="items-center"
      >
        {/* Logo */}
        <View className="w-24 h-24 rounded-full bg-[#3B2F2F] justify-center items-center mb-8">
          <HeadingBoldText style={{ color: "#FFFFFF", fontSize: 32 }}>
            TV
          </HeadingBoldText>
        </View>

        {/* App Name */}
        <HeadingBoldText
          style={{ fontSize: 28, color: "#3B2F2F", marginBottom: 8 }}
        >
          ThriftVerse
        </HeadingBoldText>

        {/* Status Message */}
        <BodyMediumText
          style={{ color: "#6B7280", marginBottom: 24, textAlign: "center" }}
        >
          {statusMessage}
        </BodyMediumText>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#3B2F2F" />
      </Animated.View>
    </View>
  );
}
