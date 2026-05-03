import { Typography } from "@/components/ui/Typography";
import { formatAmount } from "@/lib/format-currency";
import React from "react";
import { View } from "react-native";
import { BagIcon, ReceiptIcon } from "@/components/icons";

const SECONDARY = "#D4A373";

interface PerformanceMetricGridProps {
  ordersCount: number;
  avgOrderValue: number;
  currencySymbol?: string;
}

export function PerformanceMetricGrid({
  ordersCount,
  avgOrderValue,
  currencySymbol = "Rs. ",
}: PerformanceMetricGridProps) {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#3B2F2F",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          borderWidth: 1,
          borderColor: "rgba(59,47,47,0.05)",
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: `${SECONDARY}22`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <BagIcon width={18} height={18} color={SECONDARY} />
        </View>
        <Typography
          variation="caption"
          style={{ fontSize: 11, color: "rgba(59,47,47,0.5)", fontWeight: "600" }}
        >
          Orders
        </Typography>
        <Typography
          variation="h4"
          style={{ fontSize: 22, color: "#3B2F2F", marginTop: 4, fontWeight: "700" }}
        >
          {ordersCount}
        </Typography>
        <Typography
          variation="caption"
          style={{ fontSize: 11, color: "rgba(59,47,47,0.4)", marginTop: 2 }}
        >
          items sold
        </Typography>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#3B2F2F",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          borderWidth: 1,
          borderColor: "rgba(59,47,47,0.05)",
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: `${SECONDARY}22`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <ReceiptIcon width={18} height={18} color={SECONDARY} />
        </View>
        <Typography
          variation="caption"
          style={{ fontSize: 11, color: "rgba(59,47,47,0.5)", fontWeight: "600" }}
        >
          Avg. Value
        </Typography>
        <Typography
          variation="h4"
          style={{ fontSize: 22, color: "#3B2F2F", marginTop: 4, fontWeight: "700" }}
        >
          {formatAmount(avgOrderValue, currencySymbol)}
        </Typography>
        <Typography
          variation="caption"
          style={{ fontSize: 11, color: "rgba(59,47,47,0.4)", marginTop: 2 }}
        >
          per order
        </Typography>
      </View>
    </View>
  );
}
