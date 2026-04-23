import { Stack } from "expo-router";

export default function PerformanceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="top-selling" options={{ headerShown: false }} />
    </Stack>
  );
}
