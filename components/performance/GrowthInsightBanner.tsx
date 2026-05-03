import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";
import { LightbulbFillIcon } from "@/components/icons";

interface GrowthInsightBannerProps {
  title?: string;
  message: string;
}

export function GrowthInsightBanner({
  title = "Growth Insight",
  message,
}: GrowthInsightBannerProps) {
  return (
    <View
      style={{
        backgroundColor: "#F2EDEC",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 14,
        borderWidth: 1,
        borderColor: "rgba(59,47,47,0.06)",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: "rgba(59,47,47,0.06)",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <LightbulbFillIcon width={20} height={20} color="#3B2F2F" />
      </View>
      <View style={{ flex: 1 }}>
        <Typography
          variation="label"
          style={{ fontSize: 13, fontWeight: "700", color: "#3B2F2F", marginBottom: 4 }}
        >
          {title}
        </Typography>
        <Typography
          variation="body-sm"
          style={{ fontSize: 12, color: "rgba(59,47,47,0.65)", lineHeight: 18 }}
        >
          {message}
        </Typography>
      </View>
    </View>
  );
}
