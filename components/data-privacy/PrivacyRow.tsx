import { Typography } from "@/components/ui/Typography";
import ChevronRightIcon from "@/components/icons/ChevronRightIcons";
import React from "react";
import { Pressable, View } from "react-native";

export interface PrivacyRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
  right?: React.ReactNode;
  destructive?: boolean;
}

export function PrivacyRow({
  icon,
  title,
  subtitle,
  onPress,
  right,
  destructive = false,
}: PrivacyRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center px-4 py-4 active:bg-brand-espresso/5"
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mr-3"
        style={{
          backgroundColor: destructive
            ? "rgba(220,38,38,0.08)"
            : "rgba(59,48,48,0.07)",
        }}
      >
        {icon}
      </View>

      <View className="flex-1">
        <Typography
          variation="body"
          className={
            destructive
              ? "text-red-600 font-sans-semibold"
              : "text-brand-espresso font-sans-semibold"
          }
        >
          {title}
        </Typography>
        <Typography variation="body-sm" className="text-slate-400 mt-0.5">
          {subtitle}
        </Typography>
      </View>

      {right !== undefined ? right : (
        onPress ? (
          <ChevronRightIcon
            width={16}
            height={16}
            color={destructive ? "#DC2626" : "#3B3030"}
            style={{ opacity: destructive ? 0.5 : 0.25 }}
          />
        ) : null
      )}
    </Pressable>
  );
}
