import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/ui/Typography";

interface Props {
  selected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  trailingText?: string;
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <View
      className="w-5 h-5 rounded-full border-2 items-center justify-center"
      style={{ borderColor: selected ? "#3B2F2F" : "#CBD5E1" }}
    >
      {selected && (
        <View
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: "#3B2F2F" }}
        />
      )}
    </View>
  );
}

export function SelectionCard({
  selected,
  onPress,
  icon,
  title,
  subtitle,
  trailingText,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className={`bg-white rounded-2xl p-4 border-2 flex-row items-center gap-3 ${
        selected ? "border-brand-espresso" : "border-slate-100"
      }`}
    >
      <View className="w-10 h-10 rounded-full bg-brand-beige items-center justify-center">
        {icon}
      </View>
      <View className="flex-1">
        <Typography
          variation="body-sm"
          className="text-brand-espresso font-semibold"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variation="caption" className="text-ui-secondary">
            {subtitle}
          </Typography>
        )}
      </View>
      {trailingText && (
        <Typography
          variation="body-sm"
          className="text-amber-700 font-semibold"
        >
          {trailingText}
        </Typography>
      )}
      <RadioDot selected={selected} />
    </TouchableOpacity>
  );
}
