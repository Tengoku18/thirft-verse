import { Typography } from "@/components/ui/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { TagFillIcon } from "@/components/icons";

interface OfferCodeCardProps {
  code: string;
  subtitle?: string;
  onPress?: () => void;
}

export function OfferCodeCard({
  code,
  subtitle = "Active on all vintage items",
  onPress,
}: OfferCodeCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="bg-white rounded-2xl p-4 border border-brand-beige/60 shadow-sm flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-4 flex-1">
        <View style={{ opacity: 0.55 }}>
          <TagFillIcon width={20} height={20} color="#3B3030" />
        </View>
        <View className="gap-0.5">
          <Typography
            variation="body"
            className="text-brand-espresso font-sans-semibold"
          >
            Offer Code
          </Typography>
          <Typography variation="body-xs" className="text-ui-secondary">
            {subtitle}
          </Typography>
        </View>
      </View>

      {/* Code chip */}
      <View className="bg-brand-off-white px-3 py-1.5 rounded-xl border border-brand-tan/30">
        <Typography
          variation="label"
          className="text-brand-espresso font-sans-bold tracking-widest"
        >
          {code}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
