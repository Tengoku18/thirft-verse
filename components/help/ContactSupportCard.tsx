import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface ContactOption {
  label: string;
  icon: string;
  onPress: () => void;
}

interface ContactSupportCardProps {
  title: string;
  description: string;
  primaryOption: ContactOption;
  secondaryOptions: ContactOption[];
}

export function ContactSupportCard({
  title,
  description,
  primaryOption,
  secondaryOptions,
}: ContactSupportCardProps) {
  return (
    <View className="px-4 py-4">
      <View
        className="bg-brand-espresso rounded-3xl p-6 overflow-hidden"
        style={{
          shadowColor: "#3B3030",
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }}
      >
        {/* Decorative glow */}
        <View
          className="absolute top-0 right-0 w-40 h-40 rounded-full"
          style={{
            backgroundColor: "rgba(212, 163, 115, 0.15)",
            transform: [{ translateX: 48 }, { translateY: -48 }],
          }}
        />

        <View className="gap-2 mb-6">
          <Typography variation="h3" className="text-white font-folito-bold">
            {title}
          </Typography>
          <Typography variation="body-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
            {description}
          </Typography>
        </View>

        <View className="gap-3">
          {/* Primary action – tan filled */}
          <TouchableOpacity
            onPress={primaryOption.onPress}
            activeOpacity={0.85}
            className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
            style={{ backgroundColor: "#D4A373" }}
          >
            <IconSymbol name={primaryOption.icon as any} size={20} color="#3B3030" />
            <Typography variation="button" className="text-brand-espresso font-sans-bold">
              {primaryOption.label}
            </Typography>
          </TouchableOpacity>

          {/* Secondary actions – white/10 */}
          <View className="flex-row gap-3">
            {secondaryOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                activeOpacity={0.75}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-4"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              >
                <IconSymbol name={option.icon as any} size={18} color="#FFFFFF" />
                <Typography variation="button" style={{ color: "#FFFFFF" }} className="font-sans-semibold">
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
