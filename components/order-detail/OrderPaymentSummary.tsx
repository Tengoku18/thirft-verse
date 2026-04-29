import { Typography } from "@/components/ui/Typography";

import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { ArrowUpRightIcon, CashIcon } from "@/components/icons";

interface OrderPaymentSummaryProps {
  method: string;
  transactionCode: string | null;
  subtotal: number;
  discountedSubtotal: number;
  offerCode: string | null;
  offerDiscountPercent: number | null;
  offerDiscountAmount: number;
  shippingFee: number;
  sellersEarning: number;
  /** Per-item breakdown for multi-product orders */
  items?: { title: string; quantity: number; price: number }[];
}

function SummaryRow({
  label,
  value,
  valueColor,
  isLast = false,
  bold = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
  bold?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 11,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "rgba(59,48,48,0.06)",
      }}
    >
      <Typography variation="body-sm" style={{ fontSize: 13, color: "rgba(59,48,48,0.55)" }}>
        {label}
      </Typography>
      {bold ? (
        <Typography variation="label" style={{ fontSize: 14, color: valueColor ?? "#3B2F2F" }}>
          {value}
        </Typography>
      ) : (
        <Typography variation="body-sm" style={{ fontSize: 14, color: valueColor ?? "#3B2F2F" }}>
          {value}
        </Typography>
      )}
    </View>
  );
}

export function OrderPaymentSummary({
  method,
  transactionCode,
  subtotal,
  discountedSubtotal,
  offerCode,
  offerDiscountPercent,
  offerDiscountAmount,
  shippingFee,
  sellersEarning,
  items,
}: OrderPaymentSummaryProps) {
  const marketplaceFee = Math.round(discountedSubtotal * 0.05);
  const hasOffer = !!(offerCode || offerDiscountPercent || offerDiscountAmount > 0);
  const hasItemBreakdown = items && items.length > 1;

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
      {/* Section label */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}>
        <Typography variation="caption"
          style={{ fontSize: 11, color: "rgba(59,48,48,0.4)", letterSpacing: 0.8, fontWeight: "700" }}
        >
          PAYMENT SUMMARY
        </Typography>
      </View>

      {/* Method + transaction */}
      <SummaryRow label="Payment Method" value={method} bold />
      {transactionCode && <SummaryRow label="Transaction ID" value={transactionCode} />}

      {/* Divider before amounts */}
      <View style={{ height: 1, backgroundColor: "rgba(59,48,48,0.06)", marginHorizontal: 16 }} />

      {/* Per-item breakdown (multi-product) */}
      {hasItemBreakdown &&
        items!.map((item, idx) => (
          <SummaryRow
            key={idx}
            label={`${item.title} ×${item.quantity}`}
            value={`Rs. ${item.price.toLocaleString()}`}
          />
        ))}

      {/* Subtotal */}
      <SummaryRow
        label={hasItemBreakdown ? "Items Total" : "Subtotal"}
        value={`Rs. ${subtotal.toLocaleString()}`}
        bold
      />

      {/* Offer code */}
      {hasOffer && (
        <>
          <SummaryRow
            label="Offer Code"
            value={
              offerCode && offerDiscountPercent
                ? `${offerCode} (${offerDiscountPercent}% OFF)`
                : offerCode ||
                  (offerDiscountPercent ? `${offerDiscountPercent}% OFF` : "Applied")
            }
            valueColor="#059669"
          />
          {offerDiscountAmount > 0 && (
            <SummaryRow
              label="Discount"
              value={`- Rs. ${offerDiscountAmount.toLocaleString()}`}
              valueColor="#059669"
            />
          )}
          {discountedSubtotal < subtotal && (
            <SummaryRow
              label="Discounted Total"
              value={`Rs. ${discountedSubtotal.toLocaleString()}`}
              bold
            />
          )}
        </>
      )}

      {/* Shipping fee */}
      {shippingFee > 0 && (
        <SummaryRow
          label="Shipping Fee"
          value={`Rs. ${shippingFee.toLocaleString()}`}
        />
      )}

      {/* Marketplace fee */}
      <SummaryRow
        label="Marketplace Fee (5%)"
        value={`- Rs. ${marketplaceFee.toLocaleString()}`}
        valueColor="#DC2626"
      />

      {/* Total earnings — highlighted row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderTopWidth: 1,
          borderTopColor: "rgba(59,48,48,0.08)",
          borderStyle: "dashed",
          backgroundColor: "#FBF8F4",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <CashIcon width={16} height={16} color="#D4A373" />
          <Typography variation="label" style={{ fontSize: 14, color: "#3B2F2F" }}>
            Total Earnings
          </Typography>
        </View>
        <Typography variation="h2" style={{ fontSize: 20, color: "#D4A373" }}>
          Rs. {Math.round(sellersEarning).toLocaleString()}
        </Typography>
      </View>

      {/* Pricing info link */}
      <TouchableOpacity
        onPress={() =>
          Linking.openURL("https://www.thriftverse.shop/blogs/payment-and-pricing")
        }
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 12,
          gap: 4,
          borderTopWidth: 1,
          borderTopColor: "rgba(59,48,48,0.05)",
        }}
      >
        <Typography variation="body-sm" style={{ fontSize: 12, color: "rgba(59,48,48,0.4)" }}>
          How does pricing work?
        </Typography>
        <ArrowUpRightIcon width={11} height={11} color="rgba(59,48,48,0.35)" />
      </TouchableOpacity>
    </View>
  );
}
