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
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { store } from "@/store";
import { Provider } from "react-redux";

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    // Folito fonts for headings (loaded from local assets)
    Folito_300Light: require("../assets/fonts/Folito-Light.ttf"),
    Folito_400Regular: require("../assets/fonts/Folito-Regular.ttf"),
    Folito_500Medium: require("../assets/fonts/Folito-Medium.ttf"),
    Folito_600SemiBold: require("../assets/fonts/Folito-Bold.ttf"), // Using Bold as SemiBold
    Folito_700Bold: require("../assets/fonts/Folito-Bold.ttf"),
    Folito_800ExtraBold: require("../assets/fonts/Folito-Black.ttf"), // Using Black as ExtraBold
    Folito_900Black: require("../assets/fonts/Folito-Black.ttf"),
    // Nunito Sans fonts for body text
    NunitoSans_200ExtraLight,
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="explore" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="policies" options={{ headerShown: false }} />
            <Stack.Screen
              name="edit-profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="change-password"
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
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
