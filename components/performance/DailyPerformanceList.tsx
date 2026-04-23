import { Typography } from "@/components/ui/Typography";
import { formatAmount } from "@/lib/format-currency";
import React from "react";
import { View } from "react-native";

const SECONDARY = "#D4A373";

export interface DailyPerformanceEntry {
  label: string;
  earnings: number;
  ordersCount: number;
}

interface DailyPerformanceListProps {
  entries: DailyPerformanceEntry[];
  currencySymbol?: string;
}

export function DailyPerformanceList({
  entries,
  currencySymbol = "Rs. ",
}: DailyPerformanceListProps) {
  if (entries.length === 0) return null;

  const maxEarnings = Math.max(...entries.map((e) => e.earnings), 1);

  return (
    <View>
      <Typography
        variation="caption"
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: "rgba(59,47,47,0.4)",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          marginBottom: 10,
          paddingHorizontal: 2,
        }}
      >
        Daily Performance
      </Typography>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: "#3B2F2F",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          borderWidth: 1,
          borderColor: "rgba(59,47,47,0.05)",
        }}
      >
        {entries.map((entry, index) => {
          const barWidth = (entry.earnings / maxEarnings) * 100;
          const isTop = index === 0;
          return (
            <View key={entry.label}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Typography
                    variation="body"
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: isTop ? "#3B2F2F" : "rgba(59,47,47,0.7)",
                    }}
                  >
                    {entry.label}
                  </Typography>
                  <View style={{ alignItems: "flex-end" }}>
                    <Typography
                      variation="body"
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: isTop ? SECONDARY : "#3B2F2F",
                      }}
                    >
                      {formatAmount(entry.earnings, currencySymbol)}
                    </Typography>
                    {entry.ordersCount > 0 && (
                      <Typography
                        variation="caption"
                        style={{
                          fontSize: 11,
                          color: "rgba(59,47,47,0.4)",
                          marginTop: 1,
                        }}
                      >
                        {entry.ordersCount}{" "}
                        {entry.ordersCount !== 1 ? "orders" : "order"}
                      </Typography>
                    )}
                  </View>
                </View>
                {/* Progress bar */}
                <View
                  style={{
                    height: 4,
                    backgroundColor: "rgba(59,47,47,0.06)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${barWidth}%`,
                      backgroundColor: isTop ? SECONDARY : `${SECONDARY}55`,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
              {index < entries.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "rgba(59,47,47,0.06)",
                    marginHorizontal: 16,
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
