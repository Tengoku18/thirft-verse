import React from "react";
import { Typography } from "@/components/ui/Typography";
import { ScrollView, TouchableOpacity, View } from "react-native";

export type StatusFilter =
  | "all"
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

interface FilterOption {
  key: StatusFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "refunded", label: "Refunded" },
];

interface OrderFilterBarProps {
  active: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (filter: StatusFilter) => void;
}

export function OrderFilterBar({
  active,
  counts,
  onChange,
}: OrderFilterBarProps) {
  return (
    <View
      style={{
        backgroundColor: "#FAF7F2",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(59,48,48,0.07)",
        paddingVertical: 10,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {FILTER_OPTIONS.map((opt) => {
          const isActive = active === opt.key;
          const count = counts[opt.key] ?? 0;

          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onChange(opt.key)}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isActive ? "#3B2F2F" : "rgba(59,48,48,0.06)",
              }}
            >
              <Typography variation="label"
                style={{
                  fontSize: 13,
                  color: isActive ? "#FFFFFF" : "rgba(59,48,48,0.65)",
                }}
              >
                {opt.label}
              </Typography>

              {/* Count badge */}
              <View
                style={{
                  marginLeft: 6,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                  borderRadius: 10,
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(59,48,48,0.1)",
                }}
              >
                <Typography variation="caption"
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: isActive ? "#FFFFFF" : "rgba(59,48,48,0.6)",
                  }}
                >
                  {count}
                </Typography>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
