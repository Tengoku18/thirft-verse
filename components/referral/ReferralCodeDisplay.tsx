import { Button } from "@/components/ui/Button/Button";
import { Typography } from "@/components/ui/Typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View } from "react-native";

interface ReferralCodeDisplayProps {
  code: string;
  onCopy: () => void;
  onShare: () => void;
}

export function ReferralCodeDisplay({
  code,
  onCopy,
  onShare,
}: ReferralCodeDisplayProps) {
  return (
    <View className="mx-4 mb-6">
      <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <Typography
          variation="caption"
          className="text-slate-500 font-sans-bold uppercase tracking-widest mb-4"
        >
          Your Referral Code
        </Typography>

        <View className="bg-brand-espresso rounded-2xl p-6 items-center gap-2 mb-6">
          <Typography
            variation="caption"
            className="text-white/70 font-sans-regular text-xs"
          >
            Share This Code
          </Typography>
          <Typography
            variation="h2"
            className="text-white font-folito-bold tracking-widest"
          >
            {code}
          </Typography>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label="Copy"
              onPress={onCopy}
              variant="primary"
              size="compact"
              icon={<Ionicons name="copy" size={16} color="white" />}
              iconPosition="left"
            />
          </View>
          <View className="flex-1">
            <Button
              label="Share"
              onPress={onShare}
              variant="secondary"
              size="compact"
              icon={<Ionicons name="share-social" size={16} color="#3B2F2F" />}
              iconPosition="left"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
