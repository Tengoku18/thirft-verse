import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface HelpFooterProps {
  version?: string;
  subtitle?: string;
}

export function HelpFooter({
  version = "v2.4.0 (Vintage Edition)",
  subtitle = "Made with ♡ for pre-loved pieces",
}: HelpFooterProps) {
  return (
    <View className="items-center pb-8 gap-1">
      <Typography
        variation="caption"
        className="text-slate-400 font-sans-medium text-xs"
      >
        Thriftverse {version}
      </Typography>
      <Typography
        variation="caption"
        className="text-slate-300 font-sans-regular text-[10px]"
      >
        {subtitle}
      </Typography>
    </View>
  );
}
