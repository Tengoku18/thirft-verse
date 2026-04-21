import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface ReferralStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function ReferralStatCard({
  label,
  value,
  icon,
}: ReferralStatCardProps) {
  return (
    <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-200 items-center gap-2">
      {icon && <View>{icon}</View>}
      <Typography
        variation="body-sm"
        className="text-slate-500 font-sans-medium text-xs"
      >
        {label}
      </Typography>
      <Typography
        variation="h4"
        className="text-brand-espresso font-folito-bold"
      >
        {value}
      </Typography>
    </View>
  );
}
