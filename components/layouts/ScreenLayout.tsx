import { ScreenHeader } from "@/components/navigation/ScreenHeader";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

interface ScreenLayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  backRoute?: string;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  contentBackgroundColor?: string;
  onRefresh?: () => Promise<void>;
  scrollEnabled?: boolean;
  headerBackgroundColor?: string;
  paddingHorizontal?: number;
}

/**
 * Reusable screen layout with:
 * - Header with back button and centered title
 * - Keyboard avoidance
 * - ScrollView with refresh control
 * - Safe area handling
 *
 * Usage:
 * ```tsx
 * <ScreenLayout
 *   title="Settings"
 *   onRefresh={handleRefresh}
 * >
 *   <View>Your content here</View>
 * </ScreenLayout>
 * ```
 */
export function ScreenLayout({
  title,
  children,
  showBackButton = true,
  backRoute,
  rightComponent,
  backgroundColor = "#FAFAFA",
  contentBackgroundColor = "#FAFAFA",
  onRefresh,
  scrollEnabled = true,
  headerBackgroundColor = "#FFFFFF",
  paddingHorizontal = 16,
}: ScreenLayoutProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      {/* Header */}
      <ScreenHeader
        title={title}
        showBackButton={showBackButton}
        backRoute={backRoute}
        rightComponent={rightComponent}
        backgroundColor={headerBackgroundColor}
      />

      {/* Keyboard Avoidance View */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Scrollable Content */}
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal,
            paddingBottom: 100,
          }}
          style={{ backgroundColor: contentBackgroundColor }}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#3B2F2F"
                progressBackgroundColor="#FFFFFF"
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
