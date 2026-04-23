import { Typography } from "@/components/ui/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { View } from "react-native";

const SECONDARY = "#D4A373";

interface PerformanceRevenueCardProps {
  total: number;
  growthPercent: number;
  chartData: number[];
  chartLabels: string[];
  highlightIndex?: number;
  currencySymbol?: string;
}

function formatRevenue(amount: number, symbol = "Rs. "): string {
  if (amount >= 1_00_000)
    return `${symbol}${(amount / 1_00_000).toFixed(1)}L`;
  if (amount >= 1_000)
    return `${symbol}${(amount / 1_000).toFixed(1)}k`;
  return `${symbol}${amount.toLocaleString()}`;
}

export function PerformanceRevenueCard({
  total,
  growthPercent,
  chartData,
  chartLabels,
  highlightIndex,
  currencySymbol = "Rs. ",
}: PerformanceRevenueCardProps) {
  const isPositive = growthPercent >= 0;
  const max = Math.max(...chartData, 1);

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#3B2F2F",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: "rgba(59,47,47,0.05)",
      }}
    >
      {/* Top row: label + growth badge */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 4,
        }}
      >
        <Typography
          variation="caption"
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "rgba(59,47,47,0.4)",
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Weekly Revenue
        </Typography>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: isPositive
              ? "rgba(34,197,94,0.1)"
              : "rgba(239,68,68,0.1)",
          }}
        >
          <IconSymbol
            name={isPositive ? "arrow.up.right" : "arrow.down.right"}
            size={12}
            color={isPositive ? "#22C55E" : "#EF4444"}
          />
          <Typography
            variation="label"
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: isPositive ? "#22C55E" : "#EF4444",
            }}
          >
            {isPositive ? "+" : ""}
            {growthPercent.toFixed(1)}%
          </Typography>
        </View>
      </View>

      {/* Big revenue number */}
      <Typography
        variation="h1"
        style={{ fontSize: 36, color: "#3B2F2F", marginBottom: 24 }}
      >
        {formatRevenue(total, currencySymbol)}
      </Typography>

      {/* Bar Chart */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: 120,
          gap: 6,
        }}
      >
        {chartData.map((value, idx) => {
          const heightPct = Math.max((value / max) * 100, 4);
          const isHighlight = idx === highlightIndex;
          return (
            <View key={idx} style={{ flex: 1, alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: "100%",
                  height: `${heightPct}%`,
                  backgroundColor: isHighlight
                    ? SECONDARY
                    : `${SECONDARY}22`,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  shadowColor: isHighlight ? SECONDARY : "transparent",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isHighlight ? 0.35 : 0,
                  shadowRadius: 8,
                  elevation: isHighlight ? 3 : 0,
                }}
              />
              <Typography
                variation="caption"
                style={{
                  fontSize: 10,
                  fontWeight: isHighlight ? "700" : "400",
                  color: isHighlight ? SECONDARY : "rgba(59,47,47,0.35)",
                }}
              >
                {chartLabels[idx] ?? ""}
              </Typography>
            </View>
          );
        })}
      </View>
    </View>
  );
}
