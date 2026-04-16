import TrendingUpIcon from "@/components/icons/TrendingUpIcon";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { WeeklyBarChart } from "./WeeklyBarChart";

interface WeeklyPerformanceCardProps {
  data: number[];
  labels?: string[];
  highlightIndex?: number;
  growthPercent?: number; // e.g., 12 for +12%
}

export const WeeklyPerformanceCard: React.FC<WeeklyPerformanceCardProps> = ({
  data,
  labels,
  highlightIndex,
  growthPercent = 0,
}) => {
  const isPositive = growthPercent >= 0;
  const sign = isPositive ? "+" : "";
  const router = useRouter();

  return (
    <View className="mx-5 mt-5">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/performance" as any)}
        className="bg-white p-5 rounded-2xl"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
          borderWidth: 1,
          borderColor: "rgba(59,47,47,0.05)",
        }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <Typography
            variation="h5"
            style={{ fontSize: 16, color: "#3B2F2F" }}
          >
            Weekly Performance
          </Typography>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View className="flex-row items-center" style={{ gap: 4 }}>
              <TrendingUpIcon size={14} color="#D4A373" />
              <Typography
                variation="label"
                style={{ fontSize: 12, fontWeight: "700", color: "#D4A373" }}
              >
                {sign}
                {growthPercent}%
              </Typography>
            </View>
            <IconSymbol
              name="chevron.right"
              size={14}
              color="rgba(59,47,47,0.3)"
            />
          </View>
        </View>

        <WeeklyBarChart
          data={data}
          labels={labels}
          highlightIndex={highlightIndex}
        />
      </TouchableOpacity>
    </View>
  );
};
