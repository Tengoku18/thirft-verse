import { FounderBadge } from "@/components/molecules/FounderBadge";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppSelector } from "@/store/hooks";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

// ── Benefit row ─────────────────────────────────────────────────────────────
function BenefitRow({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
}: {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="flex-row items-start gap-3 py-3">
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mt-0.5"
        style={{ backgroundColor: iconBg }}
      >
        <IconSymbol name={icon as any} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <BodySemiboldText style={{ fontSize: 14, color: "#3B2F2F" }}>
          {title}
        </BodySemiboldText>
        <CaptionText style={{ color: "#6B7280", marginTop: 2, lineHeight: 16 }}>
          {subtitle}
        </CaptionText>
      </View>
    </View>
  );
}

// ── Main screen ─────────────────────────────────────────────────────────────
export default function FounderCircleScreen() {
  const profile = useAppSelector((state) => state.profile.profile);
  const user = useAppSelector((state) => state.auth.user);

  const isCreator = profile?.is_founder_creator ?? false;
  const isSeller = profile?.is_founder_seller ?? false;
  const isFounder = profile?.is_founder ?? false;
  const badgeType: "creator" | "seller" | "both" =
    isCreator && isSeller ? "both" : isCreator ? "creator" : "seller";

  // Show founder dashboard if founder, otherwise redirect
  if (!isFounder) {
    return (
      <View className="flex-1 bg-[#FAFAFA]">
        <Stack.Screen options={{ headerShown: false }} />
        <CustomHeader title="Founder Dashboard" showBackButton />
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 rounded-full bg-[#FEF3C7] items-center justify-center mb-4">
            <IconSymbol name="lock.fill" size={28} color="#D97706" />
          </View>
          <HeadingBoldText
            style={{ fontSize: 22, textAlign: "center", marginBottom: 8 }}
          >
            Founder Status Required
          </HeadingBoldText>
          <BodyRegularText
            style={{
              color: "#6B7280",
              textAlign: "center",
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            Verify your founder access code from Settings → Founder Circle to
            access the founder dashboard.
          </BodyRegularText>
        </View>
      </View>
    );
  }

  // Founder view: show benefits dashboard

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader
        title={isFounder ? "Founder Dashboard" : "Referral Code"}
        showBackButton
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero card ── */}
        <View
          className="mx-4 mb-6 rounded-2xl p-5 overflow-hidden"
          style={{
            backgroundColor: "#3B2F2F",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <FounderBadge type={badgeType} />
            <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center">
              <IconSymbol name="crown.fill" size={20} color="#FCD34D" />
            </View>
          </View>
          <HeadingBoldText
            style={{ fontSize: 22, color: "#FFFFFF", marginBottom: 4 }}
          >
            {profile?.name}
          </HeadingBoldText>
          <CaptionText
            style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}
          >
            Founding{" "}
            {isCreator && isSeller
              ? "Creator & Seller"
              : isCreator
                ? "Creator"
                : "Seller"}{" "}
            · Member since{" "}
            {new Date(
              profile?.founder_verified_at || profile?.created_at || new Date(),
            ).toLocaleDateString("en-NP", { month: "long", year: "numeric" })}
          </CaptionText>
        </View>

        {/* ── Benefits section (founders only) ── */}
        {isFounder && (
          <View className="mx-4 mb-6">
            <CaptionText
              className="mb-3"
              style={{
                color: "#6B7280",
                fontWeight: "600",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Your Benefits
            </CaptionText>
            <View
              className="bg-white rounded-2xl px-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {/* Shared */}
              <BenefitRow
                icon="checkmark.seal.fill"
                iconColor="#059669"
                iconBg="#D1FAE5"
                title="Permanent Founder Badge"
                subtitle="Displayed on your profile and store — forever."
              />
              <View className="h-[1px] bg-[#F3F4F6] ml-12" />

              {/* Creator-specific */}
              {isCreator && (
                <>
                  <BenefitRow
                    icon="dollarsign.circle.fill"
                    iconColor="#D97706"
                    iconBg="#FEF3C7"
                    title="Referral Commission Override"
                    subtitle="Rs. 50 per sale or 5% of platform commission (whichever is higher) for 6 months per referred seller."
                  />
                  <View className="h-[1px] bg-[#F3F4F6] ml-12" />
                  <BenefitRow
                    icon="trophy.fill"
                    iconColor="#7C3AED"
                    iconBg="#F5F3FF"
                    title="Monthly Leaderboard Rewards"
                    subtitle="Top 3 creators each month win cash or product rewards."
                  />
                  <View className="h-[1px] bg-[#F3F4F6] ml-12" />
                  <BenefitRow
                    icon="star.fill"
                    iconColor="#F59E0B"
                    iconBg="#FFFBEB"
                    title="Featured Creator Visibility"
                    subtitle="Highlighted in the leaderboard and featured creator sections."
                  />
                  {isSeller && <View className="h-[1px] bg-[#F3F4F6] ml-12" />}
                </>
              )}

              {/* Seller-specific */}
              {isSeller && (
                <>
                  <BenefitRow
                    icon="percent"
                    iconColor="#2563EB"
                    iconBg="#EFF6FF"
                    title="2% Commission Discount"
                    subtitle="Extra 2% reduction on platform sales commission for 12 months."
                  />
                  <View className="h-[1px] bg-[#F3F4F6] ml-12" />
                  <BenefitRow
                    icon="arrow.up.circle.fill"
                    iconColor="#059669"
                    iconBg="#D1FAE5"
                    title="Priority Store Exposure"
                    subtitle="Your verified store is shown in the marketplace from day one."
                  />
                  <View className="h-[1px] bg-[#F3F4F6] ml-12" />
                  <BenefitRow
                    icon="bell.badge.fill"
                    iconColor="#DC2626"
                    iconBg="#FEE2E2"
                    title="Early Campaign Access"
                    subtitle="Receive Thriftverse marketing news 3 days before public release."
                  />
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
