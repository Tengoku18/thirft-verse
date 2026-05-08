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
  | "password_recovery"
  | "ready"
  | "unauthenticated";

export default function Index() {
  const dispatch = useAppDispatch();
  const [appStatus, setAppStatus] = useState<AppStatus>("initializing");
  const [initialized, setInitialized] = useState(false);

  // Keep profile reference for routing
  const profile = useAppSelector((state) => state.profile.profile);

  // ──────────────────────────────────────────────────────────────
  // INITIALIZE APP ON MOUNT
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const initApp = async () => {
      try {
        // Dispatch the initialization thunk which fetches user and profile
        const result = await dispatch(initializeApp()).unwrap();

        // Store user and profile in Redux for app-wide access
        if (result.user) {
          dispatch(setUser(result.user));
        }
        if (result.profile) {
          dispatch(setProfile(result.profile));

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
      if (appStatus === "unauthenticated") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/signin");
      } else if (appStatus === "oauth_profile_setup") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/google-profile-setup");
      } else if (appStatus === "signup_incomplete" && profile) {
        const nextStep = Math.min(
          6,
          Math.max(2, (profile.signup_step ?? 1) + 1),
        );
        await SplashScreen.hideAsync();
        router.replace(`/(auth)/signup-step${nextStep}` as any);
      } else if (appStatus === "profile_incomplete") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/google-profile-setup");
      } else if (appStatus === "password_recovery") {
        await SplashScreen.hideAsync();
        router.replace("/(auth)/forgot-password-change");
      } else if (appStatus === "ready") {
        await SplashScreen.hideAsync();
        router.replace("/(tabs)/home");
      }
    };

    navigate();
  }, [appStatus, initialized, profile]);

  // Native splash screen is visible while loading — no custom UI needed
  return <View />;
}
