import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface RevenueStatCardProps {
  label: string;
  amount: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  labelColor: string;
}

export const RevenueStatCard: React.FC<RevenueStatCardProps> = ({
  label,
  amount,
  icon,
  bgColor,
  borderColor,
  labelColor,
}) => {
  return (
    <View
      className="flex-1 p-4 rounded-2xl"
      style={{
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <View className="mb-2">{icon}</View>
      <Typography
        variation="body-xs"
        className="tracking-wider uppercase !font-sans-bold"
      >
        {label}
      </Typography>
      <Typography
        variation="h4"
        numberOfLines={1}
        className="text-primary !font-extrabold mt-2"
      >
        {amount}
      </Typography>
    </View>
  );
};
