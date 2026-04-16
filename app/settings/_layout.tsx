import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen name="founder-circle" options={{ headerShown: false }} />
      <Stack.Screen name="help-support" options={{ headerShown: false }} />
      <Stack.Screen name="referral-code" options={{ headerShown: false }} />
      <Stack.Screen name="faq-category" options={{ headerShown: false }} />
      <Stack.Screen name="faq-detail" options={{ headerShown: false }} />
      <Stack.Screen name="report-issue" options={{ headerShown: false }} />
      <Stack.Screen name="offer-code" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="payment-method" options={{ headerShown: false }} />
    </Stack>
  );
}
