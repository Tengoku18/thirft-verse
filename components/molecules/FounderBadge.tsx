import { CaptionText } from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { View } from "react-native";

interface FounderBadgeProps {
  /** "creator" shows a crown, "seller" shows a storefront, "both" shows a star */
  type?: "creator" | "seller" | "both";
  size?: "sm" | "md";
}

const BADGE_CONFIG = {
  creator: {
    icon: "crown.fill",
    label: "Founding Creator",
    bg: "#FEF3C7",
    border: "#F59E0B",
    text: "#B45309",
    icon_color: "#D97706",
  },
  seller: {
    icon: "storefront.fill",
    label: "Founding Seller",
    bg: "#EFF6FF",
    border: "#3B82F6",
    text: "#1D4ED8",
    icon_color: "#2563EB",
  },
  both: {
    icon: "star.fill",
    label: "Founder",
    bg: "#F5F3FF",
    border: "#8B5CF6",
    text: "#6D28D9",
    icon_color: "#7C3AED",
  },
};

export function FounderBadge({
  type = "both",
  size = "md",
}: FounderBadgeProps) {
  const cfg = BADGE_CONFIG[type];
  const isSmall = size === "sm";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: cfg.bg,
        borderWidth: 1,
        borderColor: cfg.border,
        borderRadius: isSmall ? 6 : 8,
        paddingHorizontal: isSmall ? 6 : 8,
        paddingVertical: isSmall ? 2 : 4,
        gap: 4,
      }}
    >
      <IconSymbol
        name={cfg.icon as any}
        size={isSmall ? 10 : 12}
        color={cfg.icon_color}
      />
      <CaptionText
        style={{
          color: cfg.text,
          fontSize: isSmall ? 10 : 11,
          fontWeight: "700",
          letterSpacing: 0.3,
        }}
      >
        {cfg.label}
      </CaptionText>
    </View>
  );
}
