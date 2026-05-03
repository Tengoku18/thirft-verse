import BagIcon from "@/components/icons/BagIcon";
import { Typography } from "@/components/ui/Typography";

import React from "react";
import { View } from "react-native";

interface OrderEmptyStateProps {
  /** Pass the active filter label to show a contextual message */
  filterLabel?: string;
}

export function OrderEmptyState({ filterLabel }: OrderEmptyStateProps) {
  const isFiltered = filterLabel && filterLabel !== "All";

  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 64, paddingHorizontal: 32 }}>
      {/* Icon circle */}
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: "rgba(59,48,48,0.06)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <BagIcon width={36} height={36} color="rgba(59,48,48,0.3)" />
      </View>

      <Typography variation="h2"
        style={{ fontSize: 20, color: "#3B2F2F", marginBottom: 8, textAlign: "center" }}
      >
        {isFiltered ? `No ${filterLabel} Orders` : "No Orders Yet"}
      </Typography>

      <Typography variation="body-sm"
        style={{ color: "rgba(59,48,48,0.5)", textAlign: "center", lineHeight: 22 }}
      >
        {isFiltered
          ? `You don't have any ${filterLabel?.toLowerCase()} orders right now.`
          : "When customers purchase your products, their orders will appear here to manage and track."}
      </Typography>
    </View>
  );
}
