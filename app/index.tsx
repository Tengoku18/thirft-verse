import { initializeApp, loadFromProfile, setProfile, setUser } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CompleteYourProfileModal } from "@/components/modals/CompleteYourProfileModal";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";

type AppStatus =
  | "initializing"
  | "oauth_profile_setup"
  | "signup_incomplete"
  | "profile_incomplete"
  | "ready"
  | "unauthenticated";

export default function Index() {
  const dispatch = useAppDispatch();
  const [appStatus, setAppStatus] = useState<AppStatus>("initializing");
  const [initialized, setInitialized] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [nextSignupStep, setNextSignupStep] = useState(2);

  // Keep profile reference for routing
  const profile = useAppSelector((state) => state.profile.profile);

  // ──────────────────────────────────────────────────────────────
  // INITIALIZE APP ON MOUNT
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("\n🎯 Calling initialization thunk from Index...\n");

        // Dispatch the initialization thunk which fetches user and profile
        const result = await dispatch(initializeApp()).unwrap();

        console.log(`\n📍 Initialization complete. Status: ${result.status}\n`);

        // Store user and profile in Redux for app-wide access
        if (result.user) {
          dispatch(setUser(result.user));
        }
        if (result.profile) {
          dispatch(setProfile(result.profile));
          // Load profile data into signup Redux slice for form restoration on back navigation
          console.log(
            "[Index] Loading profile data into signup Redux:",
            result.profile.store_username,
          );
          dispatch(loadFromProfile(result.profile));
        }

        setAppStatus(result.status as AppStatus);
        setInitialized(true);
      } catch (error) {
        console.error("❌ Initialization failed:", error);
        setAppStatus("unauthenticated");
        setInitialized(true);
      }
    };

    initApp();
  }, [dispatch]);

  // ──────────────────────────────────────────────────────────────
  // NAVIGATE BASED ON APP STATUS
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!initialized) return;

    const navigate = async () => {
      console.log(`\n🚦 Navigating based on status: ${appStatus}\n`);

      if (appStatus === "unauthenticated") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/signin");
      } else if (appStatus === "oauth_profile_setup") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/google-profile-setup");
      } else if (appStatus === "signup_incomplete" && profile) {
        // Show "Complete Your Profile" modal, then redirect to next incomplete step
        const nextStep = Math.min(
          6,
          Math.max(2, (profile.signup_step ?? 1) + 1),
        );
        setNextSignupStep(nextStep);
        setShowCompleteProfileModal(true);
        await SplashScreen.hideAsync();
      } else if (appStatus === "profile_incomplete") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/google-profile-setup");
      } else if (appStatus === "ready") {
        await SplashScreen.hideAsync();
        router.replace("/(tabs)/home");
      }
    };

    navigate();
  }, [appStatus, initialized, profile]);

  // Native splash screen is visible while loading — no custom UI needed
  return (
    <View>
      <CompleteYourProfileModal
        visible={showCompleteProfileModal}
        nextStep={nextSignupStep}
        onClose={() => setShowCompleteProfileModal(false)}
      />
    </View>
  );
}
