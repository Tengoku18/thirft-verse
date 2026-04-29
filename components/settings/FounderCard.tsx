import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Pressable, View } from "react-native";
import { CheckmarkSealFillIcon, RightArrowIcon } from "@/components/icons";

interface FounderCardProps {
  onViewBenefits?: () => void;
}

export function FounderCard({ onViewBenefits }: FounderCardProps) {
  return (
    <View className="bg-white rounded-2xl p-5 border border-brand-beige/60 shadow-sm gap-4">
      {/* Header row */}
      <View className="flex-row items-start justify-between">
        <View className="gap-1 flex-1">
          <View className="flex-row items-center gap-2">
            <Typography variation="h4" className="text-brand-espresso font-folito-bold">
              Founder Dashboard
            </Typography>
            {/* Elite badge */}
            <View className="bg-brand-tan/10 border border-brand-tan/30 rounded-full px-2 py-0.5">
              <Typography variation="caption" className="text-brand-tan font-sans-bold uppercase tracking-widest">
                Elite
              </Typography>
            </View>
          </View>
          <Typography variation="body-sm" className="text-ui-secondary">
            Manage your premium archival tools
          </Typography>
        </View>

        {/* Verified icon */}
        <View className="w-9 h-9 bg-brand-espresso/5 rounded-xl items-center justify-center">
          <CheckmarkSealFillIcon width={20} height={20} color="#3B3030" />
        </View>
      </View>

      {/* View benefits row */}
      <Pressable
        onPress={onViewBenefits}
        className="flex-row items-center justify-between py-3 px-4 bg-brand-espresso/[0.03] rounded-xl border border-brand-espresso/5 active:opacity-80"
      >
        <Typography variation="caption" className="text-brand-espresso/70 font-sans-bold uppercase tracking-widest">
          View Founder Benefits
        </Typography>
        <RightArrowIcon width={16} height={16} color="#3B3030" style={{ opacity: 0.4 }} />
      </Pressable>
    </View>
  );
}
