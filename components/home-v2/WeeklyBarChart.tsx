import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface WeeklyBarChartProps {
  data: number[]; // length 7, values
  labels?: string[]; // length 7, day labels
  highlightIndex?: number; // index to highlight (today)
}

const DEFAULT_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
  data,
  labels = DEFAULT_LABELS,
  highlightIndex,
}) => {
  const max = Math.max(...data, 1);

  return (
    <View className="flex-row items-end justify-between h-32" style={{ gap: 8 }}>
      {data.map((value, idx) => {
        const heightPct = Math.max((value / max) * 100, 6);
        const isHighlight = idx === highlightIndex;
        return (
          <View key={idx} className="flex-1 items-center" style={{ gap: 8 }}>
            <View
              style={{
                width: "100%",
                height: `${heightPct}%`,
                backgroundColor: isHighlight ? "#D4A373" : "rgba(59,47,47,0.06)",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            />
            <Typography
              variation="caption"
              style={{
                fontSize: 10,
                color: isHighlight ? "#D4A373" : "rgba(59,47,47,0.4)",
                fontWeight: isHighlight ? "700" : "400",
              }}
            >
              {labels[idx]}
            </Typography>
          </View>
        );
      })}
    </View>
  );
};
