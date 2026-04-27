import {
  NunitoSans_200ExtraLight,
  NunitoSans_300Light,
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
  NunitoSans_900Black,
} from "@expo-google-fonts/nunito-sans";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

import { ForceUpdateModal } from "@/components/modals/ForceUpdateModal";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  initializePushNotifications,
} from "@/lib/push-notifications";
import { fetchNotifications, fetchUnreadCount, store } from "@/store";
import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

Sentry.init({
  dsn: "https://ab2b2f8db939702cd141915db19a54eb@o4510834233114624.ingest.us.sentry.io/4510834234425344",

  // Only enable Sentry in production
  enabled: !__DEV__,

  sendDefaultPii: true,
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

function handleNotificationNavigation(data: Record<string, string>) {
  if (data?.order_id) {
    router.push(`/order/${data.order_id}` as never);
  }
}

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();

  // Load fonts first — we need fontsLoaded to gate the version check below.
  const [fontsLoaded] = useFonts({
    Folito_300Light: require("../assets/fonts/Folito-Light.ttf"),
    Folito_400Regular: require("../assets/fonts/Folito-Regular.ttf"),
    Folito_500Medium: require("../assets/fonts/Folito-Medium.ttf"),
    Folito_600SemiBold: require("../assets/fonts/Folito-Bold.ttf"),
    Folito_700Bold: require("../assets/fonts/Folito-Bold.ttf"),
    Folito_800ExtraBold: require("../assets/fonts/Folito-Black.ttf"),
    Folito_900Black: require("../assets/fonts/Folito-Black.ttf"),
    NunitoSans_200ExtraLight,
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
  });

  // Gate 1 — OTA: don't start until we know no OTA reload is coming.
  // Gate 2 — fonts: don't start until the app is visually ready.
  // Both must be true before the iTunes/Play Store API is called.
  const [otaReady, setOtaReady] = useState(__DEV__);
  const { needsUpdate, isChecking } = useVersionCheck(fontsLoaded && otaReady);

  // Initialize push notifications on app launch (request permission + get token)
  useEffect(() => {
    initializePushNotifications();
  }, []);

  // Handle notification interactions (foreground, background, quit)
  useEffect(() => {
    // Foreground: when notification arrives while app is open — refresh unread count
    const removeReceived = addNotificationReceivedListener((notification) => {
      console.log("Notification received (foreground):", notification);
      // Refresh unread badge and notification list when a push arrives
      const userId = store.getState().auth.user?.id;
      if (userId) {
        store.dispatch(fetchUnreadCount(userId));
        store.dispatch(fetchNotifications(userId));
      }
    });

    // Background & Quit: when user taps on a notification
    const removeResponse = addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<
          string,
          string
        >;
        handleNotificationNavigation(data);
      },
    );

    return () => {
      removeReceived?.();
      removeResponse?.();
    };
  }, []);

  // Check for OTA updates on app launch (production only).
  // setOtaReady(true) is called only when we're sure no reload will happen,
  // which then unblocks the store-version check above.
  useEffect(() => {
    if (__DEV__) return;

    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          // reloadAsync restarts the JS runtime — execution never reaches here
          // in practice. The explicit return prevents setOtaReady from being
          // called with the old bundle still loaded.
          return;
        }
        // Only reached when no update was applied — safe to start version check.
        setOtaReady(true);
      } catch (error) {
        Sentry.captureException(error);
        // OTA check failed — don't block the version check indefinitely.
        setOtaReady(true);
      }
    }

    checkForUpdates();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ForceUpdateModal visible={!isChecking && needsUpdate} />
      <Provider store={store}>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <StatusBar style="dark" />
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="explore" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
                <Stack.Screen
                  name="settings"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="policies"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal", title: "Modal" }}
                />
                <Stack.Screen
                  name="sold-item/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="product/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="edit-product/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="order/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="notifications"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="offer-code"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="referral-code"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="founder-circle"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="earnings"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="performance"
                  options={{ headerShown: false }}
                />
              </Stack>
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </Provider>
    </SafeAreaProvider>
  );
});
