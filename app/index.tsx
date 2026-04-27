import { CompleteYourProfileModal } from "@/components/modals/CompleteYourProfileModal";
import { useAppInit } from "@/contexts/AppInitContext";
import { initializeApp, loadFromProfile, setProfile, setUser } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
  const { needsUpdate, versionCheckDone } = useAppInit();
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
  // Wait for both auth init AND version check before proceeding so
  // the splash is never hidden before we know if a force-update is
  // needed. If needsUpdate is true the layout already hid the splash
  // and the ForceUpdateModal is blocking — don't navigate at all.
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!initialized || !versionCheckDone) return;
    if (needsUpdate) return;

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
  }, [appStatus, initialized, profile, versionCheckDone, needsUpdate]);

  // Native splash screen is visible while loading — no custom UI needed.
  // The background color matches the splash so there is no visible flash
  // when the native splash dismisses before the Stack transition completes.
  return (
    <View style={{ flex: 1, backgroundColor: "#C08B7B" }}>
      <CompleteYourProfileModal
        visible={showCompleteProfileModal}
        nextStep={nextSignupStep}
        onClose={() => setShowCompleteProfileModal(false)}
      />
    </View>
  );
}
