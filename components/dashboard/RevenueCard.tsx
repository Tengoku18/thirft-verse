import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Text, View } from "react-native";
import { ArrowUpCircleFillIcon, ClockIcon } from "@/components/icons";

interface RevenueCardProps {
  availableBalance: number;
  pendingAmount: number;
  withdrawnAmount: number;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  availableBalance,
  pendingAmount,
  withdrawnAmount,
}) => {
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `Rs. ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <View className="px-4 pt-2 pb-4">
      <View
        className="rounded-3xl p-5"
        style={{
          backgroundColor: "#3B2F2F",
          shadowColor: "#3B2F2F",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Typography
              variation="body-sm"
              style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}
            >
              Available Balance
            </Typography>
            <Typography
              variation="h2"
              style={{ color: "#FFFFFF", fontSize: 32, marginTop: 4 }}
            >
              {formatCurrency(availableBalance)}
            </Typography>
          </View>
          <View
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700" }}>
              रु
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mt-4 pt-4 border-t border-white/10">
          <View className="flex-1 flex-row items-center">
            <View
              className="w-8 h-8 rounded-lg items-center justify-center mr-2"
              style={{ backgroundColor: "rgba(245, 158, 11, 0.2)" }}
            >
              <ClockIcon width={16} height={16} color="#F59E0B" />
            </View>
            <View>
              <Typography variation="h2" style={{ color: "#FFFFFF", fontSize: 16 }}>
                {formatCurrency(pendingAmount)}
              </Typography>
              <Typography
                variation="body-sm"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
              >
                Pending
              </Typography>
            </View>
          </View>

          <View className="w-px h-10 bg-white/10 mx-4" />

          <View className="flex-1 flex-row items-center">
            <View
              className="w-8 h-8 rounded-lg items-center justify-center mr-2"
              style={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }}
            >
              <ArrowUpCircleFillIcon width={16} height={16} color="#A78BFA" />
            </View>
            <View>
              <Typography variation="h2" style={{ color: "#FFFFFF", fontSize: 16 }}>
                {formatCurrency(withdrawnAmount)}
              </Typography>
              <Typography
                variation="body-sm"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
              >
                Withdrawn
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
