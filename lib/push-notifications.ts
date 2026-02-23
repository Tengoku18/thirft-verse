import { supabase } from "@/lib/supabase";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Detect if running in Expo Go on Android (push not supported since SDK 53)
const isAndroidExpoGo =
  Platform.OS === "android" &&
  Constants.executionEnvironment === "storeClient";

// Lazy-load expo-notifications only when supported.
// Using conditional require() instead of static import prevents the module
// from initializing on Android Expo Go, which would throw an error.
type NotificationsModule = typeof import("expo-notifications");
let _notifications: NotificationsModule | null = null;

function getNotifications(): NotificationsModule | null {
  if (!_notifications && !isAndroidExpoGo) {
    _notifications = require("expo-notifications") as NotificationsModule;
  }
  return _notifications;
}

// Configure how notifications are handled when app is in foreground
const Notifications = getNotifications();
if (Notifications) {
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
      const Notif = getNotifications();

      // Push notifications not supported on Android Expo Go (SDK 53+)
      if (!Notif) {
        console.log("Push notifications not supported in this environment");
        return null;
      }

      // Push notifications don't work on iOS simulator
      if (!Device.isDevice && Platform.OS === "ios") {
        console.log("Push notifications not supported on iOS Simulator");
        return null;
      }

      // Request permissions
      const { status: existingStatus } =
        await Notif.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notif.requestPermissionsAsync();
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

      const { data: token } = await Notif.getExpoPushTokenAsync({
        projectId,
      });

      console.log("Push token ready:", token);

      // Set up Android notification channels
      if (Platform.OS === "android") {
        await Notif.setNotificationChannelAsync("orders", {
          name: "Order Updates",
          importance: Notif.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
        });

        await Notif.setNotificationChannelAsync("default", {
          name: "General",
          importance: Notif.AndroidImportance.DEFAULT,
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
 * Subscribe to foreground notification events.
 * Returns a cleanup function, or null if notifications are unsupported.
 */
export function addNotificationReceivedListener(
  callback: (notification: import("expo-notifications").Notification) => void
): (() => void) | null {
  const Notif = getNotifications();
  if (!Notif) return null;
  const sub = Notif.addNotificationReceivedListener(callback);
  return () => sub.remove();
}

/**
 * Subscribe to notification response events (user tapped a notification).
 * Returns a cleanup function, or null if notifications are unsupported.
 */
export function addNotificationResponseReceivedListener(
  callback: (
    response: import("expo-notifications").NotificationResponse
  ) => void
): (() => void) | null {
  const Notif = getNotifications();
  if (!Notif) return null;
  const sub = Notif.addNotificationResponseReceivedListener(callback);
  return () => sub.remove();
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
