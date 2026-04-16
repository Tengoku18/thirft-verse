import { Typography } from "@/components/ui/Typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View } from "react-native";

interface ReferralBenefitProps {
  icon: string;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}

interface ReferralBenefitsProps {
  benefits: ReferralBenefitProps[];
}

// Maps benefit icon keys to Ionicons names
const ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>["name"]> =
  {
    percent: "calculator",
    trending_up: "trending-up",
    local_offer: "pricetag",
    speed: "flash",
  };

export function ReferralBenefits({ benefits }: ReferralBenefitsProps) {
  return (
    <View className="px-4 mb-6">
      <Typography
        variation="caption"
        className="text-slate-500 font-sans-bold uppercase tracking-widest mb-4"
      >
        Referral Benefits
      </Typography>

      <View className="gap-3">
        {benefits.map((benefit, index) => {
          const ionIcon = ICON_MAP[benefit.icon] ?? "help-circle-outline";
          return (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 border border-slate-200 flex-row gap-3 shadow-sm"
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center flex-shrink-0"
                style={{ backgroundColor: benefit.iconBg }}
              >
                <Ionicons name={ionIcon} size={20} color={benefit.iconColor} />
              </View>
              <View className="flex-1">
                <Typography
                  variation="body-sm"
                  className="text-brand-espresso font-sans-bold mb-0.5"
                >
                  {benefit.title}
                </Typography>
                <Typography variation="caption" className="text-slate-500">
                  {benefit.description}
                </Typography>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
