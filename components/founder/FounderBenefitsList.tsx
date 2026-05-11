import { Typography } from "@/components/ui/Typography";
import { renderSFSymbolIcon } from "@/lib/icon-mapper";
import React from "react";
import { View } from "react-native";

interface BenefitItem {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

const SELLER_BENEFITS: BenefitItem[] = [
  {
    icon: "seal.fill",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
    title: "Permanent Founder Badge",
    description:
      "Prestigious digital seal displayed on your storefront — forever.",
  },
  {
    icon: "checkmark.shield.fill",
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
    title: "Zero Verification Fees",
    description:
      "Get verified as a premier seller at no charge during Phase 1 launch.",
  },
  {
    icon: "chart.bar.fill",
    iconColor: "#2563EB",
    iconBg: "#EFF6FF",
    title: "Priority Marketplace Exposure",
    description:
      "Algorithm priority and featured placement across the platform.",
  },
  {
    icon: "shippingbox.fill",
    iconColor: "#DC2626",
    iconBg: "#FEE2E2",
    title: "Order Protection",
    description:
      "Thriftverse covers shipping costs for unreceived COD orders — sell with total peace of mind.",
  },
  {
    icon: "percent",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
    title: "2% Commission Discount",
    description:
      "Exclusive 2% reduction on platform commissions for your first 12 months.",
  },
];

const CREATOR_BENEFITS: BenefitItem[] = [
  {
    icon: "seal.fill",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
    title: "Permanent Founder Badge",
    description:
      "Official Founder status and digital badge — marks you as a platform pioneer.",
  },
  {
    icon: "checkmark.shield.fill",
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
    title: "No Verification Charge",
    description:
      "Gain full platform access and Verified Creator status without any setup fees.",
  },
  {
    icon: "link",
    iconColor: "#2563EB",
    iconBg: "#EFF6FF",
    title: "Unique Referral Code",
    description:
      "Your own personalized referral link to build your creator empire and track influence.",
  },
  {
    icon: "indianrupeesign.circle.fill",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
    title: "20% Profit Share",
    description:
      "Earn 20% of the platform's profit for every successful sale made through your referral.",
  },
  {
    icon: "trophy.fill",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
    title: "Monthly Cash Rewards",
    description:
      "Win Rs. 1,000–Rs. 2,000 monthly cash bonuses for top-performing curators on the leaderboard.",
  },
  {
    icon: "star.fill",
    iconColor: "#6366F1",
    iconBg: "#E0E7FF",
    title: "Priority Product Exposure",
    description:
      "Your recommended products get priority placement across the Thriftverse marketplace.",
  },
];

interface FounderBenefitsListProps {
  type?: "creator" | "seller" | "both";
}

export function FounderBenefitsList({
  type = "both",
}: FounderBenefitsListProps) {
  const sellerItems = type === "creator" ? [] : SELLER_BENEFITS;
  const creatorItems = type === "seller" ? [] : CREATOR_BENEFITS;

  const renderSection = (label: string, items: BenefitItem[]) => (
    <View className="mb-6">
      {type === "both" && (
        <Typography
          variation="caption"
          className="text-slate-400 font-sans-bold uppercase tracking-widest mb-3 px-1"
        >
          {label}
        </Typography>
      )}
      <View className="gap-3">
        {items.map((benefit, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-4 border border-brand-beige/40 flex-row gap-3"
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center flex-shrink-0"
              style={{ backgroundColor: benefit.iconBg }}
            >
              {renderSFSymbolIcon(benefit.icon, {
                size: 20,
                color: benefit.iconColor,
              })}
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

  return (
    <View className="mx-4 mb-6">
      {sellerItems.length > 0 && renderSection("Founding Seller", sellerItems)}
      {creatorItems.length > 0 &&
        renderSection("Founding Creator", creatorItems)}
    </View>
  );
}
