import { TabHeader } from "@/components/navigation/TabHeader";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TabScreenLayoutProps {
  title: string;
  rightComponent?: React.ReactNode;
  children: React.ReactNode;
}

export function TabScreenLayout({
  title,
  rightComponent,
  children,
}: TabScreenLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TabHeader title={title} rightComponent={rightComponent} />
      <View className="flex-1 bg-white">{children}</View>
    </SafeAreaView>
  );
}
