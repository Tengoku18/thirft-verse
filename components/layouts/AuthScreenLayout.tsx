import BackIcon from "@/components/icons/BackIcon";
import { Typography } from "@/components/ui/Typography/Typography";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StatusBarStyle,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthScreenLayoutProps {
  children: React.ReactNode;
  statusBarStyle?: StatusBarStyle;
  backgroundColor?: string;
  showScrollView?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  headerAlignment?: "center" | "left";
  showBackButton?: boolean;
  onBack?: () => void;
}

/**
 * AuthScreenLayout Component
 *
 * A reusable layout wrapper for authentication screens that handles:
 * - KeyboardAvoidingView for proper keyboard handling on iOS/Android
 * - SafeAreaView for safe area insets (notches, home indicators, etc.)
 * - ScrollView for scrollable content (optional)
 * - StatusBar configuration
 * - Optional header with back button and title
 *
 * This component provides consistent layout structure across all auth screens
 * (signin, signup, forgot-password, etc.) without repeating boilerplate code.
 *
 * Usage for screens with simple content (no sticky buttons):
 * - Set showScrollView={true} (default) to wrap content in ScrollView
 * - The entire screen will be scrollable
 *
 * Usage for screens with sticky buttons (bottom-fixed elements):
 * - Set showScrollView={false} to disable the default ScrollView
 * - Manage your own ScrollView inside for content-only scrolling
 * - Button stays fixed at the bottom while content scrolls
 *
 * Example: screens/signup-step2, signup-step3 use showScrollView={false}
 */
export function AuthScreenLayout({
  children,
  statusBarStyle = "dark-content",
  backgroundColor = "#FAF7F2",
  showScrollView = true,
  showHeader = false,
  headerTitle = "",
  headerAlignment = "left",
  showBackButton = true,
  onBack,
}: AuthScreenLayoutProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor }}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />

      {/* Header Section */}
      {showHeader && (
        <View
          className="flex-row items-center px-4 py-3"
          style={{ backgroundColor }}
        >
          {/* Back Button - Fixed Left Space */}
          <View className="w-6">
            {showBackButton && (
              <Pressable onPress={handleBackPress}>
                <BackIcon width={24} height={24} />
              </Pressable>
            )}
          </View>

          {/* Title - Centered with flex-1 on both sides */}
          <View className="flex-1 px-4 items-center justify-center">
            <Typography variation="h3" className="text-black font-sans-bold">
              {headerTitle}
            </Typography>
          </View>

          {/* Right Spacer - Balance the back button */}
          <View className="w-6" />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {showScrollView ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-grow"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AuthScreenLayout;
