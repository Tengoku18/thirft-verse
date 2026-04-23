import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface FounderStatusSectionProps {
  isCreator: boolean;
  isSeller: boolean;
}

export function FounderStatusSection({
  isCreator,
  isSeller,
}: FounderStatusSectionProps) {
  return (
    <View className="mb-6 mx-4 gap-3">
      <View className="bg-green-50 border border-green-200 rounded-2xl p-4 flex-row items-center gap-3">
        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
          <IconSymbol name="checkmark.circle.fill" size={24} color="#059669" />
        </View>
        <View className="flex-1">
          <Typography
            variation="body-sm"
            className="text-green-900 font-sans-bold"
          >
            Founder Verified
          </Typography>
          <Typography variation="caption" className="text-green-700 mt-0.5">
            You are already a verified founder member
          </Typography>
        </View>
      </View>

      <View className="flex-row gap-3">
        {isCreator && (
          <View className="flex-1 bg-white rounded-2xl p-4 border border-brand-beige/40 items-center gap-2">
            <View className="w-12 h-12 bg-brand-tan/10 rounded-xl items-center justify-center">
              <IconSymbol name="sparkles" size={24} color="#C17A5B" />
            </View>
            <Typography
              variation="body-sm"
              className="text-brand-espresso font-sans-bold text-center"
            >
              Creator
            </Typography>
            <Typography
              variation="caption"
              className="text-slate-500 text-center text-xs"
            >
              For content creators
            </Typography>
          </View>
        )}

        {isSeller && (
          <View className="flex-1 bg-white rounded-2xl p-4 border border-brand-beige/40 items-center gap-2">
            <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center">
              <IconSymbol name="bag.fill" size={24} color="#3B82F6" />
            </View>
            <Typography
              variation="body-sm"
              className="text-brand-espresso font-sans-bold text-center"
            >
              Seller
            </Typography>
            <Typography
              variation="caption"
              className="text-slate-500 text-center text-xs"
            >
              For marketplace sellers
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
}
