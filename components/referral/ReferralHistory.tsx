import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface ReferredUserProps {
  name: string;
  status: "active" | "pending";
  earningsPerSale: string;
}

interface ReferralHistoryProps {
  referrals: ReferredUserProps[];
}

export function ReferralHistory({ referrals }: ReferralHistoryProps) {
  return (
    <View className="px-4 mb-6">
      <Typography
        variation="caption"
        className="text-slate-500 font-sans-bold uppercase tracking-widest mb-4"
      >
        Recent Referrals
      </Typography>

      <View className="gap-2">
        {referrals.length === 0 ? (
          <View className="bg-white rounded-2xl p-4 border border-slate-200 items-center gap-2">
            <Typography
              variation="body-sm"
              className="text-slate-400 text-center"
            >
              No referrals yet. Share your code to get started!
            </Typography>
          </View>
        ) : (
          referrals.map((referral, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 border border-slate-200 flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Typography
                  variation="body-sm"
                  className="text-brand-espresso font-sans-bold"
                >
                  {referral.name}
                </Typography>
                <Typography variation="caption" className="text-slate-500 mt-1">
                  Status: {referral.status}
                </Typography>
              </View>
              <Typography
                variation="body-sm"
                className="text-green-600 font-sans-bold"
              >
                {referral.earningsPerSale}
              </Typography>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
