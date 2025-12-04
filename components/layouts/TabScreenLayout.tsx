import { TabHeader } from "@/components/navigation/TabHeader";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TabScreenLayoutProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  stickyComponent?: React.ReactNode;
  showDefaultIcons?: boolean;
  showHeader?: boolean;
  statusBarColor?: string;
  children: React.ReactNode;
}

export function TabScreenLayout({
  title,
  showBackButton = false,
  onBack,
  rightComponent,
  stickyComponent,
  showDefaultIcons = true,
  showHeader = true,
  statusBarColor,
  children,
}: TabScreenLayoutProps) {
  // Use provided color, or default based on whether header is shown
  const safeAreaBgColor = statusBarColor ?? (showHeader ? "#3B2F2F" : "#FFFFFF");

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: safeAreaBgColor }} edges={["top"]}>
      {showHeader && (
        <TabHeader
          title={title}
          showBackButton={showBackButton}
          onBack={onBack}
          rightComponent={rightComponent}
          showDefaultIcons={showDefaultIcons}
        />
      )}
      {stickyComponent && (
        <View style={{ backgroundColor: safeAreaBgColor }}>
          {stickyComponent}
        </View>
      )}
      <View className="flex-1 bg-white">{children}</View>
    </SafeAreaView>
  );
}
