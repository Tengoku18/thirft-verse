import { supabase } from "@/lib/supabase";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Detect if running in Expo Go on Android (push not supported since SDK 53)
const isAndroidExpoGo =
  Platform.OS === "android" &&
  Constants.executionEnvironment === "storeClient";

// Configure how notifications are handled when app is in foreground
if (!isAndroidExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Shared promise — ensures initialization only runs once
let tokenPromise: Promise<string | null> | null = null;

/**
 * Core init logic — requests permission, gets token, sets up channels.
 * Only runs once; subsequent calls return the same promise.
 */
function getOrInitToken(): Promise<string | null> {
  if (!tokenPromise) {
    tokenPromise = (async () => {
      // Push notifications not supported on Android Expo Go (SDK 53+)
      if (isAndroidExpoGo) {
        console.log("Push notifications not supported on Android Expo Go");
        return null;
      }

      // Push notifications don't work on iOS simulator
      if (!Device.isDevice && Platform.OS === "ios") {
        console.log("Push notifications not supported on iOS Simulator");
        return null;
      }

      // Request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Push notification permission not granted");
        return null;
      }

      // Get the Expo push token
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        "6c1851d4-a94c-42f6-942c-c2d2f223aaa8";

      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      console.log("Push token ready:", token);

      // Set up Android notification channels
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("orders", {
          name: "Order Updates",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
        });

        await Notifications.setNotificationChannelAsync("default", {
          name: "General",
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: "default",
        });
      }

      return token;
    })();
  }
  return tokenPromise;
}

/**
 * Call on app launch (in _layout.tsx).
 * Requests permission + gets token + sets up Android channels.
 */
export async function initializePushNotifications(): Promise<void> {
  await getOrInitToken();
}

/**
 * Call on login — appends this device's token to the user's token array.
 * Awaits initialization if it hasn't completed yet.
 */
export async function savePushTokenToProfile(
  userId: string
): Promise<void> {
  // Wait for token to be ready (handles race condition)
  const token = await getOrInitToken();

  if (!token) {
    console.log("No push token available to save");
    return;
  }

  // Fetch existing tokens
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("expo_push_tokens")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.error("Failed to fetch profile for push token:", fetchError);
    return;
  }

  const existingTokens: string[] = profile?.expo_push_tokens ?? [];

  // Skip if this token is already registered
  if (existingTokens.includes(token)) {
    console.log("Push token already registered for this device");
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ expo_push_tokens: [...existingTokens, token] })
    .eq("id", userId);

  if (error) {
    console.error("Failed to save push token:", error);
  } else {
    console.log("Push token added to profile");
  }
}

/**
 * Call on logout — removes only this device's token from the array.
 */
export async function unregisterPushToken(userId: string): Promise<void> {
  // Wait for token to be ready
  const token = await getOrInitToken();

  if (!token) {
    console.log("No push token to unregister");
    return;
  }

  // Fetch existing tokens
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("expo_push_tokens")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.error("Failed to fetch profile for token removal:", fetchError);
    return;
  }

  const existingTokens: string[] = profile?.expo_push_tokens ?? [];
  const updatedTokens = existingTokens.filter((t) => t !== token);

  const { error } = await supabase
    .from("profiles")
    .update({ expo_push_tokens: updatedTokens })
    .eq("id", userId);

  if (error) {
    console.error("Failed to remove push token:", error);
  } else {
    console.log("Push token removed from profile");
  }
}
