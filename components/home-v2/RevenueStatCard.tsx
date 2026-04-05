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
      className="flex-1 p-3 rounded-2xl"
      style={{
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <View style={{ marginBottom: 8 }}>{icon}</View>
      <Typography
        variation="caption"
        style={{
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.5,
          color: labelColor,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        variation="h5"
        numberOfLines={1}
        style={{ fontSize: 16, color: "#3B2F2F", marginTop: 2 }}
      >
        {amount}
      </Typography>
    </View>
  );
};
