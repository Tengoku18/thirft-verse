import CashIcon from "@/components/icons/CashIcon";
import CheckmarkIcon from "@/components/icons/CheckmarkIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";
import { RevenueStatCard } from "./RevenueStatCard";

interface RevenueOverviewProps {
  pendingAmount: number;
  confirmedAmount: number;
  withdrawnAmount: number;
  currencySymbol?: string;
}

const formatCurrency = (amount: number, symbol: string): string => {
  if (amount >= 1000000) return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}k`;
  return `${symbol}${amount.toFixed(2)}`;
};

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  pendingAmount,
  confirmedAmount,
  withdrawnAmount,
  currencySymbol = "Rs. ",
}) => {
  return (
    <View className="px-5 mt-6">
      <Typography
        variation="h5"
        style={{ fontSize: 16, color: "#3B2F2F", marginBottom: 12 }}
      >
        Revenue Overview
      </Typography>
      <View className="flex-row" style={{ gap: 12 }}>
        <RevenueStatCard
          label="Pending"
          amount={formatCurrency(pendingAmount, currencySymbol)}
          icon={
            <ClockIcon size={20} color="#D97706" />
          }
          bgColor="#FFFBEB"
          borderColor="#FEF3C7"
          labelColor="#B45309"
        />
        <RevenueStatCard
          label="Confirmed"
          amount={formatCurrency(confirmedAmount, currencySymbol)}
          icon={<CheckmarkIcon size={20} color="#059669" />}
          bgColor="#ECFDF5"
          borderColor="#D1FAE5"
          labelColor="#047857"
        />
        <RevenueStatCard
          label="Withdrawn"
          amount={formatCurrency(withdrawnAmount, currencySymbol)}
          icon={<CashIcon size={20} color="#64748B" />}
          bgColor="#F1F5F9"
          borderColor="#E2E8F0"
          labelColor="#475569"
        />
      </View>
    </View>
  );
};
