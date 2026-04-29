import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  LayersIcon,
  RightArrowIcon,
  TrendingUpIcon,
} from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

const SECONDARY = "#D4A373";

interface SellerGrowthMetricsProps {
  totalItemsSold: number;
  storeGrowthTrend: number;
}

export function SellerGrowthMetrics({
  totalItemsSold,
  storeGrowthTrend,
}: SellerGrowthMetricsProps) {
  const isPositiveGrowth = storeGrowthTrend >= 0;
  const isStrongGrowth = storeGrowthTrend >= 20;

  const trendColor = isStrongGrowth
    ? "#059669"
    : isPositiveGrowth
      ? "#3B2F2F"
      : "#DC2626";

  const renderTrendIcon = () => {
    if (isStrongGrowth) {
      return <ArrowUpRightIcon width={14} height={14} color={trendColor} />;
    } else if (isPositiveGrowth) {
      return <RightArrowIcon width={14} height={14} color={trendColor} />;
    } else {
      return <ArrowDownRightIcon width={14} height={14} color={trendColor} />;
    }
  };

  return (
    <View style={{ gap: 12 }}>
      {/* Label — matches DailyPerformanceList */}
      <Typography
        variation="caption"
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: "rgba(59,47,47,0.4)",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          paddingHorizontal: 2,
        }}
      >
        Store Growth
      </Typography>

      {/* Two metric cards */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* Total Sold */}
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
            <LayersIcon width={18} height={18} color={SECONDARY} />
          </View>
          <Typography
            variation="caption"
            style={{
              fontSize: 11,
              color: "rgba(59,47,47,0.5)",
              fontWeight: "600",
            }}
          >
            Total Sold
          </Typography>
          <Typography
            variation="h4"
            style={{
              fontSize: 22,
              color: SECONDARY,
              marginTop: 4,
              fontWeight: "700",
            }}
          >
            {totalItemsSold}
          </Typography>
          <Typography
            variation="caption"
            style={{ fontSize: 11, color: "rgba(59,47,47,0.4)", marginTop: 2 }}
          >
            items in period
          </Typography>
        </View>

        {/* Store Trend */}
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
            <TrendingUpIcon width={18} height={18} color={SECONDARY} />
          </View>
          <Typography
            variation="caption"
            style={{
              fontSize: 11,
              color: "rgba(59,47,47,0.5)",
              fontWeight: "600",
            }}
          >
            Store Trend
          </Typography>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <Typography
              variation="h4"
              style={{ fontSize: 22, color: trendColor, fontWeight: "700" }}
            >
              {isPositiveGrowth ? "+" : ""}
              {storeGrowthTrend.toFixed(0)}%
            </Typography>
            {renderTrendIcon()}
          </View>
          <Typography
            variation="caption"
            style={{ fontSize: 11, color: "rgba(59,47,47,0.4)", marginTop: 2 }}
          >
            vs last period
          </Typography>
        </View>
      </View>
    </View>
  );
}
