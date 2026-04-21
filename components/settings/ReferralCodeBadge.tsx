import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface ReferralCodeBadgeProps {
  code: string;
}

export function ReferralCodeBadge({ code }: ReferralCodeBadgeProps) {
  return (
    <View className="bg-brand-off-white px-2.5 py-1 rounded-lg border border-brand-beige">
      <Typography variation="caption" className="text-brand-espresso/50 font-sans-bold tracking-widest uppercase">
        {code}
      </Typography>
    </View>
  );
}
