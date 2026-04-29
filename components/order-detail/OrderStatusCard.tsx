import { Typography } from "@/components/ui/Typography";

import {
  CheckMarkCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  RefundIcon,
  ShippingBoxIcon,
  XCircleFillIcon,
} from "@/components/icons";
import React from "react";
import { View } from "react-native";

// ─────────────── Types ───────────────

interface OrderStatusCardProps {
  status: string;
  orderCode: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: string;
  ncmDeliveryStatus?: string | null;
}

// ─────────────── Icon mapping ───────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  "clock.fill": <ClockIcon width={12} height={12} color="#D97706" />,
  "shippingbox.fill": (
    <ShippingBoxIcon width={12} height={12} color="#2563EB" />
  ),
  "checkmark.circle.fill": (
    <CheckMarkCircleIcon width={12} height={12} color="#059669" />
  ),
  "xmark.circle.fill": (
    <XCircleFillIcon width={12} height={12} color="#DC2626" />
  ),
  "arrow.uturn.left.circle.fill": (
    <RefundIcon width={12} height={12} color="#7C3AED" />
  ),
  "questionmark.circle": (
    <QuestionMarkCircleIcon width={12} height={12} color="#6B7280" />
  ),
};

// ─────────────── Status config ───────────────

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; label: string; iconKey: string }
> = {
  pending: {
    bg: "#FEF3C7",
    text: "#D97706",
    label: "Pending",
    iconKey: "clock.fill",
  },
  processing: {
    bg: "#DBEAFE",
    text: "#2563EB",
    label: "Processing",
    iconKey: "shippingbox.fill",
  },
  completed: {
    bg: "#D1FAE5",
    text: "#059669",
    label: "Completed",
    iconKey: "checkmark.circle.fill",
  },
  cancelled: {
    bg: "#FEE2E2",
    text: "#DC2626",
    label: "Cancelled",
    iconKey: "xmark.circle.fill",
  },
  refunded: {
    bg: "#E9D5FF",
    text: "#7C3AED",
    label: "Refunded",
    iconKey: "arrow.uturn.left.circle.fill",
  },
};

const DEFAULT_STATUS = {
  bg: "#F3F4F6",
  text: "#6B7280",
  label: "Unknown",
  iconKey: "questionmark.circle",
};

// ─────────────── Main component ───────────────

export function OrderStatusCard({
  status,
  orderCode,
  itemsCount,
  totalAmount,
  paymentMethod,
  ncmDeliveryStatus,
}: OrderStatusCardProps) {
  const cfg = STATUS_CONFIG[status] ?? DEFAULT_STATUS;

  const displayLabel = ncmDeliveryStatus || cfg.label;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {/* ── Top info row ── */}
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {/* Left: status badge + item count */}
        <View style={{ gap: 6 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: cfg.bg,
              alignSelf: "flex-start",
            }}
          >
            {ICON_MAP[cfg.iconKey]}
            <Typography variation="caption"
              style={{
                color: cfg.text,
                fontSize: 12,
                fontWeight: "600",
                marginLeft: 5,
              }}
            >
              {displayLabel}
            </Typography>
          </View>
          <Typography variation="body-sm"
            style={{ color: "rgba(59,48,48,0.55)", fontSize: 13 }}
          >
            {itemsCount === 1 ? "1 item" : `${itemsCount} items`}
          </Typography>
        </View>

        {/* Right: amount + payment method */}
        <View style={{ alignItems: "flex-end" }}>
          <Typography variation="h2" style={{ fontSize: 22, color: "#3B2F2F" }}>
            Rs. {totalAmount.toLocaleString()}
          </Typography>
          <Typography variation="caption"
            style={{
              color: "rgba(59,48,48,0.4)",
              fontSize: 11,
              letterSpacing: 0.5,
              marginTop: 2,
            }}
          >
            PAID VIA {paymentMethod.toUpperCase()}
          </Typography>
        </View>
      </View>
    </View>
  );
}
