import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";
import { StarIcon } from "@/components/icons";

export function FounderBadgePreview() {
  return (
    <View className="mb-8 mx-4">
      <Typography
        variation="caption"
        className="text-slate-500 font-sans-bold uppercase tracking-widest mb-4 px-4"
      >
        Your Founder Badge
      </Typography>
      <View className="items-center gap-2">
        <View className="w-24 h-24 rounded-full bg-gradient-to-b from-brand-tan to-brand-tan/80 items-center justify-center shadow-md overflow-hidden">
          <View className="items-center gap-1">
            <StarIcon width={32} height={32} color="white" />
            <Typography
              variation="caption"
              className="text-white font-sans-bold text-xs"
            >
              FOUNDER
            </Typography>
          </View>
        </View>
        <Typography variation="caption" className="text-slate-400 mt-2">
          Preview of your Founder Badge
        </Typography>
      </View>
    </View>
  );
}
