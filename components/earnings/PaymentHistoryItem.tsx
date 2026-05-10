import { Typography } from "@/components/ui/Typography";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export type PaymentRequestStatus =
  | "pending"
  | "approved"
  | "released"
  | "rejected";

interface PaymentHistoryItemProps {
  id: string;
  amount: number;
  createdAt: string;
  status: PaymentRequestStatus;
  adminNotes?: string | null;
  transactionId?: string | null;
  processedAt?: string | null;
  releasedAt?: string | null;
}

const formatAmount = (amount: number) =>
  `रु ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatShortDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_META: Record<
  PaymentRequestStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending: {
    label: "Under review",
    color: "#B45309",
    bg: "#FFFBEB",
    dot: "#D97706",
  },
  approved: {
    label: "Payment coming soon",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    dot: "#3B82F6",
  },
  released: {
    label: "Payment sent to your eSewa",
    color: "#065F46",
    bg: "#ECFDF5",
    dot: "#10B981",
  },
  rejected: {
    label: "Request rejected",
    color: "#B91C1C",
    bg: "#FEF2F2",
    dot: "#EF4444",
  },
};

export function PaymentHistoryItem({
  id,
  amount,
  createdAt,
  status,
  adminNotes,
  transactionId,
}: PaymentHistoryItemProps) {
  const meta = STATUS_META[status] ?? STATUS_META.pending;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => router.push(`/earnings/payment/${id}` as never)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(59,48,48,0.07)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Amount + date */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variation="h2"
          style={{ color: "#3B2F2F", fontWeight: "700" }}
        >
          {formatAmount(amount)}
        </Typography>
        <Typography variation="caption" style={{ color: "rgba(59,48,48,0.4)" }}>
          {formatShortDate(createdAt)}
        </Typography>
      </View>

      {/* Status indicator */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
        }}
      >
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: meta.dot,
          }}
        />
        <View
          style={{
            backgroundColor: meta.bg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Typography
            variation="caption"
            style={{ fontSize: 11, color: meta.color, fontWeight: "600" }}
          >
            {meta.label}
          </Typography>
        </View>
      </View>

      {/* Rejection note preview */}
      {adminNotes && status === "rejected" && (
        <View
          style={{
            marginBottom: 12,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "rgba(59,48,48,0.06)",
          }}
        >
          <Typography
            variation="caption"
            style={{ color: "rgba(59,48,48,0.5)", fontSize: 12 }}
            numberOfLines={1}
          >
            Reason: {adminNotes}
          </Typography>
        </View>
      )}

      {/* Footer: TXN preview + view hint */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: "rgba(59,48,48,0.06)",
        }}
      >
        {transactionId && status === "released" ? (
          <Typography
            variation="caption"
            style={{ color: "rgba(59,48,48,0.4)", fontSize: 11 }}
          >
            {"TXN: " +
              (transactionId.length > 20
                ? transactionId.slice(0, 20) + "…"
                : transactionId)}
          </Typography>
        ) : (
          <View />
        )}
        <Typography
          variation="caption"
          style={{
            color: "#3B2F2F",
            fontSize: 11,
            fontWeight: "600",
            opacity: 0.35,
          }}
        >
          View details →
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
