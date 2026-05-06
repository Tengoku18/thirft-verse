import { UserIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { ActivityIndicator, Modal, Pressable, View } from "react-native";

export interface DataSummary {
  name: string;
  email: string;
  memberSince: string;
  activeListings: number;
  totalListings: number;
  totalOrders: number;
}

interface DataSummarySheetProps {
  visible: boolean;
  loading: boolean;
  summary: DataSummary | null;
  onClose: () => void;
  bottomInset: number;
}

export function DataSummarySheet({
  visible,
  loading,
  summary,
  onClose,
  bottomInset,
}: DataSummarySheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View
        className="bg-white rounded-t-3xl px-5 pt-5"
        style={{ paddingBottom: Math.max(bottomInset, 24) }}
      >
        <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-5" />

        <View className="flex-row items-center gap-3 mb-5">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: "rgba(59,48,48,0.07)" }}
          >
            <UserIcon width={20} height={20} color="#3B3030" />
          </View>
          <View>
            <Typography variation="h3" className="text-brand-espresso">
              Data Summary
            </Typography>
            <Typography variation="body-sm" className="text-slate-400">
              What Thriftverse holds about you
            </Typography>
          </View>
        </View>

        {loading || !summary ? (
          <View className="py-12 items-center">
            <ActivityIndicator color="#3B3030" />
          </View>
        ) : (
          <>
            <SummaryGroup label="ACCOUNT">
              <SummaryRow label="Name" value={summary.name} />
              <SummaryRow label="Email" value={summary.email} last />
            </SummaryGroup>
            <SummaryGroup label="MEMBERSHIP">
              <SummaryRow label="Member Since" value={summary.memberSince} last />
            </SummaryGroup>
            <SummaryGroup label="ACTIVITY" last>
              <SummaryRow label="Active Listings" value={String(summary.activeListings)} />
              <SummaryRow label="Total Listings" value={String(summary.totalListings)} />
              <SummaryRow label="Orders Received" value={String(summary.totalOrders)} last />
            </SummaryGroup>
          </>
        )}

        <Pressable
          className="bg-brand-espresso rounded-2xl py-4 items-center active:opacity-80 mt-2"
          onPress={onClose}
        >
          <Typography variation="body" className="text-white font-sans-semibold">
            Done
          </Typography>
        </Pressable>
      </View>
    </Modal>
  );
}

function SummaryGroup({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View className={`bg-gray-50 rounded-2xl overflow-hidden ${last ? "mb-5" : "mb-3"}`}>
      <View className="px-4 py-2.5 border-b border-gray-100">
        <Typography
          variation="body-sm"
          className="text-slate-400 font-sans-semibold"
          style={{ fontSize: 11, letterSpacing: 0.8 }}
        >
          {label}
        </Typography>
      </View>
      {children}
    </View>
  );
}

function SummaryRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className="flex-row items-center justify-between px-4 py-3"
      style={!last ? { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" } : undefined}
    >
      <Typography variation="body-sm" className="text-slate-500">
        {label}
      </Typography>
      <Typography variation="body-sm" className="text-brand-espresso font-sans-semibold">
        {value}
      </Typography>
    </View>
  );
}
