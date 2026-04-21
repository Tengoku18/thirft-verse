import { ScreenLayout } from "@/components/layouts";
import {
  ReferralBenefits,
  ReferralCodeDisplay,
  ReferralHeroSection,
  ReferralHistory,
  ReferralStats,
} from "@/components/referral";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import { useAppSelector } from "@/store/hooks";
import * as Clipboard from "expo-clipboard";
import { useCallback, useState } from "react";
import { ScrollView, Share, View } from "react-native";

export default function ReferralCodeScreen() {
  const toast = useToast();
  const [copying, setCopying] = useState(false);

  const referralCode = useAppSelector((state) => {
    const username = state.profile.profile?.store_username || "THRIFT24";
    return username.toUpperCase().slice(0, 6) + "24";
  });

  const mockStats = {
    totalReferrals: 12,
    totalEarnings: "$48.50",
    activeReferrals: 8,
  };

  const mockBenefits = [
    {
      icon: "percent",
      title: "5-15% Commission",
      description: "Earn a percentage on every purchase from your referrals",
      iconColor: "#059669",
      iconBg: "#D1FAE5",
    },
    {
      icon: "trending_up",
      title: "Unlimited Earnings",
      description: "No cap on how much you can earn from referrals",
      iconColor: "#D97706",
      iconBg: "#FEF3C7",
    },
    {
      icon: "local_offer",
      title: "Exclusive Rewards",
      description: "Unlock special badges and perks as a top referrer",
      iconColor: "#6366F1",
      iconBg: "#E0E7FF",
    },
    {
      icon: "speed",
      title: "Instant Payouts",
      description: "Get paid quickly once referral sales are confirmed",
      iconColor: "#3B82F6",
      iconBg: "#DBEAFE",
    },
  ];

  const mockReferrals = [
    {
      name: "Sarah M.",
      status: "active" as const,
      earningsPerSale: "+$5.00",
    },
    {
      name: "John D.",
      status: "active" as const,
      earningsPerSale: "+$3.50",
    },
    {
      name: "Emma L.",
      status: "pending" as const,
      earningsPerSale: "Pending",
    },
  ];

  const handleCopy = useCallback(async () => {
    if (copying) return;
    try {
      setCopying(true);
      await Clipboard.setStringAsync(referralCode);
      toast.success("Referral code copied to clipboard!");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy code");
    } finally {
      setCopying(false);
    }
  }, [referralCode, toast, copying]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out Thriftverse! Use my referral code ${referralCode} to get exclusive deals on secondhand fashion.`,
        title: "Join Thriftverse",
        url: "https://thriftverse.shop",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [referralCode]);

  return (
    <ScreenLayout
      title="Referral Code"
      contentBackgroundColor="#F5F5F5"
      headerBackgroundColor="#F5F5F5"
      paddingHorizontal={0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="py-6">
          <ReferralHeroSection />
          <ReferralCodeDisplay
            code={referralCode}
            onCopy={handleCopy}
            onShare={handleShare}
          />
          <ReferralStats
            totalReferrals={mockStats.totalReferrals}
            totalEarnings={mockStats.totalEarnings}
            activeReferrals={mockStats.activeReferrals}
          />
          <ReferralBenefits benefits={mockBenefits} />
          <ReferralHistory referrals={mockReferrals} />

          <View className="px-4 gap-2 mt-2">
            <Typography
              variation="caption"
              className="text-slate-500 font-sans-medium text-xs text-center"
            >
              Share your referral code on social media, messaging, or email to
              earn commissions
            </Typography>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
