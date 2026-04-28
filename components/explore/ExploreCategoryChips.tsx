import { Typography } from "@/components/ui/Typography";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";

interface Props {
  selected: string[];
  onToggle: (cat: string) => void;
  onClearAll: () => void;
}

export function ExploreCategoryChips({
  selected,
  onToggle,
  onClearAll,
}: Props) {
  const allSelected = selected.length === 0;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4 py-4"
      contentContainerStyle={{ gap: 8, paddingBottom: 2 }}
    >
      <TouchableOpacity
        onPress={onClearAll}
        activeOpacity={0.75}
        className="h-9 px-4 rounded-full items-center justify-center"
        style={{ backgroundColor: allSelected ? "#3B2F2F" : "#FFFFFF" }}
      >
        <Typography
          variation="body-sm"
          style={{
            color: allSelected ? "#FFFFFF" : "#3B2F2F",
            fontWeight: "500",
          }}
        >
          All
        </Typography>
      </TouchableOpacity>

      {PRODUCT_CATEGORIES.map((cat) => {
        const isActive = selected.includes(cat);
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onToggle(cat)}
            activeOpacity={0.75}
            className="h-9 px-4 rounded-full items-center justify-center"
            style={{ backgroundColor: isActive ? "#3B2F2F" : "#FFFFFF" }}
          >
            <Typography
              variation="body-sm"
              style={{
                color: isActive ? "#FFFFFF" : "#3B2F2F",
                fontWeight: "500",
              }}
            >
              {cat}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
