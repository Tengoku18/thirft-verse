import { Typography } from "@/components/ui/Typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View } from "react-native";
import { ReferralStatCard } from "./ReferralStatCard";

interface ReferralStatsProps {
  totalReferrals: number;
  totalEarnings: string;
  activeReferrals: number;
}

export function ReferralStats({
  totalReferrals,
  totalEarnings,
  activeReferrals,
}: ReferralStatsProps) {
  return (
    <View className="px-4 mb-6 gap-3">
      <Typography
        variation="caption"
        className="text-slate-500 font-sans-bold uppercase tracking-widest mb-1"
      >
        Your Stats
      </Typography>

      <View className="flex-row gap-3">
        <ReferralStatCard
          label="Total Referrals"
          value={totalReferrals}
          icon={<Ionicons name="people" size={20} color="#6B705C" />}
        />
        <ReferralStatCard
          label="Earnings"
          value={totalEarnings}
          icon={<Ionicons name="cash" size={20} color="#059669" />}
        />
        <ReferralStatCard
          label="Active"
          value={activeReferrals}
          icon={<Ionicons name="star" size={20} color="#D97706" />}
        />
      </View>
    </View>
  );
}
