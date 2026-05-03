import { Typography } from "@/components/ui/Typography";
import { renderSFSymbolIcon } from "@/lib/icon-mapper";
import React from "react";
import { Pressable, Switch, View } from "react-native";

interface SettingsToggleRowProps {
  icon: string;
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export function SettingsToggleRow({
  icon,
  label,
  value,
  onValueChange,
}: SettingsToggleRowProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className="flex-row items-center justify-between px-4 py-3.5"
    >
      <View className="flex-row items-center gap-4 flex-1">
        <View style={{ opacity: 0.55 }}>
          {renderSFSymbolIcon(icon, { size: 20, color: "#3B3030" })}
        </View>
        <Typography
          variation="body"
          className="text-brand-espresso font-sans-semibold"
        >
          {label}
        </Typography>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E1DA", true: "#3B3030" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E1DA"
      />
    </Pressable>
  );
}
