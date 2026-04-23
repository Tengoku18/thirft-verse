import React from "react";
import { View } from "react-native";

interface SettingsCardProps {
  children: React.ReactNode;
}

export function SettingsCard({ children }: SettingsCardProps) {
  return (
    <View className="bg-white rounded-2xl overflow-hidden border border-brand-beige/60 shadow-sm">
      {children}
    </View>
  );
}

export function SettingsDivider() {
  return <View className="h-px bg-brand-beige/60 mx-4" />;
}
