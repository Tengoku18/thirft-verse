import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface StatItemProps {
  value: string | number;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <View className="flex-1 items-center justify-center py-3.5 bg-brand-surface rounded-2xl shadow-sm border border-primary/5">
      <Typography variation="h4" className="text-brand-espresso font-folito-bold">
        {value}
      </Typography>
      <Typography
        variation="caption"
        className="text-ui-secondary font-sans-semibold uppercase tracking-widest mt-0.5"
        style={{ fontSize: 10 }}
      >
        {label}
      </Typography>
    </View>
  );
}

interface StoreStatsProps {
  productCount: number;
  followerCount?: number;
  salesCount?: number;
}

export function StoreStats({
  productCount,
  followerCount = 0,
  salesCount = 0,
}: StoreStatsProps) {
  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

  return (
    <View className="flex-row px-5 gap-2.5 mb-1">
      <StatItem value={productCount} label="Products" />
      <StatItem value={fmt(followerCount)} label="Followers" />
      <StatItem value={fmt(salesCount)} label="Sales" />
    </View>
  );
}
