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
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { PostHogSync } from "@/components/analytics/PostHogSync";
import { ForceUpdateModal } from "@/components/modals/ForceUpdateModal";
import { NotificationSync } from "@/components/notifications/NotificationSync";
import { TourOverlay } from "@/components/organisms/TourOverlay";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { TourProvider } from "@/contexts/TourContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppUpdate } from "@/hooks/useAppUpdate";
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  initializePushNotifications,
} from "@/lib/push-notifications";
import { fetchNotifications, fetchUnreadCount, hydrateHomeMode, store } from "@/store";
import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";
import { PostHogProvider } from "posthog-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  if (data?.href) {
    router.push(data.href as never);
  } else if (data?.order_id) {
    router.push(`/order/${data.order_id}` as never);
  } else if (data?.product_id) {
    router.push(`/product/${data.product_id}` as never);
  }
}

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();

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

  // Initialize push notifications on app launch (request permission + get token)
  useEffect(() => {
    initializePushNotifications();
  }, []);

  // Hydrate persisted UI preferences (e.g. home buyer/seller mode) once at launch
  useEffect(() => {
    store.dispatch(hydrateHomeMode());
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
  useEffect(() => {
    if (__DEV__) return;

    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // Download failures are non-fatal — app continues with existing bundle
        Sentry.captureException(error);
      }
    }

    checkForUpdates();
  }, []);

  // Start version check once fonts are ready so the modal can render if needed
  const appUpdate = useAppUpdate(fontsLoaded);
  console.log({
    appUpdate,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PostHogProvider
          apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY!}
          options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}
        >
          <Provider store={store}>
            <PostHogSync />
            <AuthProvider>
              <ToastProvider>
                <NotificationSync />
              <TourProvider>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <StatusBar style="dark" />
                  <Stack
                    screenOptions={{
                      contentStyle: { backgroundColor: "#C08B7B" },
                    }}
                  >
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="explore"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="profile"
                      options={{ headerShown: false }}
                    />
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
                  <ForceUpdateModal
                    visible={appUpdate.isVisible}
                    currentVersion={appUpdate.currentVersion}
                    latestVersion={appUpdate.latestVersion}
                    onUpdate={appUpdate.openStore}
                  />
                </ThemeProvider>
                <TourOverlay />
              </TourProvider>
              </ToastProvider>
            </AuthProvider>
          </Provider>
        </PostHogProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});
