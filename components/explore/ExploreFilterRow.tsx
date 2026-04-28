import { Typography } from "@/components/ui/Typography";
import { ProductSortOption } from "@/lib/explore-helpers";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Switch, TouchableOpacity, View } from "react-native";

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
  { value: "name-za", label: "Name: Z to A" },
];

interface Props {
  inStockOnly: boolean;
  onToggleInStock: () => void;
  sortBy: ProductSortOption;
  onSortChange: (v: ProductSortOption) => void;
}

export function ExploreFilterRow({
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSortChange,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Newest";

  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between py-2">
        <TouchableOpacity
          onPress={() => setShowSort((v) => !v)}
          className="flex-row items-center"
          style={{ gap: 4 }}
          activeOpacity={0.7}
        >
          <Typography
            variation="body-sm"
            style={{ color: "rgba(59,47,47,0.7)", fontWeight: "500" }}
          >
            {currentLabel}
          </Typography>
          <Ionicons name="chevron-down" size={15} color="rgba(59,47,47,0.7)" />
        </TouchableOpacity>

        <View className="flex-row items-center" style={{ gap: 6 }}>
          <Typography
            variation="caption"
            style={{
              color: "rgba(59,47,47,0.6)",
              fontWeight: "600",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              fontSize: 10,
            }}
          >
            In-Stock Only
          </Typography>
          <Switch
            value={inStockOnly}
            onValueChange={onToggleInStock}
            trackColor={{ false: "#E5E7EB", true: "rgba(212,163,115,0.55)" }}
            thumbColor={inStockOnly ? "#3B2F2F" : "#F9F9F9"}
            style={{ transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }] }}
          />
        </View>
      </View>

      {showSort && (
        <View
          className="bg-white rounded-xl mb-2"
          style={{
            padding: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              className="flex-row justify-between items-center py-3 px-3"
              onPress={() => {
                onSortChange(opt.value);
                setShowSort(false);
              }}
            >
              <Typography
                variation="body-sm"
                style={{
                  color: sortBy === opt.value ? "#3B2F2F" : "#6B7280",
                  fontWeight: sortBy === opt.value ? "700" : "500",
                }}
              >
                {opt.label}
              </Typography>
              {sortBy === opt.value && (
                <Ionicons name="checkmark" size={18} color="#3B2F2F" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
