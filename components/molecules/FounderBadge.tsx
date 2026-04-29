import { CrownFillIcon, StarIcon, StoreIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React, { ComponentType } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

interface FounderBadgeProps {
  /** "creator" shows a crown, "seller" shows a storefront, "both" shows a star */
  type?: "creator" | "seller" | "both";
  size?: "sm" | "md";
}

const BADGE_CONFIG: Record<
  string,
  {
    Icon: ComponentType<SvgProps>;
    label: string;
    bg: string;
    border: string;
    text: string;
    icon_color: string;
  }
> = {
  creator: {
    Icon: CrownFillIcon,
    label: "Founding Creator",
    bg: "#FEF3C7",
    border: "#F59E0B",
    text: "#B45309",
    icon_color: "#D97706",
  },
  seller: {
    Icon: StoreIcon,
    label: "Founding Seller",
    bg: "#EFF6FF",
    border: "#3B82F6",
    text: "#1D4ED8",
    icon_color: "#2563EB",
  },
  both: {
    Icon: StarIcon,
    label: "Founder",
    bg: "#F5F3FF",
    border: "#8B5CF6",
    text: "#6D28D9",
    icon_color: "#7C3AED",
  },
};

export function FounderBadge({
  type = "both",
  size = "sm",
}: FounderBadgeProps) {
  const cfg = BADGE_CONFIG[type];
  const isSmall = size === "sm";
  const IconComponent = cfg.Icon;

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
      <IconComponent
        width={isSmall ? 10 : 12}
        height={isSmall ? 10 : 12}
        color={cfg.icon_color}
      />
      <Typography variation="caption"
        style={{
          color: cfg.text,
          fontSize: isSmall ? 10 : 11,
          fontWeight: "700",
          letterSpacing: 0.3,
        }}
      >
        {cfg.label}
      </Typography>
    </View>
  );
}
