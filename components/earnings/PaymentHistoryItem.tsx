import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { View } from "react-native";
import {
  BodySemiboldText,
  CaptionText,
  BodySmallSemiboldText,
} from "@/components/Typography";

export type PaymentRequestStatus = "pending" | "released" | "rejected";

interface PaymentHistoryItemProps {
  amount: number;
  createdAt: string;
  status: PaymentRequestStatus;
  adminNotes?: string | null;
}

const STATUS_CONFIG: Record<
  PaymentRequestStatus,
  {
    bg: string;
    iconBg: string;
    text: string;
    label: string;
    iconName: string;
  }
> = {
  pending: {
    bg: "rgba(253,242,179,0.7)",
    iconBg: "#FEF3C7",
    text: "#D97706",
    label: "PENDING",
    iconName: "clock.fill",
  },
  released: {
    bg: "rgba(209,231,209,0.7)",
    iconBg: "#D1FAE5",
    text: "#059669",
    label: "APPROVED",
    iconName: "checkmark.circle.fill",
  },
  rejected: {
    bg: "rgba(254,226,226,0.7)",
    iconBg: "#FEE2E2",
    text: "#DC2626",
    label: "REJECTED",
    iconName: "xmark.circle.fill",
  },
};

const formatAmount = (amount: number) =>
  `रु ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function PaymentHistoryItem({
  amount,
  createdAt,
  status,
  adminNotes,
}: PaymentHistoryItemProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(59,48,48,0.05)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left: icon + info */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          {/* Status icon circle */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: config.iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSymbol name={config.iconName} size={20} color={config.text} />
          </View>

          {/* Title + date */}
          <View style={{ flex: 1 }}>
            <BodySemiboldText style={{ fontSize: 14, color: "#3B2F2F", marginBottom: 2 }}>
              Withdrawal Request
            </BodySemiboldText>
            <CaptionText style={{ color: "rgba(59,48,48,0.4)", fontSize: 12 }}>
              {formatDate(createdAt)}
            </CaptionText>
          </View>
        </View>

        {/* Right: amount + status badge */}
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <BodySemiboldText style={{ fontSize: 14, color: "#3B2F2F" }}>
            {formatAmount(amount)}
          </BodySemiboldText>
          <BodySmallSemiboldText
            style={{
              fontSize: 10,
              color: config.text,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {config.label}
          </BodySmallSemiboldText>
        </View>
      </View>

      {/* Admin notes — shown for non-pending */}
      {adminNotes && status !== "pending" && (
        <View
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "rgba(59,48,48,0.06)",
          }}
        >
          <CaptionText style={{ color: "rgba(59,48,48,0.5)", fontSize: 12 }}>
            Note: {adminNotes}
          </CaptionText>
        </View>
      )}
    </View>
  );
}
