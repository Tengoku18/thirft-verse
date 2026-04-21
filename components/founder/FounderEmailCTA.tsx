import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

export function FounderEmailCTA() {
  return (
    <View className="mx-4 items-center gap-2">
      <View className="w-16 h-16 bg-brand-tan/10 rounded-full items-center justify-center">
        <IconSymbol name="envelope.fill" size={32} color="#C17A5B" />
      </View>
      <Typography variation="body-sm" className="text-slate-600">
        Check your email for the verification code.
      </Typography>
    </View>
  );
}
