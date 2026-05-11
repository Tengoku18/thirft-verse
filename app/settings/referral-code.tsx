import { ScreenLayout } from "@/components/layouts";
import {
  ReferralBenefits,
  ReferralCodeDisplay,
  ReferralHeroSection,
  ReferralHistory,
  ReferralStats,
} from "@/components/referral";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import {
  generateReferralCode,
  getMyReferralCode,
  getReferralStats,
  getReferredUsers,
} from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import { useAppSelector } from "@/store/hooks";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Share, View } from "react-native";

const REFERRAL_BENEFITS = [
  {
    icon: "indianrupeesign.circle.fill",
    title: "20% Profit Share",
    description: "Earn 20% of platform profit for every sale made through your referral",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
  },
  {
    icon: "trophy",
    title: "Monthly Cash Rewards",
    description: "Win Rs. 1,000–Rs. 2,000 monthly cash bonuses for top curators on the leaderboard",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
  },
  {
    icon: "star.fill",
    title: "Priority Product Exposure",
    description: "Your recommended products get priority placement across the marketplace",
    iconColor: "#6366F1",
    iconBg: "#E0E7FF",
  },
  {
    icon: "chart.line.uptrend.xyaxis",
    title: "Real-Time Tracking",
    description: "Track your influence and referral performance in real-time",
    iconColor: "#3B82F6",
    iconBg: "#DBEAFE",
  },
];

export default function ReferralCodeScreen() {
  const toast = useToast();
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  const [codeLoading, setCodeLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [myCode, setMyCode] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: "—",
    activeReferrals: 0,
  });
  const [referralHistory, setReferralHistory] = useState<
    { name: string; status: "active" | "pending"; earningsPerSale: string }[]
  >([]);

  const profile = useAppSelector((state) => state.profile.profile);
  const isFounder = profile?.is_founder ?? false;
  const userId = profile?.id;

  useEffect(() => {
    if (!isFounder || !userId) {
      setCodeLoading(false);
      return;
    }
    loadCodeAndStats(userId);
  }, [isFounder, userId]);

  const loadCodeAndStats = async (uid: string) => {
    setCodeLoading(true);
    try {
      const codeResult = await getMyReferralCode(uid);
      setMyCode(codeResult.code);

      if (codeResult.referralId) {
        const [statsResult, usersResult] = await Promise.all([
          getReferralStats(uid),
          getReferredUsers(uid),
        ]);

        setStats({
          totalReferrals: statsResult.totalReferred,
          totalEarnings: "—",
          activeReferrals: statsResult.activeCommissions,
        });

        const now = new Date().toISOString();
        setReferralHistory(
          usersResult.map((u) => ({
            name: u.storeUsername || u.referredEmail.split("@")[0],
            status: u.commissionExpiresAt > now ? "active" : "pending",
            earningsPerSale: u.commissionExpiresAt > now ? "Active" : "Expired",
          })),
        );
      }
    } catch (err) {
      console.error("Error loading referral data:", err);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (generating || !userId) return;
    setGenerating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        toast.error("Could not retrieve account email. Please sign in again.");
        return;
      }

      const result = await generateReferralCode(userId, user.email);
      if (result.success && result.code) {
        setMyCode(result.code);
        toast.success("Referral code generated!");
      } else {
        toast.error(result.error ?? "Failed to generate code. Please try again.");
      }
    } catch (err) {
      console.error("Error generating referral code:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setGenerating(false);
    }
  }, [generating, userId, toast]);

  const handleCopy = useCallback(async () => {
    if (copying || !myCode) return;
    try {
      setCopying(true);
      await Clipboard.setStringAsync(myCode);
      toast.success("Referral code copied to clipboard!");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy code");
    } finally {
      setCopying(false);
    }
  }, [myCode, toast, copying]);

  const handleShare = useCallback(async () => {
    if (!myCode) return;
    try {
      await Share.share({
        message: `Check out Thriftverse! Use my referral code ${myCode} to get exclusive deals on secondhand fashion.`,
        title: "Join Thriftverse",
        url: "https://thriftverse.shop",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [myCode]);

  if (!isFounder) {
    return (
      <ScreenLayout
        title="Referral Code"
        contentBackgroundColor="#F5F5F5"
        paddingHorizontal={0}
      >
        <View className="flex-1 items-center justify-center px-8 gap-6">
          <View className="w-20 h-20 rounded-full bg-brand-beige/50 items-center justify-center">
            <Typography variation="h2">🔒</Typography>
          </View>
          <View className="items-center gap-2">
            <Typography
              variation="h3"
              className="text-brand-espresso font-folito-bold text-center"
            >
              Founder Circle Only
            </Typography>
            <Typography
              variation="body-sm"
              className="text-slate-500 text-center leading-relaxed"
            >
              Referral codes are an exclusive Founding Creator benefit. Join the
              Founder Circle to unlock your unique referral code and start
              earning 20% profit share.
            </Typography>
          </View>
          <Button
            label="View Founder Circle"
            onPress={() => router.replace("/settings/founder-circle" as any)}
          />
        </View>
      </ScreenLayout>
    );
  }

  if (codeLoading) {
    return (
      <ScreenLayout
        title="Referral Code"
        contentBackgroundColor="#F5F5F5"
        paddingHorizontal={0}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6B705C" />
        </View>
      </ScreenLayout>
    );
  }

  if (!myCode) {
    return (
      <ScreenLayout
        title="Referral Code"
        contentBackgroundColor="#F5F5F5"
        paddingHorizontal={0}
      >
        <View className="flex-1 items-center justify-center px-8 gap-6">
          <View className="w-20 h-20 rounded-full bg-brand-beige/50 items-center justify-center">
            <Typography variation="h2">🎟️</Typography>
          </View>
          <View className="items-center gap-2">
            <Typography
              variation="h3"
              className="text-brand-espresso font-folito-bold text-center"
            >
              No Referral Code Yet
            </Typography>
            <Typography
              variation="body-sm"
              className="text-slate-500 text-center leading-relaxed"
            >
              Generate your unique referral code and start earning 20% profit
              share for every user you bring to Thriftverse.
            </Typography>
          </View>
          <Button
            label="Generate Referral Code"
            onPress={handleGenerate}
            isLoading={generating}
            disabled={generating}
          />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      title="Referral Code"
      contentBackgroundColor="#F5F5F5"
      paddingHorizontal={0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="py-6">
          <ReferralHeroSection />
          <ReferralCodeDisplay
            code={myCode}
            onCopy={handleCopy}
            onShare={handleShare}
          />
          <ReferralStats
            totalReferrals={stats.totalReferrals}
            totalEarnings={stats.totalEarnings}
            activeReferrals={stats.activeReferrals}
          />
          <ReferralBenefits benefits={REFERRAL_BENEFITS} />
          <ReferralHistory referrals={referralHistory} />

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
