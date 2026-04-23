import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

export function ReferralHeroSection() {
  return (
    <View className="mx-4 mb-6">
      <View className="bg-brand-espresso rounded-3xl p-6 gap-3 overflow-hidden relative shadow-sm">
        <View className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl">
          <View className="w-full h-full bg-brand-tan rounded-full" />
        </View>

        <View className="relative z-10">
          <Typography
            variation="h3"
            className="text-white font-folito-bold mb-2"
          >
            Earn with Referrals
          </Typography>
          <Typography
            variation="body-sm"
            className="text-white/75 leading-relaxed"
          >
            Share your referral code and earn commissions on every successful
            sale from your network.
          </Typography>
        </View>
      </View>
    </View>
  );
}
