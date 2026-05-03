import { Typography } from "@/components/ui/Typography";
import { getProductImageUrl } from "@/lib/storage-helpers";
import dayjs from "dayjs";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { BagIcon, TagFillIcon } from "@/components/icons";

// ─────────────── Types ───────────────
export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id: string;
  type: "order" | "sold_product";
  order_code: string | null;
  product_title: string;
  product_image: string | null;
  buyer_name: string;
  amount: number;
  shipping_fee: number;
  payment_method: string;
  status: string;
  created_at: string;
  quantity: number;
  items_count: number;
  items_subtotal: number;
  discounted_items_total: number;
  offer_code_text: string | null;
  offer_discount_percent: number | null;
  offer_discount_amount: number;
  originalId: string;
}

// ─────────────── Status config ───────────────
const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pending:    { bg: "#FEF3C7", text: "#D97706", label: "Pending" },
  processing: { bg: "#DBEAFE", text: "#2563EB", label: "Processing" },
  completed:  { bg: "#D1FAE5", text: "#059669", label: "Completed" },
  cancelled:  { bg: "#FEE2E2", text: "#E11D48", label: "Cancelled" },
  refunded:   { bg: "#EDE9FE", text: "#7C3AED", label: "Refunded" },
};

const DEFAULT_STATUS = { bg: "#F3F4F6", text: "#6B7280", label: "Unknown" };

// Action button config per status
const ACTION_CONFIG: Record<
  string,
  { label: string; dark: boolean }
> = {
  pending:    { label: "Manage",  dark: true  },
  processing: { label: "Details", dark: true  },
  completed:  { label: "Details", dark: false },
  cancelled:  { label: "Support", dark: false },
  refunded:   { label: "Receipt", dark: false },
};

const DEFAULT_ACTION = { label: "View", dark: false };

const formatPrice = (amount: number) =>
  `Rs. ${amount.toLocaleString("en-IN")}`;

// ─────────────── Component ───────────────
interface OrderCardProps {
  item: OrderItem;
  onPress: () => void;
}

export function OrderCard({ item, onPress }: OrderCardProps) {
  const status = STATUS_CONFIG[item.status] ?? DEFAULT_STATUS;
  const action = ACTION_CONFIG[item.status] ?? DEFAULT_ACTION;
  const dateStr = dayjs(item.created_at).format("MMM D, YYYY");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(59,48,48,0.05)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        padding: 16,
      }}
    >
      {/* ── Top row: status badge + date ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: status.bg,
          }}
        >
          <Typography
            variation="caption"
            style={{
              color: status.text,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            {status.label}
          </Typography>
        </View>

        <Typography variation="caption" style={{ color: "rgba(59,48,48,0.45)", fontSize: 12, fontWeight: "500" }}>
          {dateStr}
        </Typography>
      </View>

      {/* ── Content row: image + details ── */}
      <View style={{ flexDirection: "row", gap: 14 }}>
        {/* Product image */}
        <View>
          {item.product_image ? (
            <Image
              source={{ uri: getProductImageUrl(item.product_image) }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                backgroundColor: "#F3F4F6",
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                backgroundColor: "#F3F4F6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BagIcon width={28} height={28} color="#9CA3AF" />
            </View>
          )}
          {/* Multi-item badge */}
          {item.items_count > 1 && (
            <View
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                backgroundColor: "#3B2F2F",
                borderRadius: 11,
                minWidth: 22,
                height: 22,
                paddingHorizontal: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variation="caption" style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "800" }}>
                {item.items_count}
              </Typography>
            </View>
          )}
        </View>

        {/* Details */}
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Typography
              variation="label"
              style={{ fontSize: 14, color: "#3B2F2F", marginBottom: 3 }}
              numberOfLines={1}
            >
              {item.product_title}
            </Typography>
            <Typography variation="caption" style={{ color: "rgba(59,48,48,0.55)", fontSize: 12 }}>
              Buyer: {item.buyer_name} • Qty: {item.quantity}
            </Typography>
          </View>

          {/* Price + action button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Typography variation="label" style={{ fontSize: 18, color: "#D4A373" }}>
              {formatPrice(item.amount)}
            </Typography>

            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.8}
              style={{
                backgroundColor: action.dark ? "#3B2F2F" : "rgba(59,48,48,0.08)",
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 10,
              }}
            >
              <Typography
                variation="label"
                style={{
                  fontSize: 12,
                  color: action.dark ? "#FFFFFF" : "#3B2F2F",
                }}
              >
                {action.label}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Offer code badge */}
          {item.offer_code_text && item.offer_discount_amount > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                backgroundColor: "#ECFDF5",
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 3,
                marginTop: 6,
              }}
            >
              <TagFillIcon width={10} height={10} color="#059669" />
              <Typography
                variation="caption"
                style={{ color: "#059669", marginLeft: 4, fontSize: 10, fontWeight: "700" }}
              >
                {item.offer_code_text}
                {item.offer_discount_percent
                  ? ` (${item.offer_discount_percent}% OFF)`
                  : ""}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
