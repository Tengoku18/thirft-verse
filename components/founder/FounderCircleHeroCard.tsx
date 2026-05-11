import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

export function FounderCircleHeroCard() {
  return (
    <View className="mt-2 mb-6 mx-4">
      <View className="bg-brand-espresso rounded-3xl p-6 gap-3">
        <View className="flex-1">
          <Typography
            variation="h3"
            className="text-white font-folito-bold mb-1"
          >
            Join the Inner Circle
          </Typography>
          <Typography
            variation="body-sm"
            className="text-white/75 leading-relaxed"
          >
            Become a verified member of the Thriftverse Founder Circle. Two
            tracks — Founding Seller and Founding Creator — each with exclusive
            perks, priority exposure, and permanent Founder status.
          </Typography>
        </View>

        <View className="flex-row gap-2 flex-wrap pt-2">
          <View className="px-3 py-2 bg-white/15 rounded-full border border-white/25">
            <Typography
              variation="caption"
              className="text-white font-sans-semibold uppercase tracking-widest text-xs"
            >
              Exclusive Badge
            </Typography>
          </View>
          <View className="px-3 py-2 bg-white/15 rounded-full border border-white/25">
            <Typography
              variation="caption"
              className="text-white font-sans-semibold uppercase tracking-widest text-xs"
            >
              Order Protection
            </Typography>
          </View>
          <View className="px-3 py-2 bg-white/15 rounded-full border border-white/25">
            <Typography
              variation="caption"
              className="text-white font-sans-semibold uppercase tracking-widest text-xs"
            >
              20% Profit Share
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
}
