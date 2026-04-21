import Ionicons from "@expo/vector-icons/Ionicons";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Pressable } from "react-native";

// Maps help-specific icon keys directly to Ionicons names
const ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  rocket_launch: "rocket-outline",
  storefront: "storefront-outline",
  payments: "card-outline",
  local_shipping: "cube-outline",
  shield_person: "shield-checkmark-outline",
};

interface FAQCategoryCardProps {
  icon: string;
  title: string;
  onPress?: () => void;
  fullWidth?: boolean;
}

export function FAQCategoryCard({
  icon,
  title,
  onPress,
  fullWidth,
}: FAQCategoryCardProps) {
  const ionIcon = ICON_MAP[icon] ?? "help-circle-outline";

  if (fullWidth) {
    return (
      <Pressable
        onPress={onPress}
        className="bg-white px-4 py-4 rounded-2xl border border-brand-beige flex-row items-center gap-4 active:opacity-75"
        style={{
          shadowColor: "#3B3030",
          shadowOpacity: 0.04,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        }}
      >
        <Ionicons name={ionIcon} size={26} color="#6B705C" />
        <Typography
          variation="body-sm"
          className="text-brand-espresso font-sans-bold flex-1"
        >
          {title}
        </Typography>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="bg-white p-4 rounded-2xl border border-brand-beige active:opacity-75 gap-3"
      style={{
        shadowColor: "#3B3030",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <Ionicons name={ionIcon} size={30} color="#6B705C" />
      <Typography
        variation="body-sm"
        className="text-brand-espresso font-sans-bold"
      >
        {title}
      </Typography>
    </Pressable>
  );
}
