import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface BenefitItem {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

const BENEFITS: BenefitItem[] = [
  {
    icon: "badge.plus.fill",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
    title: "Permanent Founder Badge",
    description: "Displayed on your profile and store — forever.",
  },
  {
    icon: "clock.fill",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
    title: "Early Feature Access",
    description:
      "Get early access to new features and tools before public release.",
  },
  {
    icon: "star.fill",
    iconColor: "#2563EB",
    iconBg: "#EFF6FF",
    title: "Premium Marketplace Placement",
    description: "Premium visibility in the marketplace featured sections.",
  },
];

export function FounderBenefitsList() {
  return (
    <View className="mx-4 mb-6">
      <Typography
        variation="caption"
        className="text-slate-500 font-sans-bold uppercase tracking-widest mb-4 px-4"
      >
        Founder Benefits
      </Typography>

      <View className="gap-3">
        {BENEFITS.map((benefit, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-4 border border-brand-beige/40 flex-row gap-3"
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center flex-shrink-0"
              style={{ backgroundColor: benefit.iconBg }}
            >
              <IconSymbol
                name={benefit.icon as any}
                size={20}
                color={benefit.iconColor}
              />
            </View>
            <View className="flex-1">
              <Typography
                variation="body-sm"
                className="text-brand-espresso font-sans-bold mb-0.5"
              >
                {benefit.title}
              </Typography>
              <Typography
                variation="caption"
                className="text-slate-500 leading-relaxed"
              >
                {benefit.description}
              </Typography>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
