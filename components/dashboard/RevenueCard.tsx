import {
  BodyMediumText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Text, View } from "react-native";

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
            <BodyMediumText
              style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}
            >
              Available Balance
            </BodyMediumText>
            <HeadingBoldText
              style={{ color: "#FFFFFF", fontSize: 32, marginTop: 4 }}
            >
              {formatCurrency(availableBalance)}
            </HeadingBoldText>
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
              <IconSymbol name="clock.fill" size={16} color="#F59E0B" />
            </View>
            <View>
              <HeadingBoldText style={{ color: "#FFFFFF", fontSize: 16 }}>
                {formatCurrency(pendingAmount)}
              </HeadingBoldText>
              <BodyMediumText
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
              >
                Pending
              </BodyMediumText>
            </View>
          </View>

          <View className="w-px h-10 bg-white/10 mx-4" />

          <View className="flex-1 flex-row items-center">
            <View
              className="w-8 h-8 rounded-lg items-center justify-center mr-2"
              style={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }}
            >
              <IconSymbol name="arrow.up.circle.fill" size={16} color="#A78BFA" />
            </View>
            <View>
              <HeadingBoldText style={{ color: "#FFFFFF", fontSize: 16 }}>
                {formatCurrency(withdrawnAmount)}
              </HeadingBoldText>
              <BodyMediumText
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
              >
                Withdrawn
              </BodyMediumText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
