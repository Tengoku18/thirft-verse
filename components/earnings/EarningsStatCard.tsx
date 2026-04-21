import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { View } from "react-native";
import {
  BodySmallSemiboldText,
  BodyMediumText,
  HeadingBoldText,
  CaptionText,
} from "@/components/Typography";

interface EarningsStatCardProps {
  label: string;
  amount: number;
  description: string;
  backgroundColor: string;
  iconName: string;
  iconColor?: string;
}

const formatAmount = (amount: number) =>
  `रु ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function EarningsStatCard({
  label,
  amount,
  description,
  backgroundColor,
  iconName,
  iconColor = "#3B2F2F",
}: EarningsStatCardProps) {
  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Label row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <BodySmallSemiboldText
          style={{
            color: "#3B2F2F",
            opacity: 0.65,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: 11,
          }}
        >
          {label}
        </BodySmallSemiboldText>
        <IconSymbol name={iconName} size={20} color={iconColor} style={{ opacity: 0.6 }} />
      </View>

      {/* Amount */}
      <HeadingBoldText style={{ fontSize: 24, color: "#3B2F2F", marginBottom: 4 }}>
        {formatAmount(amount)}
      </HeadingBoldText>

      {/* Description */}
      <CaptionText style={{ color: "#3B2F2F", opacity: 0.5, fontSize: 12 }}>
        {description}
      </CaptionText>
    </View>
  );
}
