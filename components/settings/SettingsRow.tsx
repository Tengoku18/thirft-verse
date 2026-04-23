import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Pressable, View } from "react-native";

interface SettingsRowProps {
  icon: string;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightContent?: React.ReactNode;
  destructive?: boolean;
}

export function SettingsRow({
  icon,
  label,
  onPress,
  showChevron = true,
  rightContent,
  destructive = false,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-3.5 active:bg-brand-espresso/5"
    >
      <View className="flex-row items-center gap-4 flex-1">
        <IconSymbol
          name={icon as any}
          size={20}
          color={destructive ? "#DC2626" : "#3B3030"}
          style={{ opacity: destructive ? 1 : 0.55 }}
        />
        <Typography
          variation="body"
          className={
            destructive
              ? "text-red-600 font-sans-semibold"
              : "text-brand-espresso font-sans-semibold"
          }
        >
          {label}
        </Typography>
      </View>

      {rightContent ? (
        rightContent
      ) : showChevron ? (
        <IconSymbol
          name="chevron.right"
          size={16}
          color="#3B3030"
          style={{ opacity: 0.3 }}
        />
      ) : null}
    </Pressable>
  );
}
