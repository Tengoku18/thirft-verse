import {
  BodyMediumText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
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

// ─────────────── Status config ───────────────

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  pending:    { bg: "#FEF3C7", text: "#D97706", label: "Pending",    icon: "clock.fill" },
  processing: { bg: "#DBEAFE", text: "#2563EB", label: "Processing", icon: "shippingbox.fill" },
  completed:  { bg: "#D1FAE5", text: "#059669", label: "Completed",  icon: "checkmark.circle.fill" },
  cancelled:  { bg: "#FEE2E2", text: "#DC2626", label: "Cancelled",  icon: "xmark.circle.fill" },
  refunded:   { bg: "#E9D5FF", text: "#7C3AED", label: "Refunded",   icon: "arrow.uturn.left.circle.fill" },
};

const DEFAULT_STATUS = { bg: "#F3F4F6", text: "#6B7280", label: "Unknown", icon: "questionmark.circle" };

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
      <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
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
            <IconSymbol name={cfg.icon as any} size={12} color={cfg.text} style={{ marginRight: 5 }} />
            <CaptionText style={{ color: cfg.text, fontSize: 12, fontWeight: "600" }}>
              {displayLabel}
            </CaptionText>
          </View>
          <BodyMediumText style={{ color: "rgba(59,48,48,0.55)", fontSize: 13 }}>
            {itemsCount === 1 ? "1 item" : `${itemsCount} items`}
          </BodyMediumText>
        </View>

        {/* Right: amount + payment method */}
        <View style={{ alignItems: "flex-end" }}>
          <HeadingBoldText style={{ fontSize: 22, color: "#3B2F2F" }}>
            Rs. {totalAmount.toLocaleString()}
          </HeadingBoldText>
          <CaptionText style={{ color: "rgba(59,48,48,0.4)", fontSize: 11, letterSpacing: 0.5, marginTop: 2 }}>
            PAID VIA {paymentMethod.toUpperCase()}
          </CaptionText>
        </View>
      </View>

    </View>
  );
}
