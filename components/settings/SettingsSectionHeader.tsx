import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface SettingsSectionHeaderProps {
  title: string;
}

export function SettingsSectionHeader({ title }: SettingsSectionHeaderProps) {
  return (
    <View className="px-1 mb-2">
      <Typography
        variation="caption"
        className="text-ui-secondary uppercase tracking-widest font-sans-bold"
      >
        {title}
      </Typography>
    </View>
  );
}
