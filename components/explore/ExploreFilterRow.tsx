import { Typography } from "@/components/ui/Typography";
import { ProductSortOption } from "@/lib/explore-helpers";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price ↑" },
  { value: "price-high", label: "Price ↓" },
  { value: "name-az", label: "A → Z" },
  { value: "name-za", label: "Z → A" },
];

interface Props {
  sortBy: ProductSortOption;
  onSortChange: (v: ProductSortOption) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ExploreFilterRow({
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const isDefaultSort = sortBy === "newest";
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Newest";

  return (
    <View>
      {/* Chip row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 10,
          paddingTop: 2,
          justifyContent: "space-between",
        }}
      >
        {/* Sort chip */}
        <TouchableOpacity
          onPress={() => setShowSort((v) => !v)}
          activeOpacity={0.75}
          style={{
            height: 36,
            paddingHorizontal: 14,
            borderRadius: 18,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: isDefaultSort ? "#FFFFFF" : "#3B2F2F",
            borderWidth: isDefaultSort ? 1 : 0,
            borderColor: "rgba(59,47,47,0.12)",
          }}
        >
          <Ionicons
            name="swap-vertical-outline"
            size={13}
            color={isDefaultSort ? "rgba(59,47,47,0.6)" : "#FFFFFF"}
          />
          <Typography
            variation="body-sm"
            style={{
              color: isDefaultSort ? "rgba(59,47,47,0.7)" : "#FFFFFF",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            {currentLabel}
          </Typography>
          <Ionicons
            name={showSort ? "chevron-up" : "chevron-down"}
            size={12}
            color={isDefaultSort ? "rgba(59,47,47,0.5)" : "rgba(255,255,255,0.7)"}
          />
        </TouchableOpacity>

        {/* Clear all — pinned to the right */}
        {hasActiveFilters ? (
          <TouchableOpacity
            onPress={onClearFilters}
            activeOpacity={0.7}
            style={{
              height: 36,
              paddingHorizontal: 14,
              borderRadius: 18,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#3B2F2F",
            }}
          >
            <Ionicons name="close" size={13} color="#FFFFFF" />
            <Typography
              variation="body-sm"
              style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 13 }}
            >
              Clear all
            </Typography>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View
          className="mx-4 bg-white rounded-2xl mb-2"
          style={{
            padding: 4,
            shadowColor: "#3B2F2F",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6,
            borderWidth: 1,
            borderColor: "rgba(59,47,47,0.06)",
          }}
        >
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortBy === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                className="flex-row justify-between items-center py-3 px-4"
                style={{
                  borderRadius: 12,
                  backgroundColor: isActive ? "rgba(59,47,47,0.06)" : "transparent",
                }}
                onPress={() => {
                  onSortChange(opt.value);
                  setShowSort(false);
                }}
                activeOpacity={0.65}
              >
                <Typography
                  variation="body-sm"
                  style={{
                    color: isActive ? "#3B2F2F" : "#6B7280",
                    fontWeight: isActive ? "700" : "500",
                  }}
                >
                  {opt.label}
                </Typography>
                {isActive && (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "#3B2F2F",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
